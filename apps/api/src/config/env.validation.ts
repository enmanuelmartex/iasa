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

/** The one accepted encoding: 64 hex characters, with an optional `hex:` prefix. */
const HEX_KEY_PATTERN = /^(?:hex:)?([0-9a-fA-F]{64})$/;

/**
 * Decodes ENCRYPTION_KEY into exactly 32 bytes of AES-256 key material.
 *
 * ONE unambiguous contract, shared by `validateEnv` and `CryptoService`:
 *
 *     ENCRYPTION_KEY=<64 hex characters>
 *     ENCRYPTION_KEY=hex:<64 hex characters>
 *
 * which is exactly what `openssl rand -hex 32` produces.
 *
 * Nothing is padded, truncated or re-encoded. An earlier revision accepted raw
 * UTF-8 and silently took the first 32 bytes; that made two different env values
 * derive the same key and hid the fact that the operator's entropy was being
 * discarded. The original code was worse still — it space-padded short keys,
 * fabricating AES-256 strength from far less entropy.
 *
 * A value that does not match the contract is an error, never a coercion.
 */
export function deriveEncryptionKey(raw: string): Buffer {
  const match = HEX_KEY_PATTERN.exec(raw.trim());

  if (!match) {
    throw new EnvValidationError([describeInvalidEncryptionKey(raw)]);
  }

  const key = Buffer.from(match[1], 'hex');

  /* istanbul ignore next — unreachable while the pattern pins the length. */
  if (key.length !== ENCRYPTION_KEY_BYTES) {
    throw new EnvValidationError([
      `ENCRYPTION_KEY decoded to ${key.length} bytes, expected ${ENCRYPTION_KEY_BYTES}.`,
    ]);
  }

  return key;
}

/**
 * Explains why a key was rejected — by shape only. The value is never included,
 * because this text reaches logs and stderr.
 */
function describeInvalidEncryptionKey(raw: string): string {
  const value = raw.trim();
  const body = value.startsWith('hex:') ? value.slice(4) : value;
  const expected =
    `ENCRYPTION_KEY must be 64 hexadecimal characters (32 bytes), optionally ` +
    `prefixed with "hex:". Generate one with \`openssl rand -hex 32\`.`;

  if (body.length !== 64) {
    return `${expected} Received ${body.length} characters.`;
  }
  return `${expected} Received 64 characters, but they are not all hexadecimal.`;
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

/** Pulls the single bullet out of a nested EnvValidationError for re-reporting. */
function extractFirstProblem(error: EnvValidationError): string {
  const bullet = error.message
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('•'));
  return bullet ? bullet.replace(/^•\s*/, '') : 'ENCRYPTION_KEY is invalid.';
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

  // ENCRYPTION_KEY is not checked by requireSecret: it has a stricter, exact
  // contract rather than a minimum length, and `deriveEncryptionKey` is the
  // single place that contract is defined. CryptoService calls the same
  // function, so validation and decoding can never drift apart.
  if (typeof env.ENCRYPTION_KEY !== 'string' || env.ENCRYPTION_KEY.trim() === '') {
    problems.push(
      'ENCRYPTION_KEY is required but was not set. ' +
        'Generate one with `openssl rand -hex 32`.',
    );
  } else {
    try {
      deriveEncryptionKey(env.ENCRYPTION_KEY);
    } catch (error) {
      problems.push(
        error instanceof EnvValidationError
          ? extractFirstProblem(error)
          : 'ENCRYPTION_KEY is invalid.',
      );
    }
  }

  if (problems.length > 0) throw new EnvValidationError(problems);

  return env;
}
