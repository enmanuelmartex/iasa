export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
}

export type AuditActionType =
  | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT'
  | 'SCAN_START' | 'SCAN_STOP' | 'ROLE_CHANGE' | 'PASSWORD_RESET';

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { projects: number };
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: { id: string; name: string; email: string };
  action: AuditActionType;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  baseUrl: string;
  environment: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  tags: string[];
  isActive: boolean;
  userId: string;
  apiSpec?: ApiSpec;
  assessments?: Assessment[];
  _count?: { assessments: number };
  createdAt: string;
  updatedAt: string;
}

export interface ApiSpec {
  id: string;
  projectId: string;
  source: 'URL' | 'UPLOAD' | 'MANUAL';
  url?: string;
  title?: string;
  version?: string;
  endpoints?: Endpoint[];
  authConfig?: AuthConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AuthConfig {
  id: string;
  type: 'NONE' | 'BEARER' | 'BASIC' | 'API_KEY' | 'OAUTH2' | 'CUSTOM';
  apiKeyHeader?: string;
  apiKeyLocation?: string;
  tokenUrl?: string;
  scopes?: string[];
}

export interface Endpoint {
  id: string;
  path: string;
  method: string;
  summary?: string;
  tags?: string[];
  deprecated?: boolean;
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type FindingStatus = 'OPEN' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED' | 'ACCEPTED_RISK';
export type AssessmentStatus = 'PENDING' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Assessment {
  id: string;
  projectId: string;
  project?: { id: string; name: string; baseUrl: string; environment?: string };
  status: AssessmentStatus;
  progress: number;
  currentStep?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  jobId?: string;
  config?: AssessmentConfig;
  summary?: AssessmentSummary;
  findings?: Finding[];
  reports?: Report[];
  logs?: AssessmentLog[];
  _count?: { findings: number };
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentConfig {
  executionMode: 'all' | 'profile' | 'manual';
  scanProfileId?: string;
  manualPlugins?: string[];
  enableAiAnalysis: boolean;
  maxRequestsPerEndpoint: number;
  requestDelayMs: number;
  timeoutMs: number;
}

export interface AssessmentSummary {
  totalEndpoints: number;
  testedEndpoints: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  securityScore: number;
  riskLevel: string;
  owaspCoverage?: Record<string, number>;
  /** Plugin execution plan — which ran, which were skipped, timing, finding counts */
  pluginResults?: PluginExecutionPlan;
  /** AI analysis metadata — provider, model, findings analyzed, reason if skipped */
  aiStatus?: AiAnalysisMeta;
}

export interface PluginExecutionPlan {
  available:     string[];
  executed:      string[];
  skipped:       string[];
  skippedReason: Record<string, string>;
  versions:      Record<string, string>;
  durationMs:    Record<string, number>;
  findingCounts: Record<string, number>;
}

export interface AiAnalysisMeta {
  provider:      string;
  model:         string;
  available:     boolean;
  analyzed:      number;
  skipped:       number;
  durationMs:    number;
  tokensUsed:    number;
  reason?:       string;
  /** completed = ran successfully; skipped = disabled / no provider; failed = provider error */
  status?:       'completed' | 'skipped' | 'failed';
  /** Provider error detail when status === 'failed' */
  errorMessage?: string;
}

export interface AiProviderStatus {
  provider:  string;
  model:     string;
  available: boolean;
  reason?:   string;
}

export type AiProfile = 'minimal' | 'balanced' | 'complete' | 'custom';

/** Per-provider config row from the API. One row exists per configured provider. */
export interface AiProviderConfig {
  provider:         string;
  model:            string;
  maskedKey?:       string;
  hasKey:           boolean;
  baseUrl?:         string;
  isActive:         boolean;
  profile:          AiProfile;
  analyzeCritical:  boolean;
  analyzeHigh:      boolean;
  analyzeMedium:    boolean;
  analyzeLow:       boolean;
  executiveSummary: boolean;
  maxTokens:        number;
  temperature:      number;
  timeoutMs:        number;
  maxFindings:      number;
  retryAttempts:    number;
  configSource:     'database' | 'environment' | 'defaults';
  lastTestedAt?:    string;
  lastTestSuccess?: boolean;
  lastTestMessage?: string;
  configuredAt?:    string;
  envHasKey:        boolean;
  envModel?:        string;
}

export interface AiEnvStatus {
  openai:  { apiKey: boolean; model: string };
  grok:    { apiKey: boolean; model: string };
  claude:  { apiKey: boolean; model: string };
  gemini:  { apiKey: boolean; model: string };
  ollama:  { baseUrl: string; model: string };
  activeProvider: string;
}

export interface AiTestConnectionResult {
  success:    boolean;
  message:    string;
  latencyMs?: number;
  model?:     string;
}

export interface Finding {
  id: string;
  assessmentId: string;
  endpointId?: string;
  assessment?: { id: string; project: { id: string; name: string } };
  endpoint?: { path: string; method: string };
  title: string;
  category: string;
  severity: Severity;
  cvssScore?: number;
  cvssVector?: string;
  owaspCategory: string;
  cweId?: string;
  pluginId: string;
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
  aiAnalysis?: any;
  status: FindingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  assessmentId: string;
  assessment?: {
    id: string;
    project: { id: string; name: string };
    summary?: AssessmentSummary;
    findings?: Finding[];
  };
  type: 'EXECUTIVE' | 'TECHNICAL' | 'COMPLIANCE' | 'DEVELOPER';
  format: 'PDF' | 'HTML' | 'MARKDOWN' | 'JSON' | 'SARIF';
  title: string;
  filePath?: string;
  fileSize?: number;
  checksum?: string;
  generatedAt: string;
}

export interface ReportTrendPoint {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  score: number;
}

export interface ReportStats {
  totalReports: number;
  totalAssessments: number;
  totalProjects: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  avgSecurityScore: number;
  avgDuration: number;
  trend: ReportTrendPoint[];
}

export interface AssessmentLog {
  id: string;
  level: string;
  plugin?: string;
  message: string;
  timestamp: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalAssessments: number;
  avgSecurityScore: number;
  findings: Record<string, number>;
  recentAssessments: Assessment[];
}

// =============================================================================
// PLUGIN MANAGEMENT
// =============================================================================

export type PluginCategory =
  | 'Authentication' | 'Authorization' | 'Headers' | 'Injection'
  | 'API Design' | 'Performance' | 'Infrastructure' | 'Compliance'
  | 'AI' | 'Cloud' | 'GraphQL' | 'gRPC' | 'SOAP';

export type PluginExecutionStatus = 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'SKIPPED';

export interface PluginConfigField {
  key: string;
  label: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
  default?: any;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  required?: boolean;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  longDescription?: string;
  author: string;
  category: PluginCategory;
  owaspMappings: string[];
  cweIds: string[];
  tags: string[];
  isBuiltin: boolean;
  isEnabled: boolean;
  configSchema?: { fields: PluginConfigField[] };
  defaultConfig?: Record<string, any>;
  userConfig?: Record<string, any> | null;
  permissions: string[];
  documentationUrl?: string;
  changelog?: string;
  license: string;
  stats?: {
    totalExecutions: number;
    avgDurationMs: number;
    successRate?: number;
    findingsBySeverity?: Record<string, number>;
  };
  recentExecutions?: PluginExecution[];
  createdAt: string;
  updatedAt: string;
}

export interface PluginExecution {
  id: string;
  pluginId: string;
  assessmentId?: string;
  userId: string;
  status: PluginExecutionStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  findingsCount: number;
  errorMessage?: string;
  createdAt: string;
}

export interface ScanProfile {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  userId?: string;
  isSystem: boolean;
  enabledPlugins: string[];
  pluginConfigs?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SinglePluginRunResult {
  pluginId: string;
  pluginName: string;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  findingsCount: number;
  durationMs: number;
  findings: any[];
  error?: string;
  executionId: string;
}

// =============================================================================

export interface ScanProgress {
  step: string;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  message: string;
  findingsCount: number;
  currentPlugin?: string;
  completed?: boolean;
  error?: string;
}
