import type { CryptoService } from './crypto.service';

/**
 * Encryption helpers for `AuthConfig` credentials.
 *
 * Kept as free functions rather than a service method so both the projects
 * module (which writes) and the scanner processor (which reads) can use them
 * without importing each other's modules.
 */

/** AuthConfig columns holding credentials: encrypted at rest, never returned to a client. */
export const ENCRYPTED_AUTH_FIELDS = [
  'token',
  'password',
  'apiKey',
  'clientId',
  'clientSecret',
] as const;

/** Columns stripped before an AuthConfig is serialised into any API response. */
export const SECRET_AUTH_FIELDS = [
  ...ENCRYPTED_AUTH_FIELDS,
  'customHeaders',
] as const;

/** Returns a copy with every credential encrypted. Idempotent. */
export function encryptAuthFields<T extends Record<string, any>>(
  crypto: CryptoService,
  authData: T,
): T {
  const result: Record<string, any> = { ...authData };
  for (const field of ENCRYPTED_AUTH_FIELDS) {
    const value = result[field];
    if (typeof value === 'string' && value.length > 0) {
      result[field] = crypto.encryptIfNeeded(value);
    }
  }
  return result as T;
}

/**
 * Returns a copy with every credential decrypted, for use by the scanner.
 *
 * Values that predate encryption pass through unchanged; values that cannot be
 * decrypted become `null` so the scan proceeds unauthenticated rather than
 * sending ciphertext as a credential.
 */
export function decryptAuthFields<T extends Record<string, any>>(
  crypto: CryptoService,
  authConfig: T | null | undefined,
): T | null {
  if (!authConfig) return null;
  const result: Record<string, any> = { ...authConfig };
  for (const field of ENCRYPTED_AUTH_FIELDS) {
    const value = result[field];
    if (typeof value === 'string' && value.length > 0) {
      result[field] = crypto.decryptIfNeeded(value) ?? null;
    }
  }
  return result as T;
}

/** Removes every secret column, leaving the shape safe to return to a client. */
export function stripAuthSecrets<T extends Record<string, any>>(
  authConfig: T | null | undefined,
): Partial<T> | null | undefined {
  if (!authConfig) return authConfig;
  const safe: Record<string, any> = { ...authConfig };
  for (const field of SECRET_AUTH_FIELDS) delete safe[field];
  return safe as Partial<T>;
}
