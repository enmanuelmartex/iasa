export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  avatar?: string;
  lastLogin?: string;
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
  enableBola: boolean;
  enableBrokenAuth: boolean;
  enableMassAssignment: boolean;
  enableRateLimit: boolean;
  enableBfla: boolean;
  enableSsrf: boolean;
  enableSecurityHeaders: boolean;
  enableCors: boolean;
  enableJwtAnalysis: boolean;
  enableSensitiveData: boolean;
  enableAiAnalysis: boolean;
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
  type: 'EXECUTIVE' | 'TECHNICAL' | 'COMPLIANCE' | 'DEVELOPER';
  format: 'PDF' | 'HTML' | 'MARKDOWN' | 'JSON' | 'SARIF';
  title: string;
  filePath?: string;
  fileSize?: number;
  checksum?: string;
  generatedAt: string;
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
