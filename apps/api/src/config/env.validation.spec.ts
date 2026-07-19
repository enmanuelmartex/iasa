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
  it('decodes 64 hex characters to 32 bytes', () => {
    const key = deriveEncryptionKey(VALID_HEX_KEY);
    expect(key).toHaveLength(ENCRYPTION_KEY_BYTES);
    expect(key.toString('hex')).toBe(VALID_HEX_KEY);
  });

  it('decodes base64 that yields exactly 32 bytes', () => {
    const source = Buffer.alloc(ENCRYPTION_KEY_BYTES, 7);
    const key = deriveEncryptionKey(source.toString('base64'));
    expect(key).toHaveLength(ENCRYPTION_KEY_BYTES);
    expect(key.equals(source)).toBe(true);
  });

  it('accepts raw UTF-8 of at least 32 bytes, truncating to 32', () => {
    const key = deriveEncryptionKey('z'.repeat(40));
    expect(key).toHaveLength(ENCRYPTION_KEY_BYTES);
    expect(key.toString('utf8')).toBe('z'.repeat(32));
  });

  it('rejects a short key rather than padding it', () => {
    // The pre-Phase-0 code padded short keys with spaces, which fabricated
    // AES-256 strength from far less entropy.
    expect(() => deriveEncryptionKey('too-short')).toThrow(EnvValidationError);
  });

  it('is deterministic', () => {
    expect(deriveEncryptionKey(VALID_HEX_KEY).equals(deriveEncryptionKey(VALID_HEX_KEY))).toBe(true);
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
