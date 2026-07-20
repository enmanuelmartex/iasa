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
  status: 'DRAFT' | 'READY';
  setupStep: number;
  completedAt?: string;
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
/**
 * Triage state of a persistent vulnerability. Mirrors the Prisma IssueStatus
 * enum. `ACKNOWLEDGED` replaced the old `CONFIRMED`.
 */
export type IssueStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'RESOLVED'
  | 'ACCEPTED_RISK'
  | 'FALSE_POSITIVE';

/** Statuses whose transition must carry a reason, for the audit trail. */
export const ISSUE_STATUSES_REQUIRING_REASON: IssueStatus[] = [
  'RESOLVED',
  'ACCEPTED_RISK',
  'FALSE_POSITIVE',
];

/** A vulnerability that persists across scans. */
export interface SecurityIssue {
  id: string;
  projectId: string;
  fingerprint: string;
  fingerprintVersion: string;
  pluginId: string;
  ruleId: string;
  method: string;
  normalizedRoute: string;
  component: string;
  title: string;
  description: string;
  severity: Severity;
  owaspCategory: string;
  cweId?: string | null;
  cvssScore?: number | null;
  status: IssueStatus;
  notes?: string | null;
  assigneeId?: string | null;
  acceptedRiskUntil?: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  resolvedAt?: string | null;
  reopenedAt?: string | null;
  reopenCount: number;
  occurrenceCount: number;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string };
  assignee?: { id: string; name: string; email: string } | null;
  occurrences?: FindingOccurrence[];
  statusChanges?: IssueStatusChange[];
}

/** One immutable detection of an issue by one scan. */
export interface FindingOccurrence {
  id: string;
  issueId: string;
  assessmentId: string;
  endpointId?: string | null;
  titleSnapshot: string;
  descriptionSnapshot: string;
  severitySnapshot: Severity;
  owaspSnapshot: string;
  cweSnapshot?: string | null;
  cvssSnapshot?: number | null;
  methodSnapshot: string;
  pathSnapshot: string;
  ruleIdSnapshot: string;
  pluginIdSnapshot: string;
  pluginVersionSnapshot: string;
  impactSnapshot?: string | null;
  remediationSnapshot?: string | null;
  evidence?: unknown;
  httpRequest?: string | null;
  httpResponse?: string | null;
  affectedUrl?: string | null;
  location: string;
  detectedAt: string;
  assessment?: { id: string; createdAt: string; status: string };
  issue?: Pick<SecurityIssue, 'id' | 'status' | 'firstSeenAt' | 'lastSeenAt' | 'occurrenceCount'>;
}

/** One entry in an issue's auditable triage history. */
export interface IssueStatusChange {
  id: string;
  issueId: string;
  fromStatus?: IssueStatus | null;
  toStatus: IssueStatus;
  actorId?: string | null;
  assessmentId?: string | null;
  reason?: string | null;
  automatic: boolean;
  acceptedRiskUntil?: string | null;
  createdAt: string;
  actor?: { id: string; name: string; email: string } | null;
}

/** Standard envelope for paginated list endpoints. */
export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
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
  /** Detections this scan produced, each linked to its persistent issue. */
  occurrences?: FindingOccurrence[];
  reports?: Report[];
  logs?: AssessmentLog[];
  _count?: { occurrences: number };
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentConfig {
  executionMode: 'all' | 'profile' | 'manual';
  scanProfileId?: string;
  manualPlugins?: string[];
  resolvedPlugins?: string[];
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
  /**
   * Null when no score could be computed. Always read together with
   * `scoreStatus`: a score without its status can misrepresent a partial or
   * failed run as a real result.
   */
  securityScore: number | null;
  scoreStatus: 'UNAVAILABLE' | 'PROVISIONAL' | 'FINAL';
  scoreVersion?: string | null;
  scoreComputedAt?: string | null;
  plannedChecks?: number;
  successfulChecks?: number;
  failedChecks?: number;
  skippedChecks?: number;
  executionErrors?: number;
  coveragePercent?: number | null;
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
  /** Attempted but did not complete. Never treated as "ran successfully". */
  failed:        string[];
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

// The legacy `Finding` interface was removed in Phase 1C. A detection is now
// a `FindingOccurrence` and a vulnerability is a `SecurityIssue`; the old type
// conflated the two, which is why the same problem appeared once per scan.

export interface Report {
  id: string;
  assessmentId: string;
  assessment?: {
    id: string;
    project: { id: string; name: string };
    summary?: AssessmentSummary;
    occurrences?: FindingOccurrence[];
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
  /** Null when no project has a computable score. Never substitute 0 or 100. */
  avgSecurityScore: number | null;
  scoredProjects?: number;
  unassessedProjects?: number;
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
  /** Null when no project has a computable score. Never substitute 0 or 100. */
  avgSecurityScore: number | null;
  scoredProjects?: number;
  unassessedProjects?: number;
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

// =============================================================================
// Finance — estimated AI usage cost (real token usage x static rate table)
// =============================================================================

export interface AiUsageEvent {
  id: string;
  assessmentId: string;
  projectId: string;
  project?: { id: string; name: string };
  provider: string;
  model?: string;
  status: string;
  tokensUsed: number;
  estimatedCostUsd: number;
  createdAt: string;
}

export interface FinanceCostByProvider {
  provider: string;
  tokensUsed: number;
  costUsd: number;
  count: number;
}

export interface FinanceTrendPoint {
  month: string; // YYYY-MM
  costUsd: number;
}

export interface FinanceSummary {
  totalEstimatedCostUsd: number;
  totalTokensUsed: number;
  assessmentsWithAi: number;
  avgCostPerAssessment: number;
  byProvider: FinanceCostByProvider[];
  trend: FinanceTrendPoint[];
}

export interface FinanceUsagePage {
  items: AiUsageEvent[];
  total: number;
  page: number;
  pageSize: number;
}
