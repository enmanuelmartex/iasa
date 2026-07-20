import { createHash } from 'crypto';

/**
 * Stable identity for a persistent vulnerability.
 *
 * A `SecurityIssue` is the same issue across scans when, and only when, this
 * fingerprint matches. Everything about identity lives here — there must be no
 * second implementation anywhere in the codebase.
 *
 *     fingerprint = SHA-256("v1|projectId|pluginId|ruleId|METHOD|normalizedRoute|component")
 *
 * Deliberately NOT part of identity: title, description, severity, CVSS,
 * evidence, AI output, timestamps, endpointId, occurrence or assessment ids,
 * and any concrete path value. Rewording a check, retuning its severity or
 * re-importing a specification must never change which issue it refers to.
 */

export const FINGERPRINT_VERSION = 'v1';

/** Method used for issues that are not tied to a single endpoint. */
export const GLOBAL_METHOD = 'GLOBAL';
/** Route used for issues that are not tied to a single endpoint. */
export const GLOBAL_ROUTE = '/';
/** Component used for issues that describe the project as a whole. */
export const GLOBAL_COMPONENT = 'project';

/** The canonical inputs, persisted alongside the hash so identity is explainable. */
export interface FingerprintParts {
  projectId: string;
  pluginId: string;
  ruleId: string;
  method: string;
  normalizedRoute: string;
  component: string;
}

export interface Fingerprint extends FingerprintParts {
  /** SHA-256 of the canonical string, lowercase hex. */
  fingerprint: string;
  fingerprintVersion: string;
  /** The exact string that was hashed. Useful for debugging and tests. */
  canonical: string;
}

export interface FingerprintInput {
  projectId: string;
  pluginId: string;
  ruleId: string;
  /** HTTP method, or omitted/`GLOBAL` for a project-wide issue. */
  method?: string | null;
  /** Template path from the specification, or a URL/path to be normalised. */
  route?: string | null;
  /** Affected area, e.g. `response-header:cache-control`. Defaults to `endpoint`. */
  component?: string | null;
}

const HTTP_METHODS = new Set([
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE',
]);

/** `{id}`, `:id` and `<id>` are the same template parameter written three ways. */
const PARAM_COLON = /^:(.+)$/;
const PARAM_ANGLE = /^<(.+)>$/;
const PARAM_BRACE = /^\{(.+)\}$/;

/** Segments that are obviously a concrete value rather than a path literal. */
const NUMERIC_SEGMENT = /^\d+$/;
const UUID_SEGMENT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX_ID_SEGMENT = /^[0-9a-f]{24,}$/i;

/**
 * Normalises an HTTP method. Anything unrecognised — including a missing value
 * — becomes `GLOBAL`, so a project-wide finding has one canonical form.
 */
export function normalizeMethod(method?: string | null): string {
  if (!method) return GLOBAL_METHOD;
  const upper = method.trim().toUpperCase();
  return HTTP_METHODS.has(upper) ? upper : GLOBAL_METHOD;
}

/**
 * Reduces a route to a stable template path.
 *
 * - strips scheme, host, port, query string and fragment
 * - collapses duplicate slashes
 * - removes a trailing slash (except for the root)
 * - rewrites `:id` and `<id>` to `{id}`
 * - rewrites obviously-concrete segments (numeric, UUID, long hex) to `{id}`
 *
 * The last rule is a fallback for routes derived from a request URL. Findings
 * should pass the specification's template path, which is already canonical.
 */
export function normalizeRoute(route?: string | null): string {
  if (!route) return GLOBAL_ROUTE;

  let path = route.trim();
  if (path === '') return GLOBAL_ROUTE;

  // Strip scheme + authority when given a full URL.
  const schemeMatch = /^[a-z][a-z0-9+.-]*:\/\/[^/]*(\/.*)?$/i.exec(path);
  if (schemeMatch) path = schemeMatch[1] ?? '/';

  // Strip query string and fragment.
  path = path.split('#')[0].split('?')[0];

  const segments = path
    .split('/')
    .filter((segment) => segment !== '')
    .map(normalizeSegment);

  return segments.length === 0 ? GLOBAL_ROUTE : `/${segments.join('/')}`;
}

function normalizeSegment(segment: string): string {
  const colon = PARAM_COLON.exec(segment);
  if (colon) return `{${colon[1]}}`;

  const angle = PARAM_ANGLE.exec(segment);
  if (angle) return `{${angle[1]}}`;

  const brace = PARAM_BRACE.exec(segment);
  if (brace) return `{${brace[1]}}`;

  if (NUMERIC_SEGMENT.test(segment) || UUID_SEGMENT.test(segment) || HEX_ID_SEGMENT.test(segment)) {
    return '{id}';
  }

  return segment;
}

/**
 * Normalises a component identifier: lowercase, trimmed, whitespace collapsed.
 *
 * A component names an area — `response-header:cache-control`, `query:user_id`,
 * `body:password` — and must never carry a value. Callers are responsible for
 * passing a name rather than observed content; this only canonicalises form.
 */
export function normalizeComponent(component?: string | null): string {
  if (!component) return 'endpoint';
  const normalized = component.trim().toLowerCase().replace(/\s+/g, '-');
  return normalized === '' ? 'endpoint' : normalized;
}

/** Builds the canonical string that gets hashed. Exported for tests and debugging. */
export function buildCanonicalString(parts: FingerprintParts): string {
  return [
    FINGERPRINT_VERSION,
    parts.projectId,
    parts.pluginId,
    parts.ruleId,
    parts.method,
    parts.normalizedRoute,
    parts.component,
  ].join('|');
}

/**
 * Computes the fingerprint and returns it together with every canonical input,
 * so callers can persist the inputs and never have to re-derive them.
 */
export function computeFingerprint(input: FingerprintInput): Fingerprint {
  const projectId = requireNonEmpty(input.projectId, 'projectId');
  const pluginId = requireNonEmpty(input.pluginId, 'pluginId');
  const ruleId = requireNonEmpty(input.ruleId, 'ruleId');

  const method = normalizeMethod(input.method);
  const normalizedRoute =
    method === GLOBAL_METHOD && !input.route ? GLOBAL_ROUTE : normalizeRoute(input.route);
  const component = normalizeComponent(input.component);

  const parts: FingerprintParts = {
    projectId,
    pluginId,
    ruleId,
    method,
    normalizedRoute,
    component,
  };
  const canonical = buildCanonicalString(parts);

  return {
    ...parts,
    canonical,
    fingerprint: sha256Hex(canonical),
    fingerprintVersion: FINGERPRINT_VERSION,
  };
}

/**
 * Idempotency token for a detection within one assessment.
 *
 * A pure function of issue identity — no timestamps, randomness or row ids — so
 * a BullMQ retry recomputes exactly the same value and the unique constraint
 * `(assessmentId, occurrenceKey)` rejects the duplicate.
 *
 * Derived from the fingerprint rather than from `SecurityIssue.id` so it can be
 * computed before the issue row exists.
 */
export function computeOccurrenceKey(fingerprintVersion: string, fingerprint: string): string {
  return sha256Hex(`${fingerprintVersion}|${fingerprint}`);
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function requireNonEmpty(value: string | undefined | null, field: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Cannot compute a fingerprint without ${field}.`);
  }
  return trimmed;
}
