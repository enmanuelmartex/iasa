/**
 * Fail-fast environment validation.
 *
 * Runs before the Nest application boots. Any missing or structurally invalid
 * security-critical variable aborts startup with an actionable message.
 *
 * Secret VALUES are never included in error messages or logs — only the
 * variable name and the nature of the problem.
 */

/** Minimum entropy we accept for a signing secret, in characters. */
const MIN_SECRET_LENGTH = 32;

/** AES-256 requires exactly 32 bytes of key material. */
export const ENCRYPTION_KEY_BYTES = 32;

export class EnvValidationError extends Error {
  constructor(problems: string[]) {
    super(
      'Invalid environment configuration — refusing to start.\n\n' +
        problems.map((p) => `  • ${p}`).join('\n') +
        '\n\nSee .env.example for the required variables.\n' +
        'Generate strong values with:\n' +
        '  openssl rand -hex 32\n',
    );
    this.name = 'EnvValidationError';
  }
}

/**
 * Derives exactly 32 bytes of AES-256 key material from ENCRYPTION_KEY.
 *
 * Accepted formats, in order of preference:
 *   1. 64 hex characters      → decoded to 32 bytes
 *   2. base64 decoding to 32 bytes
 *   3. raw UTF-8 of at least 32 bytes → first 32 bytes
 *
 * Short keys are rejected outright. We never pad: padding a short secret out
 * to 32 bytes creates the illusion of AES-256 strength without the entropy.
 */
export function deriveEncryptionKey(raw: string): Buffer {
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, 'hex');
  }

  if (/^[A-Za-z0-9+/]{42,44}={0,2}$/.test(raw)) {
    const decoded = Buffer.from(raw, 'base64');
    if (decoded.length === ENCRYPTION_KEY_BYTES) return decoded;
  }

  const utf8 = Buffer.from(raw, 'utf8');
  if (utf8.length >= ENCRYPTION_KEY_BYTES) {
    return utf8.subarray(0, ENCRYPTION_KEY_BYTES);
  }

  throw new EnvValidationError([
    `ENCRYPTION_KEY is too weak: it must be 64 hex characters, base64 decoding ` +
      `to ${ENCRYPTION_KEY_BYTES} bytes, or at least ${ENCRYPTION_KEY_BYTES} UTF-8 bytes ` +
      `(received ${utf8.length} bytes).`,
  ]);
}

function requireSecret(
  problems: string[],
  env: Record<string, unknown>,
  name: string,
): void {
  const value = env[name];

  if (typeof value !== 'string' || value.trim() === '') {
    problems.push(`${name} is required but was not set.`);
    return;
  }
  if (value.length < MIN_SECRET_LENGTH) {
    problems.push(
      `${name} must be at least ${MIN_SECRET_LENGTH} characters (received ${value.length}).`,
    );
    return;
  }
  if (/^fallback-/i.test(value) || /change-in-production/i.test(value)) {
    problems.push(
      `${name} still uses a placeholder value. Generate a real secret with \`openssl rand -hex 32\`.`,
    );
  }
}

/**
 * Validates the process environment. Called by ConfigModule's `validate` hook,
 * so it runs once, at boot, before any module is instantiated.
 */
export function validateEnv(
  env: Record<string, unknown>,
): Record<string, unknown> {
  const problems: string[] = [];

  if (typeof env.DATABASE_URL !== 'string' || env.DATABASE_URL.trim() === '') {
    problems.push('DATABASE_URL is required but was not set.');
  }

  requireSecret(problems, env, 'JWT_SECRET');
  requireSecret(problems, env, 'REFRESH_TOKEN_SECRET');
  requireSecret(problems, env, 'ENCRYPTION_KEY');

  // Only probe key derivation once the basic shape checks passed, so the
  // operator sees one clear problem rather than two overlapping ones.
  if (!problems.some((p) => p.startsWith('ENCRYPTION_KEY'))) {
    try {
      deriveEncryptionKey(env.ENCRYPTION_KEY as string);
    } catch (error) {
      problems.push(
        error instanceof EnvValidationError
          ? error.message.split('\n')[2]?.replace(/^\s*•\s*/, '') ??
              'ENCRYPTION_KEY is invalid.'
          : 'ENCRYPTION_KEY is invalid.',
      );
    }
  }

  if (problems.length > 0) throw new EnvValidationError(problems);

  return env;
}
