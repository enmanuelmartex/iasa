import {
  buildCanonicalString,
  computeFingerprint,
  computeOccurrenceKey,
  FINGERPRINT_VERSION,
  GLOBAL_COMPONENT,
  GLOBAL_METHOD,
  GLOBAL_ROUTE,
  normalizeComponent,
  normalizeMethod,
  normalizeRoute,
} from './fingerprint.util';

const BASE = {
  projectId: 'proj-1',
  pluginId: 'security-headers',
  ruleId: 'headers.missing-hsts',
  method: 'GET',
  route: '/api/v1/users/{id}',
  component: 'response-header:strict-transport-security',
};

describe('normalizeMethod', () => {
  it.each(['get', 'GET', ' Get '])('uppercases %s', (method) => {
    expect(normalizeMethod(method)).toBe('GET');
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'])(
    'accepts %s',
    (method) => {
      expect(normalizeMethod(method)).toBe(method);
    },
  );

  it.each([null, undefined, '', 'NOTAMETHOD'])(
    'falls back to GLOBAL for %s',
    (method) => {
      expect(normalizeMethod(method as string)).toBe(GLOBAL_METHOD);
    },
  );
});

describe('normalizeRoute', () => {
  it('treats the three template syntaxes as the same route', () => {
    const brace = normalizeRoute('/users/{id}');
    expect(normalizeRoute('/users/:id')).toBe(brace);
    expect(normalizeRoute('/users/<id>')).toBe(brace);
    expect(brace).toBe('/users/{id}');
  });

  it('normalises multi-parameter routes consistently', () => {
    const expected = '/orgs/{orgId}/users/{userId}';
    expect(normalizeRoute('/orgs/:orgId/users/:userId')).toBe(expected);
    expect(normalizeRoute('/orgs/{orgId}/users/{userId}')).toBe(expected);
    expect(normalizeRoute('/orgs/<orgId>/users/<userId>')).toBe(expected);
  });

  it('strips scheme, host and port', () => {
    expect(normalizeRoute('https://api.example.com:8443/users/{id}')).toBe('/users/{id}');
  });

  it('strips query string and fragment', () => {
    expect(normalizeRoute('/users/{id}?include=roles&token=secret')).toBe('/users/{id}');
    expect(normalizeRoute('/users/{id}#section')).toBe('/users/{id}');
  });

  it('never lets a secret in a query string reach the fingerprint', () => {
    expect(normalizeRoute('/cb?access_token=super-secret-value')).not.toContain('super-secret-value');
  });

  it('collapses duplicate slashes', () => {
    expect(normalizeRoute('//users///{id}//')).toBe('/users/{id}');
  });

  it('removes a trailing slash but keeps the root', () => {
    expect(normalizeRoute('/users/')).toBe('/users');
    expect(normalizeRoute('/')).toBe(GLOBAL_ROUTE);
    expect(normalizeRoute('')).toBe(GLOBAL_ROUTE);
  });

  it('rewrites concrete ids so two scans of the same endpoint agree', () => {
    // Fallback for routes derived from a request URL rather than the spec.
    expect(normalizeRoute('/users/123')).toBe('/users/{id}');
    expect(normalizeRoute('/users/456')).toBe('/users/{id}');
    expect(normalizeRoute('/users/550e8400-e29b-41d4-a716-446655440000')).toBe('/users/{id}');
    expect(normalizeRoute('/users/507f1f77bcf86cd799439011')).toBe('/users/{id}');
  });

  it('does not mistake a versioned path literal for an id', () => {
    expect(normalizeRoute('/api/v1/users')).toBe('/api/v1/users');
  });

  it('falls back to the global route when absent', () => {
    expect(normalizeRoute(null)).toBe(GLOBAL_ROUTE);
    expect(normalizeRoute(undefined)).toBe(GLOBAL_ROUTE);
  });
});

describe('normalizeComponent', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizeComponent('Response-Header:Cache-Control')).toBe('response-header:cache-control');
    expect(normalizeComponent('  query: user id ')).toBe('query:-user-id');
  });

  it('defaults to endpoint', () => {
    expect(normalizeComponent(null)).toBe('endpoint');
    expect(normalizeComponent('')).toBe('endpoint');
    expect(normalizeComponent('   ')).toBe('endpoint');
  });
});

