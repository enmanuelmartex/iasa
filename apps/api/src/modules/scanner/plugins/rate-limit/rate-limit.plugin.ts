import axios from 'axios';
import { BasePlugin, ScanContext, PluginResult, ScanFinding } from '../../types/scanner.types';

export class RateLimitPlugin extends BasePlugin {
  readonly id = 'rate-limit';
  readonly name = 'Rate Limiting';
  readonly description = 'Tests for API4:2023 - Unrestricted Resource Consumption (Rate Limiting)';
  readonly owaspCategories = ['API4:2023'];

  async run(context: ScanContext): Promise<PluginResult> {
    const start = Date.now();
    const findings: ScanFinding[] = [];
    let tested = 0;

    const authHeaders = this.getAuthHeaders(context.auth);

    const testEndpoints = context.endpoints
      .filter((e) => ['GET', 'POST'].includes(e.method))
      .slice(0, 3);

    for (const endpoint of testEndpoints) {
      const url = this.buildUrl(context.baseUrl, this.fillPathParams(endpoint.path));
      const numRequests = 25;
      const responses: number[] = [];
      const responseHeaders: Record<string, string>[] = [];

      tested++;

      const requestStart = Date.now();

      await Promise.all(
        Array.from({ length: numRequests }, async (_, i) => {
          try {
            const resp = await axios.request({
              method: endpoint.method as any,
              url,
              headers: authHeaders,
              timeout: 5000,
              validateStatus: () => true,
            });
            responses.push(resp.status);
            responseHeaders.push(resp.headers as any);
          } catch {
            responses.push(0);
          }
        }),
      );

      const duration = Date.now() - requestStart;
      const rateLimited = responses.filter((s) => s === 429).length;
      const successCount = responses.filter((s) => s >= 200 && s < 300).length;

      const lastHeaders = responseHeaders[responseHeaders.length - 1] || {};
      const hasRateLimitHeaders = !!(
        lastHeaders['x-ratelimit-limit'] ||
        lastHeaders['x-rate-limit-limit'] ||
        lastHeaders['ratelimit-limit'] ||
        lastHeaders['x-ratelimit-remaining'] ||
        lastHeaders['retry-after']
      );

      if (rateLimited === 0 && successCount > numRequests * 0.8) {
        findings.push({
          title: 'No Rate Limiting Detected',
          category: 'Resource Consumption',
          severity: 'HIGH',
          cvssScore: 7.5,
          owaspCategory: 'API4:2023',
          cweId: 'CWE-770',
          pluginId: this.id,
          endpointId: endpoint.id,
          affectedUrl: `${endpoint.method} ${url}`,
          description: `Sent ${numRequests} rapid requests to ${endpoint.method} ${endpoint.path} in ${duration}ms. All ${successCount} succeeded with no rate limiting (HTTP 429) responses detected and no rate limit headers present. This allows attackers to send unlimited requests.`,
          impact: 'Without rate limiting, attackers can: perform brute force attacks on authentication endpoints, scrape all data from the API, cause denial of service by exhausting server resources, and harvest sensitive information at scale.',
          likelihood: 'HIGH',
          riskScore: 7.5,
          evidence: {
            requestsSent: numRequests,
            successfulRequests: successCount,
            rateLimitedRequests: rateLimited,
            durationMs: duration,
            hasRateLimitHeaders,
            url,
            ratePerSecond: Math.round((numRequests / duration) * 1000),
          },
          httpRequest: this.buildRequestString(endpoint.method, url, authHeaders),
          httpResponse: this.buildResponseString(
            responses[0] || 200,
            responseHeaders[0] || {},
            null,
          ),
          remediation: `Implement rate limiting for all API endpoints:
1. Use a rate limiting middleware (e.g., express-rate-limit, nestjs/throttler)
2. Return 429 Too Many Requests with Retry-After header when limit exceeded
3. Implement per-user and per-IP rate limits
4. Add rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)

Example (NestJS with @nestjs/throttler):
\`\`\`typescript
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('auth')
export class AuthController {}
\`\`\``,
          references: [
            'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/',
            'https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html',
          ],
        });
      } else if (!hasRateLimitHeaders && rateLimited > 0) {
        findings.push({
          title: 'Rate Limiting Present But Missing Rate Limit Headers',
          category: 'Resource Consumption',
          severity: 'LOW',
          cvssScore: 3.1,
          owaspCategory: 'API4:2023',
          pluginId: this.id,
          endpointId: endpoint.id,
          affectedUrl: `${endpoint.method} ${url}`,
          description: `Rate limiting is enforced (received ${rateLimited} HTTP 429 responses) but no standard rate limit headers are returned. Without these headers, clients cannot implement backoff strategies.`,
          impact: 'API clients cannot gracefully handle rate limits, leading to poor user experience and potential retry storms.',
          likelihood: 'LOW',
          riskScore: 3.1,
          evidence: { rateLimitedRequests: rateLimited, hasRateLimitHeaders: false },
          remediation: 'Add rate limit response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, and Retry-After.',
          references: [
            'https://tools.ietf.org/id/draft-polli-ratelimit-headers-00.html',
          ],
        });
      }

      await this.delay(1000);
    }

    return {
      pluginId: this.id,
      pluginName: this.name,
      findings,
      scanDuration: Date.now() - start,
      endpointsTested: tested,
    };
  }
}
