import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'crypto';
import { deriveEncryptionKey } from '../../config/env.validation';

/**
 * Single source of truth for symmetric encryption of secrets at rest.
 *
 * New ciphertext uses AES-256-GCM (authenticated) and is tagged `v1:`.
 * Legacy AES-256-CBC ciphertext written before this service existed
 * (`<iv_hex>:<ct_hex>`, produced by AiConfigService) still decrypts, so
 * previously stored AI provider keys keep working. CBC is never written again.
 *
 * Callers must treat plaintext as short-lived: decrypt at the point of use,
 * never persist or log the result.
 */
@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly key: Buffer;
  private readonly legacyKey: Buffer;

  private static readonly VERSION = 'v1';
  private static readonly IV_BYTES = 12; // GCM standard nonce length
  private static readonly LEGACY_IV_BYTES = 16; // CBC block size

  constructor(private readonly configService: ConfigService) {
    const raw = this.configService.get<string>('security.encryptionKey') as string;

    // Single source of truth for the key contract, shared with validateEnv:
    // exactly 64 hex characters (optionally `hex:`-prefixed). validateEnv has
    // already proved this decodes at boot, so this cannot throw here.
    this.key = deriveEncryptionKey(raw);

    // Legacy read path only. AiConfigService derived its CBC key as
    // `raw.padEnd(32).slice(0, 32)` in UTF-8, which differs from the hex
    // decoding above, so old ciphertext needs the original derivation.
    //
    // Note this is already unreachable for data written before the Phase 0 key
    // rotation: that key no longer exists, so its ciphertext cannot be
    // recovered under any derivation. Retained only until Phase 1B confirms the
    // regenerated database holds no CBC ciphertext, after which this field and
    // `decryptLegacyCbc` are removed and AES-256-GCM becomes the only format.
    this.legacyKey = Buffer.from(raw.padEnd(32).slice(0, 32), 'utf8');
  }

  /** Encrypts UTF-8 plaintext. Returns `v1:<iv>:<tag>:<ciphertext>` (hex). */
  encrypt(plaintext: string): string {
    const iv = randomBytes(CryptoService.IV_BYTES);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
      CryptoService.VERSION,
      iv.toString('hex'),
      tag.toString('hex'),
      ciphertext.toString('hex'),
    ].join(':');
  }

  /**
   * Decrypts a value produced by `encrypt`, or by the legacy CBC scheme.
   * Throws on tampering (GCM) or malformed input — callers decide whether that
   * is fatal or merely means "credential unusable".
   */
  decrypt(encoded: string): string {
    const parts = encoded.split(':');

    if (parts[0] === CryptoService.VERSION && parts.length === 4) {
      const [, ivHex, tagHex, ctHex] = parts;
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.key,
        Buffer.from(ivHex, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
      return Buffer.concat([
        decipher.update(Buffer.from(ctHex, 'hex')),
        decipher.final(),
      ]).toString('utf8');
    }

    if (parts.length === 2) return this.decryptLegacyCbc(parts[0], parts[1]);

    throw new Error('Ciphertext is malformed or was encrypted with an unknown scheme.');
  }

  /**
   * True when `value` looks like ciphertext this service can read. Used to make
   * encryption idempotent so a re-save never double-encrypts, and so rows
   * written before Phase 0 are recognised as plaintext needing migration.
   */
  isEncrypted(value: string | null | undefined): boolean {
    if (!value) return false;
    const parts = value.split(':');

    if (parts[0] === CryptoService.VERSION && parts.length === 4) {
      return /^[0-9a-f]+$/i.test(parts[1]) && /^[0-9a-f]+$/i.test(parts[2]);
    }
    return (
      parts.length === 2 &&
      parts[0].length === CryptoService.LEGACY_IV_BYTES * 2 &&
      /^[0-9a-f]+$/i.test(parts[0]) &&
      /^[0-9a-f]+$/i.test(parts[1])
    );
  }

  /** Encrypts only if the value is not already ciphertext. */
  encryptIfNeeded(value: string): string {
    return this.isEncrypted(value) ? value : this.encrypt(value);
  }

  /**
   * Best-effort decrypt for values that may predate Phase 0 and still be stored
   * as plaintext. Returns the input unchanged when it is not recognisable
   * ciphertext, so a pre-existing credential keeps working until it is rotated.
   */
  decryptIfNeeded(value: string | null | undefined): string | undefined {
    if (!value) return undefined;
    if (!this.isEncrypted(value)) return value;
    try {
      return this.decrypt(value);
    } catch {
      // Never log the value or the raw error — either could echo key material.
      this.logger.error(
        'Failed to decrypt a stored secret. It was encrypted with a different ' +
          'ENCRYPTION_KEY or has been tampered with. The credential must be re-entered.',
      );
      return undefined;
    }
  }

  /** Constant-time comparison for token/secret equality checks. */
  safeEquals(a: string, b: string): boolean {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  private decryptLegacyCbc(ivHex: string, ctHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const ct = Buffer.from(ctHex, 'hex');

    // Try the original derivation first, then the current one, so legacy values
    // decrypt whether or not the key format changed meaning between schemes.
    for (const key of [this.legacyKey, this.key]) {
      try {
        const decipher = createDecipheriv('aes-256-cbc', key, iv);
        return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
      } catch {
        continue;
      }
    }
    throw new Error('Legacy ciphertext could not be decrypted with any known key derivation.');
  }
}