describe('computeFingerprint', () => {
  it('is deterministic across calls', () => {
    expect(computeFingerprint(BASE).fingerprint).toBe(computeFingerprint(BASE).fingerprint);
  });

  it('produces a lowercase hex SHA-256', () => {
    expect(computeFingerprint(BASE).fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns the canonical inputs alongside the hash', () => {
    const result = computeFingerprint(BASE);
    expect(result.fingerprintVersion).toBe(FINGERPRINT_VERSION);
    expect(result.method).toBe('GET');
    expect(result.normalizedRoute).toBe('/api/v1/users/{id}');
    expect(result.component).toBe('response-header:strict-transport-security');
    expect(result.canonical).toBe(buildCanonicalString(result));
    expect(result.canonical.startsWith('v1|proj-1|security-headers|headers.missing-hsts|GET|')).toBe(true);
  });

  // ── Identity must change when the vulnerability changes ────────────────────

  it.each([
    ['projectId', { projectId: 'proj-2' }],
    ['pluginId', { pluginId: 'cors' }],
    ['ruleId', { ruleId: 'headers.missing-csp' }],
    ['method', { method: 'POST' }],
    ['route', { route: '/api/v1/orders/{id}' }],
    ['component', { component: 'response-header:content-security-policy' }],
  ])('changes when %s changes', (_label, override) => {
    expect(computeFingerprint({ ...BASE, ...override }).fingerprint).not.toBe(
      computeFingerprint(BASE).fingerprint,
    );
  });

  it('distinguishes two rules of the same plugin on the same endpoint', () => {
    // The exact collision the old pluginId+method+path scheme produced:
    // security-headers emits several distinct rules per endpoint.
    const hsts = computeFingerprint({ ...BASE, ruleId: 'headers.missing-hsts' });
    const csp = computeFingerprint({ ...BASE, ruleId: 'headers.missing-content-security-policy' });
    expect(hsts.fingerprint).not.toBe(csp.fingerprint);
  });

  // ── Identity must NOT change when presentation changes ─────────────────────

  it('is unaffected by the three template syntaxes', () => {
    const a = computeFingerprint({ ...BASE, route: '/users/:id' });
    const b = computeFingerprint({ ...BASE, route: '/users/{id}' });
    const c = computeFingerprint({ ...BASE, route: '/users/<id>' });
    expect(a.fingerprint).toBe(b.fingerprint);
    expect(b.fingerprint).toBe(c.fingerprint);
  });

  it('is unaffected by concrete ids in the path', () => {
    expect(computeFingerprint({ ...BASE, route: '/users/123' }).fingerprint).toBe(
      computeFingerprint({ ...BASE, route: '/users/456' }).fingerprint,
    );
  });

  it('is unaffected by case or padding of the method and component', () => {
    expect(
      computeFingerprint({ ...BASE, method: 'get', component: 'RESPONSE-HEADER:STRICT-TRANSPORT-SECURITY' })
        .fingerprint,
    ).toBe(computeFingerprint(BASE).fingerprint);
  });

  it('is unaffected by a query string, so no secret can shift identity', () => {
    expect(computeFingerprint({ ...BASE, route: '/api/v1/users/{id}?token=abc' }).fingerprint).toBe(
      computeFingerprint(BASE).fingerprint,
    );
  });

  // ── Global findings ────────────────────────────────────────────────────────

  it('gives project-wide findings one canonical form', () => {
    const result = computeFingerprint({
      projectId: 'proj-1',
      pluginId: 'cors',
      ruleId: 'cors.wildcard-origin',
      component: GLOBAL_COMPONENT,
    });

    expect(result.method).toBe(GLOBAL_METHOD);
    expect(result.normalizedRoute).toBe(GLOBAL_ROUTE);
    expect(result.canonical).toContain(`|${GLOBAL_METHOD}|${GLOBAL_ROUTE}|${GLOBAL_COMPONENT}`);
  });

  // ── Required inputs ────────────────────────────────────────────────────────

  it.each(['projectId', 'pluginId', 'ruleId'])('refuses to fingerprint without %s', (field) => {
    const input: any = { ...BASE, [field]: '' };
    expect(() => computeFingerprint(input)).toThrow(new RegExp(field));
  });
});

describe('computeOccurrenceKey', () => {
  it('is deterministic, so a BullMQ retry recomputes the same value', () => {
    const { fingerprint, fingerprintVersion } = computeFingerprint(BASE);
    expect(computeOccurrenceKey(fingerprintVersion, fingerprint)).toBe(
      computeOccurrenceKey(fingerprintVersion, fingerprint),
    );
  });

  it('differs for different issues', () => {
    const a = computeFingerprint(BASE);
    const b = computeFingerprint({ ...BASE, ruleId: 'headers.missing-csp' });
    expect(computeOccurrenceKey(a.fingerprintVersion, a.fingerprint)).not.toBe(
      computeOccurrenceKey(b.fingerprintVersion, b.fingerprint),
    );
  });

  it('does not simply echo the fingerprint', () => {
    const { fingerprint, fingerprintVersion } = computeFingerprint(BASE);
    expect(computeOccurrenceKey(fingerprintVersion, fingerprint)).not.toBe(fingerprint);
  });
});
