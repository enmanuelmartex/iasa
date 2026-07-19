import {
  deriveEncryptionKey,
  validateEnv,
  EnvValidationError,
  ENCRYPTION_KEY_BYTES,
} from './env.validation';

/** Test-only material. Never reuse these values outside tests. */
const VALID_HEX_KEY = 'a'.repeat(64);
const VALID_SECRET = 'x'.repeat(32);

function baseEnv(overrides: Record<string, unknown> = {}) {
  return {
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    JWT_SECRET: VALID_SECRET,
    REFRESH_TOKEN_SECRET: 'y'.repeat(32),
    ENCRYPTION_KEY: VALID_HEX_KEY,
    ...overrides,
  };
}

describe('deriveEncryptionKey', () => {
  it('decodes the output of `openssl rand -hex 32`', () => {
    const key = deriveEncryptionKey(VALID_HEX_KEY);
    expect(key).toHaveLength(ENCRYPTION_KEY_BYTES);
    expect(key.toString('hex')).toBe(VALID_HEX_KEY);
  });

  it('accepts the explicit hex: prefix and decodes it identically', () => {
    expect(deriveEncryptionKey(`hex:${VALID_HEX_KEY}`).equals(deriveEncryptionKey(VALID_HEX_KEY))).toBe(true);
  });

  it('accepts uppercase hex', () => {
    expect(deriveEncryptionKey(VALID_HEX_KEY.toUpperCase()).toString('hex')).toBe(VALID_HEX_KEY);
  });

  it('ignores surrounding whitespace', () => {
    expect(deriveEncryptionKey(`  ${VALID_HEX_KEY}\n`).toString('hex')).toBe(VALID_HEX_KEY);
  });

  it('is deterministic', () => {
    expect(deriveEncryptionKey(VALID_HEX_KEY).equals(deriveEncryptionKey(VALID_HEX_KEY))).toBe(true);
  });

  // ── The contract is exact: no padding, no truncation, no re-encoding ───────

  it('rejects raw UTF-8 instead of silently truncating it to 32 bytes', () => {
    // A previous revision accepted this and took the first 32 bytes, so two
    // different env values derived the same key and the operator was never
    // told their entropy was being discarded.
    expect(() => deriveEncryptionKey('z'.repeat(40))).toThrow(EnvValidationError);
    expect(() => deriveEncryptionKey('z'.repeat(32))).toThrow(EnvValidationError);
  });

  it('rejects base64, which is ambiguous against hex', () => {
    expect(() => deriveEncryptionKey(Buffer.alloc(32, 7).toString('base64'))).toThrow(
      EnvValidationError,
    );
  });

  it('rejects a short key rather than padding it', () => {
    // The original code space-padded short keys, fabricating AES-256 strength.
    expect(() => deriveEncryptionKey('too-short')).toThrow(EnvValidationError);
  });

  it('rejects 64 characters that are not all hexadecimal', () => {
    expect(() => deriveEncryptionKey('z'.repeat(64))).toThrow(/not all hexadecimal/);
  });

  it('rejects 63 and 65 hex characters', () => {
    expect(() => deriveEncryptionKey('a'.repeat(63))).toThrow(EnvValidationError);
    expect(() => deriveEncryptionKey('a'.repeat(65))).toThrow(EnvValidationError);
  });

  it('reports the length without echoing the value', () => {
    const wrong = 'q'.repeat(50);
    let message = '';
    try {
      deriveEncryptionKey(wrong);
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('50 characters');
    expect(message).toContain('openssl rand -hex 32');
    expect(message).not.toContain(wrong);
  });
});

describe('validateEnv', () => {
  it('accepts a fully configured environment', () => {
    expect(() => validateEnv(baseEnv())).not.toThrow();
  });

  it.each(['JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'ENCRYPTION_KEY', 'DATABASE_URL'])(
    'refuses to start when %s is missing',
    (variable) => {
      const env = baseEnv();
      delete (env as Record<string, unknown>)[variable];
      expect(() => validateEnv(env)).toThrow(EnvValidationError);
      expect(() => validateEnv(env)).toThrow(new RegExp(variable));
    },
  );

  it.each(['JWT_SECRET', 'REFRESH_TOKEN_SECRET'])(
    'refuses to start when %s is shorter than 32 characters',
    (variable) => {
      expect(() => validateEnv(baseEnv({ [variable]: 'short' }))).toThrow(EnvValidationError);
    },
  );

  it('rejects the removed hardcoded JWT fallback', () => {
    expect(() =>
      validateEnv(baseEnv({ JWT_SECRET: 'fallback-secret-change-in-production' })),
    ).toThrow(EnvValidationError);
  });

  it('rejects the removed hardcoded encryption fallbacks', () => {
    // Both historical values, which differed between configuration.ts and
    // ai-config.service.ts and were public in the repository.
    for (const fallback of [
      'fallback-encryption-key-32chars',
      'fallback-encryption-key-32chars!!',
    ]) {
      expect(() => validateEnv(baseEnv({ ENCRYPTION_KEY: fallback }))).toThrow(EnvValidationError);
    }
  });

  it('reports every problem at once', () => {
    let message = '';
    try {
      validateEnv({ DATABASE_URL: '' });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('DATABASE_URL');
    expect(message).toContain('JWT_SECRET');
    expect(message).toContain('REFRESH_TOKEN_SECRET');
    expect(message).toContain('ENCRYPTION_KEY');
  });

  it('never echoes a secret value in the error message', () => {
    const secret = 'super-secret-value-that-is-long-enough-123456';
    let message = '';
    try {
      validateEnv({ DATABASE_URL: 'postgres://x', JWT_SECRET: secret });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).not.toContain(secret);
  });
});
