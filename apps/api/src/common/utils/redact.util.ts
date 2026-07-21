/**
 * Central secret redaction.
 *
 * The scanner authenticates against the target API with the user's real
 * credentials, so anything that serialises an outbound request — evidence,
 * logs, reports — will contain those credentials unless redacted here.
 *
 * Applied at every boundary where data leaves memory:
 *   • before persisting finding evidence  (BasePlugin)
 *   • before writing application logs      (LoggingInterceptor)
 *   • before sending context to an AI provider
 */

export const REDACTED = '[REDACTED]';

/** Header names whose value is always a credential. Compared case-insensitively. */
const SENSITIVE_HEADERS = new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'api-key',
  'apikey',
  'x-auth-token',
  'x-access-token',
  'x-session-token',
  'x-csrf-token',
  'x-xsrf-token',
  'x-amz-security-token',
  'x-goog-api-key',
  'authentication',
]);

/** Substrings that mark a header or field as sensitive even if not listed above. */
const SENSITIVE_PATTERNS = [
  'password',
  'passwd',
  'secret',
  'token',
  'credential',
  'private-key',
  'privatekey',
  'client-secret',
  'clientsecret',
  'session',
  'auth',
];

/** Query/body parameter names treated as sensitive. */
const SENSITIVE_PARAMS = [
  'token',
  'access_token',
  'refresh_token',
  'id_token',
  'api_key',
  'apikey',
  'key',
  'secret',
  'client_secret',
  'password',
  'passwd',
  'pwd',
  'session',
  'sig',
  'signature',
];

export function isSensitiveHeader(name: string): boolean {
  const lower = name.toLowerCase().trim();
  if (SENSITIVE_HEADERS.has(lower)) return true;
  return SENSITIVE_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function isSensitiveParam(name: string): boolean {
  const lower = name.toLowerCase().trim();
  return SENSITIVE_PARAMS.some(
    (param) => lower === param || lower.includes(param),
  );
}

/**
 * Returns a copy of `headers` with every sensitive value replaced.
 *
 * The header NAME is preserved: "Authorization: [REDACTED]" is useful evidence
 * (it proves the request was authenticated) while the value is not.
 */
export function redactHeaders(
  headers: Record<string, unknown> | undefined,
): Record<string, string> {
  if (!headers) return {};
  const safe: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    safe[name] = isSensitiveHeader(name) ? REDACTED : String(value);
  }
  return safe;
}

/** Redacts sensitive query-string parameters, preserving URL structure. */
export function redactUrl(rawUrl: string): string {
  const queryStart = rawUrl.indexOf('?');
  if (queryStart === -1) return rawUrl;

  const base = rawUrl.slice(0, queryStart);
  const query = rawUrl.slice(queryStart + 1);
  const [queryOnly, ...fragmentParts] = query.split('#');
  const fragment = fragmentParts.length ? `#${fragmentParts.join('#')}` : '';

  const redactedQuery = queryOnly
    .split('&')
    .filter(Boolean)
    .map((pair) => {
      const eq = pair.indexOf('=');
      if (eq === -1) return pair;
      const name = pair.slice(0, eq);
      return isSensitiveParam(decodeURIComponent(name))
        ? `${name}=${REDACTED}`
        : pair;
    })
    .join('&');

  return redactedQuery ? `${base}?${redactedQuery}${fragment}` : `${base}${fragment}`;
}

/**
 * Recursively redacts sensitive keys in a JSON-like structure.
 *
 * When a KEY is sensitive its entire value is replaced, even if that value is an
 * object. This is deliberately conservative: walking into a container named
 * `auth` or `credentials` risks leaking a leaf whose own key we do not
 * recognise. We accept the loss of structure in evidence for that guarantee.
 *
 * Depth-limited so hostile or cyclic input cannot exhaust the stack.
 */
export function redactObject<T>(value: T, depth = 0): T {
  if (depth > 12 || value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map((item) => redactObject(item, depth + 1)) as unknown as T;
  }
  if (typeof value !== 'object') return value;

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    result[key] = isSensitiveParam(key) || isSensitiveHeader(key)
      ? REDACTED
      : redactObject(val, depth + 1);
  }
  return result as unknown as T;
}

/**
 * Redacts credentials from an already-serialised HTTP message.
 *
 * Defence in depth: `redactHeaders` handles structured input, but evidence
 * strings assembled elsewhere still pass through here before persistence.
 */
export function redactHttpMessage(message: string | undefined): string | undefined {
  if (!message) return message;

  return (
    message
      // "Authorization: Bearer x" / "Cookie: a=b" — header line anywhere in the message
      .replace(
        /^([ \t]*(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|api-key|apikey|x-auth-token|x-access-token|x-session-token|authentication)[ \t]*:)[ \t]*.*$/gim,
        `$1 ${REDACTED}`,
      )
      // Inline scheme-prefixed credentials that are not on their own line
      .replace(/\b(Bearer|Basic|Digest|Token)\s+[A-Za-z0-9._~+/=-]{8,}/gi, `$1 ${REDACTED}`)
      // JSON fields such as "password": "..."
      .replace(
        /("(?:[^"]*(?:password|passwd|secret|token|api_?key|credential)[^"]*)"\s*:\s*)"(?:[^"\\]|\\.)*"/gi,
        `$1"${REDACTED}"`,
      )
      // Sensitive query parameters inside URLs embedded in the message
      .replace(
        /([?&](?:access_token|refresh_token|id_token|api_?key|token|client_secret|secret|password|sig|signature)=)[^&\s"']+/gi,
        `$1${REDACTED}`,
      )
  );
}
