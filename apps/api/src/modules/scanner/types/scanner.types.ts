export interface ScanContext {
  assessmentId: string;
  projectId: string;
  baseUrl: string;
  auth: AuthConfig;
  endpoints: ParsedEndpoint[];
  config: ScanConfig;
}

export interface AuthConfig {
  type: 'NONE' | 'BEARER' | 'BASIC' | 'API_KEY' | 'OAUTH2' | 'CUSTOM';
  token?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  apiKeyLocation?: 'header' | 'query';
  customHeaders?: Record<string, string>;
}

export interface ParsedEndpoint {
  id: string;
  path: string;
  method: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: EndpointParameter[];
  requestBody?: any;
  responses?: any;
  security?: any[];
  deprecated?: boolean;
}

export interface EndpointParameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  schema?: any;
  example?: any;
}

export interface ScanConfig {
  executionMode: 'all' | 'profile' | 'manual';
  selectedPlugins?: string[];  // resolved plugin IDs for this scan
  enableAiAnalysis: boolean;
  maxRequestsPerEndpoint: number;
  requestDelayMs: number;
  timeoutMs: number;
}

export interface ScanFinding {
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  cvssScore?: number;
  cvssVector?: string;
  owaspCategory: string;
  cweId?: string;
  pluginId: string;
  endpointId?: string;
  affectedUrl?: string;
  description: string;
  impact?: string;
  likelihood?: string;
  riskScore?: number;
  evidence?: any;
  httpRequest?: string;
  httpResponse?: string;
  remediation?: string;
  references?: string[];
  aiAnalysis?: {
    executiveSummary?: string;
    technicalAnalysis?: string;
    businessImpact?: string;
    confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
    falsePositiveRisk?: 'HIGH' | 'MEDIUM' | 'LOW';
    codeExamples?: { vulnerable?: string; fixed?: string };
  };
}

export interface PluginResult {
  pluginId: string;
  pluginName: string;
  findings: ScanFinding[];
  scanDuration: number;
  endpointsTested: number;
  error?: string;
}

export interface ScanProgress {
  assessmentId: string;
  step: string;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  message: string;
  findingsCount: number;
  currentPlugin?: string;
}

export abstract class BasePlugin {
  /** Full plugin manifest — single source of truth for metadata */
  abstract readonly manifest: import('./plugin-manifest.types').PluginManifest;

  // Convenience getters so existing code doesn't break
  get id(): string { return this.manifest.id; }
  get name(): string { return this.manifest.name; }
  get description(): string { return this.manifest.description; }
  get owaspCategories(): string[] { return this.manifest.owaspMappings; }

  abstract run(context: ScanContext, pluginConfig?: Record<string, any>): Promise<PluginResult>;

  protected buildRequestString(method: string, url: string, headers: Record<string, string>, body?: any): string {
    const headerLines = Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const bodyStr = body ? `\n\n${typeof body === 'string' ? body : JSON.stringify(body, null, 2)}` : '';
    return `${method.toUpperCase()} ${url} HTTP/1.1\n${headerLines}${bodyStr}`;
  }

  protected buildResponseString(status: number, headers: Record<string, string>, body: any): string {
    const headerLines = Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const bodyStr = body ? `\n\n${typeof body === 'string' ? body : JSON.stringify(body, null, 2)}` : '';
    return `HTTP/1.1 ${status}\n${headerLines}${bodyStr}`;
  }

  protected getAuthHeaders(auth: AuthConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'IASA-Scanner/1.0',
      'Accept': 'application/json, */*',
    };

    switch (auth.type) {
      case 'BEARER':
        if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`;
        break;
      case 'BASIC':
        if (auth.username && auth.password) {
          const creds = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
          headers['Authorization'] = `Basic ${creds}`;
        }
        break;
      case 'API_KEY':
        if (auth.apiKey && auth.apiKeyLocation !== 'query') {
          headers[auth.apiKeyHeader || 'X-API-Key'] = auth.apiKey;
        }
        break;
      case 'CUSTOM':
        Object.assign(headers, auth.customHeaders || {});
        break;
    }

    return headers;
  }

  protected getApiKeyQueryParam(auth: AuthConfig): Record<string, string> {
    if (auth.type === 'API_KEY' && auth.apiKeyLocation === 'query' && auth.apiKey) {
      return { [auth.apiKeyHeader || 'api_key']: auth.apiKey };
    }
    return {};
  }

  protected buildUrl(baseUrl: string, path: string, params?: Record<string, string>): string {
    const cleanBase = baseUrl.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    let url = `${cleanBase}/${cleanPath}`;

    if (params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }

    return url;
  }

  protected fillPathParams(path: string): string {
    return path.replace(/\{[^}]+\}/g, (match) => {
      const paramName = match.slice(1, -1).toLowerCase();
      if (paramName.includes('id') || paramName.includes('uuid')) return '1';
      if (paramName.includes('name')) return 'test';
      if (paramName.includes('slug')) return 'test-slug';
      if (paramName.includes('code')) return 'ABC123';
      return 'test';
    });
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
