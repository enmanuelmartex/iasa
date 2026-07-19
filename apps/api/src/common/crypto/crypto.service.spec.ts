import { ConfigService } from '@nestjs/config';
import { createCipheriv, randomBytes } from 'crypto';
import { CryptoService } from './crypto.service';
import {
  decryptAuthFields,
  encryptAuthFields,
  stripAuthSecrets,
  ENCRYPTED_AUTH_FIELDS,
} from './auth-config.crypto';

/** Test-only key. */
const TEST_KEY = 'f'.repeat(64);

function makeService(key = TEST_KEY): CryptoService {
  const config = { get: () => key } as unknown as ConfigService;
  return new CryptoService(config);
}

describe('CryptoService', () => {
  const crypto = makeService();

  it('round-trips a value', () => {
    const plaintext = 'Bearer eyJhbGciOiJIUzI1NiJ9.payload.signature';
    expect(crypto.decrypt(crypto.encrypt(plaintext))).toBe(plaintext);
  });

  it('never emits the plaintext inside the ciphertext', () => {
    const plaintext = 'super-secret-token';
    expect(crypto.encrypt(plaintext)).not.toContain(plaintext);
  });

  it('produces different ciphertext each time (random IV)', () => {
    expect(crypto.encrypt('same')).not.toBe(crypto.encrypt('same'));
  });

  it('tags new ciphertext as v1 GCM', () => {
    expect(crypto.encrypt('x').startsWith('v1:')).toBe(true);
  });

  it('rejects tampered ciphertext instead of returning garbage', () => {
    const encrypted = crypto.encrypt('sensitive');
    const [version, iv, tag, ct] = encrypted.split(':');
    const flipped = (ct[0] === 'a' ? 'b' : 'a') + ct.slice(1);
    expect(() => crypto.decrypt([version, iv, tag, flipped].join(':'))).toThrow();
  });

  it('cannot decrypt with a different key', () => {
    const other = makeService('1'.repeat(64));
    expect(() => other.decrypt(crypto.encrypt('secret'))).toThrow();
  });

  it('decrypts legacy AES-256-CBC ciphertext written before Phase 0', () => {
    // Reproduces the original AiConfigService scheme: key = raw.padEnd(32).slice(0,32)
    const legacyKey = Buffer.from(TEST_KEY.padEnd(32).slice(0, 32), 'utf8');
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', legacyKey, iv);
    const enc = Buffer.concat([cipher.update('legacy-api-key', 'utf8'), cipher.final()]);
    const legacy = `${iv.toString('hex')}:${enc.toString('hex')}`;

    expect(crypto.decrypt(legacy)).toBe('legacy-api-key');
  });

  describe('isEncrypted', () => {
    it('recognises its own output', () => {
      expect(crypto.isEncrypted(crypto.encrypt('x'))).toBe(true);
    });

    it('treats plaintext as not encrypted', () => {
      for (const value of ['', 'plain', 'Bearer abc', 'a:b:c', null, undefined]) {
        expect(crypto.isEncrypted(value as string)).toBe(false);
      }
    });
  });

  it('encryptIfNeeded is idempotent — re-saving never double-encrypts', () => {
    const once = crypto.encryptIfNeeded('token-value');
    expect(crypto.encryptIfNeeded(once)).toBe(once);
    expect(crypto.decrypt(once)).toBe('token-value');
  });

  it('safeEquals compares correctly', () => {
    expect(crypto.safeEquals('abc', 'abc')).toBe(true);
    expect(crypto.safeEquals('abc', 'abd')).toBe(false);
    expect(crypto.safeEquals('abc', 'longer')).toBe(false);
  });
});

describe('AuthConfig credential handling', () => {
  const crypto = makeService();

  const plaintextConfig = {
    type: 'BEARER',
    username: 'analyst',
    token: 'real-bearer-token',
    password: 'real-password',
    apiKey: 'real-api-key',
    clientId: 'real-client-id',
    clientSecret: 'real-client-secret',
    apiKeyHeader: 'X-API-Key',
  };

  it('encrypts every credential field at rest', () => {
    const encrypted = encryptAuthFields(crypto, plaintextConfig);

    for (const field of ENCRYPTED_AUTH_FIELDS) {
      expect(encrypted[field]).not.toBe(plaintextConfig[field]);
      expect(crypto.isEncrypted(encrypted[field])).toBe(true);
    }
  });

  it('leaves non-credential fields untouched', () => {
    const encrypted = encryptAuthFields(crypto, plaintextConfig);
    expect(encrypted.type).toBe('BEARER');
    expect(encrypted.username).toBe('analyst');
    expect(encrypted.apiKeyHeader).toBe('X-API-Key');
  });

  it('round-trips so the scanner receives usable credentials', () => {
    const decrypted = decryptAuthFields(crypto, encryptAuthFields(crypto, plaintextConfig));
    for (const field of ENCRYPTED_AUTH_FIELDS) {
      expect(decrypted![field]).toBe(plaintextConfig[field]);
    }
  });

  it('passes through pre-Phase-0 plaintext so existing configs keep working', () => {
    const decrypted = decryptAuthFields(crypto, plaintextConfig);
    expect(decrypted!.token).toBe('real-bearer-token');
  });

  it('strips every secret before an AuthConfig reaches a client', () => {
    const response = stripAuthSecrets(encryptAuthFields(crypto, plaintextConfig));
    const serialised = JSON.stringify(response);

    for (const field of ENCRYPTED_AUTH_FIELDS) {
      expect(response).not.toHaveProperty(field);
    }
    expect(response).not.toHaveProperty('customHeaders');

    // Neither plaintext nor ciphertext may leave the server.
    for (const value of Object.values(plaintextConfig)) {
      if (value !== 'BEARER' && value !== 'analyst' && value !== 'X-API-Key') {
        expect(serialised).not.toContain(value);
      }
    }
    expect(serialised).toContain('analyst'); // non-secret fields survive
  });

  it('handles null/undefined without throwing', () => {
    expect(decryptAuthFields(crypto, null)).toBeNull();
    expect(stripAuthSecrets(undefined)).toBeUndefined();
  });
});
