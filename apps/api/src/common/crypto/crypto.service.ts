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

  private static readonly VERSION = 'v1';
  private static readonly IV_BYTES = 12; // GCM standard nonce length
  private static readonly TAG_BYTES = 16; // full 128-bit authentication tag

  constructor(private readonly configService: ConfigService) {
    // Single source of truth for the key contract, shared with validateEnv:
    // exactly 64 hex characters (optionally `hex:`-prefixed). validateEnv has
    // already proved this decodes at boot, so this cannot throw here.
    this.key = deriveEncryptionKey(
      this.configService.get<string>('security.encryptionKey') as string,
    );
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
   * Decrypts a value produced by `encrypt`.
   *
   * AES-256-GCM (`v1:`) is the only supported format. Throws on tampering, on a
   * wrong key, or on any unrecognised payload — including the AES-256-CBC
   * scheme used before Phase 0, which was removed in Phase 1B once the
   * regenerated database was confirmed to contain no CBC ciphertext.
   *
   * Callers decide whether a failure is fatal or merely means "credential
   * unusable". The error never contains the payload.
   */
  decrypt(encoded: string): string {
    const parts = encoded.split(':');

    if (parts[0] !== CryptoService.VERSION || parts.length !== 4) {
      throw new Error(
        'Ciphertext is malformed or uses an unsupported scheme. ' +
          'Only AES-256-GCM (v1) is supported; the credential must be re-entered.',
      );
    }

    const [, ivHex, tagHex, ctHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    // Validate the envelope before handing it to the cipher. A short auth tag
    // would otherwise reach setAuthTag and weaken the integrity guarantee
    // (Node deprecates tags under 128 bits precisely because a truncated tag is
    // easier to forge).
    if (iv.length !== CryptoService.IV_BYTES || tag.length !== CryptoService.TAG_BYTES) {
      throw new Error(
        'Ciphertext envelope is invalid: unexpected nonce or authentication tag length.',
      );
    }

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv, {
      authTagLength: CryptoService.TAG_BYTES,
    });
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(Buffer.from(ctHex, 'hex')),
      decipher.final(),
    ]).toString('utf8');
  }

  /**
   * True when `value` is ciphertext this service can read (AES-256-GCM `v1:`).
   *
   * Used to make encryption idempotent so a re-save never double-encrypts, and
   * so any plaintext value is recognised as needing encryption. Legacy CBC
   * payloads deliberately return false: they are no longer supported, so they
   * must not be treated as already-encrypted and silently left in place.
   */
  isEncrypted(value: string | null | undefined): boolean {
    if (!value) return false;
    const parts = value.split(':');

    return (
      parts.length === 4 &&
      parts[0] === CryptoService.VERSION &&
      /^[0-9a-f]+$/i.test(parts[1]) &&
      /^[0-9a-f]+$/i.test(parts[2]) &&
      /^[0-9a-f]+$/i.test(parts[3])
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

}
