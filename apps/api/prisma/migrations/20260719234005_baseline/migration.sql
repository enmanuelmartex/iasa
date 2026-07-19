-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ANALYST', 'VIEWER');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "SpecSource" AS ENUM ('URL', 'UPLOAD', 'MANUAL');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'BEARER', 'BASIC', 'API_KEY', 'OAUTH2', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'READY');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "FindingStatus" AS ENUM ('OPEN', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED', 'ACCEPTED_RISK');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'ACCEPTED_RISK', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "OccurrenceValidation" AS ENUM ('UNVERIFIED', 'VERIFIED', 'REFUTED');

-- CreateEnum
CREATE TYPE "ScoreStatus" AS ENUM ('UNAVAILABLE', 'PROVISIONAL', 'FINAL');

-- CreateEnum
CREATE TYPE "AssetCriticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('EXECUTIVE', 'TECHNICAL', 'COMPLIANCE', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'HTML', 'MARKDOWN', 'JSON', 'SARIF');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'SCAN_START', 'SCAN_STOP', 'ROLE_CHANGE', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "PluginCategory" AS ENUM ('AUTHENTICATION', 'AUTHORIZATION', 'HEADERS', 'INJECTION', 'API_DESIGN', 'PERFORMANCE', 'INFRASTRUCTURE', 'COMPLIANCE', 'AI', 'CLOUD', 'GRAPHQL', 'GRPC', 'SOAP');

-- CreateEnum
CREATE TYPE "PluginExecutionStatus" AS ENUM ('SUCCESS', 'FAILED', 'TIMEOUT', 'SKIPPED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPreview" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scopes" TEXT[] DEFAULT ARRAY['read', 'write']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "token" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'DEVELOPMENT',
    "assetCriticality" "AssetCriticality" NOT NULL DEFAULT 'MEDIUM',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "ProjectStatus" NOT NULL DEFAULT 'READY',
    "setupStep" INTEGER NOT NULL DEFAULT 3,
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_specs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "source" "SpecSource" NOT NULL,
    "url" TEXT,
    "rawSpec" JSONB NOT NULL,
    "parsed" JSONB NOT NULL,
    "version" TEXT,
    "title" TEXT,
    "format" TEXT DEFAULT 'openapi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_configs" (
    "id" TEXT NOT NULL,
    "apiSpecId" TEXT NOT NULL,
    "type" "AuthType" NOT NULL DEFAULT 'NONE',
    "token" TEXT,
    "username" TEXT,
    "password" TEXT,
    "apiKey" TEXT,
    "apiKeyHeader" TEXT DEFAULT 'X-API-Key',
    "apiKeyLocation" TEXT DEFAULT 'header',
    "clientId" TEXT,
    "clientSecret" TEXT,
    "tokenUrl" TEXT,
    "scopes" TEXT[],
    "customHeaders" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endpoints" (
    "id" TEXT NOT NULL,
    "apiSpecId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "operationId" TEXT,
    "tags" TEXT[],
    "parameters" JSONB,
    "requestBody" JSONB,
    "responses" JSONB,
    "security" JSONB,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentStep" TEXT,
    "jobId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_configs" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "executionMode" TEXT NOT NULL DEFAULT 'all',
    "scanProfileId" TEXT,
    "manualPlugins" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resolvedPlugins" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enableAiAnalysis" BOOLEAN NOT NULL DEFAULT true,
    "maxRequestsPerEndpoint" INTEGER NOT NULL DEFAULT 10,
    "requestDelayMs" INTEGER NOT NULL DEFAULT 200,
    "timeoutMs" INTEGER NOT NULL DEFAULT 10000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_summaries" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "totalEndpoints" INTEGER NOT NULL DEFAULT 0,
    "testedEndpoints" INTEGER NOT NULL DEFAULT 0,
    "totalFindings" INTEGER NOT NULL DEFAULT 0,
    "criticalCount" INTEGER NOT NULL DEFAULT 0,
    "highCount" INTEGER NOT NULL DEFAULT 0,
    "mediumCount" INTEGER NOT NULL DEFAULT 0,
    "lowCount" INTEGER NOT NULL DEFAULT 0,
    "infoCount" INTEGER NOT NULL DEFAULT 0,
    "securityScore" DOUBLE PRECISION,
    "scoreStatus" "ScoreStatus" NOT NULL DEFAULT 'UNAVAILABLE',
    "scoreVersion" TEXT,
    "scoreComputedAt" TIMESTAMP(3),
    "scoreExplanation" JSONB,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "plannedChecks" INTEGER NOT NULL DEFAULT 0,
    "successfulChecks" INTEGER NOT NULL DEFAULT 0,
    "failedChecks" INTEGER NOT NULL DEFAULT 0,
    "skippedChecks" INTEGER NOT NULL DEFAULT 0,
    "executionErrors" INTEGER NOT NULL DEFAULT 0,
    "coveragePercent" DOUBLE PRECISION,
    "owaspCoverage" JSONB,
    "pluginResults" JSONB,
    "aiStatus" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_logs" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "plugin" TEXT,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "findings" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "endpointId" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "cvssScore" DOUBLE PRECISION,
    "cvssVector" TEXT,
    "owaspCategory" TEXT NOT NULL,
    "cweId" TEXT,
    "pluginId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT,
    "likelihood" TEXT,
    "riskScore" DOUBLE PRECISION,
    "evidence" JSONB,
    "httpRequest" TEXT,
    "httpResponse" TEXT,
    "affectedUrl" TEXT,
    "remediation" TEXT,
    "references" TEXT[],
    "aiSummary" TEXT,
    "aiAnalysis" JSONB,
    "aiGeneratedAt" TIMESTAMP(3),
    "status" "FindingStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_issues" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "fingerprintVersion" TEXT NOT NULL DEFAULT 'v1',
    "pluginId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "normalizedRoute" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "owaspCategory" TEXT NOT NULL,
    "cweId" TEXT,
    "cvssScore" DOUBLE PRECISION,
    "cvssVector" TEXT,
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "assigneeId" TEXT,
    "acceptedRiskUntil" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "reopenedAt" TIMESTAMP(3),
    "reopenCount" INTEGER NOT NULL DEFAULT 0,
    "occurrenceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finding_occurrences" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "endpointId" TEXT,
    "occurrenceKey" TEXT NOT NULL,
    "methodSnapshot" TEXT NOT NULL,
    "pathSnapshot" TEXT NOT NULL,
    "operationIdSnapshot" TEXT,
    "pluginIdSnapshot" TEXT NOT NULL,
    "pluginVersionSnapshot" TEXT NOT NULL,
    "ruleIdSnapshot" TEXT NOT NULL,
    "severitySnapshot" "Severity" NOT NULL,
    "cvssSnapshot" DOUBLE PRECISION,
    "owaspSnapshot" TEXT NOT NULL,
    "cweSnapshot" TEXT,
    "titleSnapshot" TEXT NOT NULL,
    "descriptionSnapshot" TEXT NOT NULL,
    "impactSnapshot" TEXT,
    "remediationSnapshot" TEXT,
    "evidence" JSONB,
    "httpRequest" TEXT,
    "httpResponse" TEXT,
    "affectedUrl" TEXT,
    "location" TEXT NOT NULL,
    "validation" "OccurrenceValidation" NOT NULL DEFAULT 'UNVERIFIED',
    "assessmentConfigHash" TEXT,
    "specVersionSnapshot" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "finding_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_status_changes" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "fromStatus" "IssueStatus",
    "toStatus" "IssueStatus" NOT NULL,
    "actorId" TEXT,
    "assessmentId" TEXT,
    "reason" TEXT,
    "automatic" BOOLEAN NOT NULL DEFAULT false,
    "acceptedRiskUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_status_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "title" TEXT NOT NULL,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "content" TEXT,
    "checksum" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "author" TEXT NOT NULL DEFAULT 'IASA Core Team',
    "category" "PluginCategory" NOT NULL,
    "owaspMappings" TEXT[],
    "cweIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isBuiltin" BOOLEAN NOT NULL DEFAULT true,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "configSchema" JSONB,
    "defaultConfig" JSONB,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "documentationUrl" TEXT,
    "changelog" TEXT,
    "minimumCoreVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "license" TEXT NOT NULL DEFAULT 'MIT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plugins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_user_configs" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plugin_user_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_executions" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "assessmentId" TEXT,
    "userId" TEXT NOT NULL,
    "status" "PluginExecutionStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "findingsCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plugin_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "userId" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "enabledPlugins" TEXT[],
    "pluginConfigs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scan_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_provider_configs" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "apiKey" TEXT,
    "baseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "profile" TEXT NOT NULL DEFAULT 'balanced',
    "analyzeCritical" BOOLEAN NOT NULL DEFAULT true,
    "analyzeHigh" BOOLEAN NOT NULL DEFAULT true,
    "analyzeMedium" BOOLEAN NOT NULL DEFAULT false,
    "analyzeLow" BOOLEAN NOT NULL DEFAULT false,
    "executiveSummary" BOOLEAN NOT NULL DEFAULT true,
    "maxTokens" INTEGER,
    "temperature" DOUBLE PRECISION,
    "timeoutMs" INTEGER,
    "maxFindings" INTEGER,
    "retryAttempts" INTEGER NOT NULL DEFAULT 2,
    "lastTestedAt" TIMESTAMP(3),
    "lastTestSuccess" BOOLEAN,
    "lastTestMessage" TEXT,
    "configuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_provider_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "projects_userId_isActive_idx" ON "projects"("userId", "isActive");

-- CreateIndex
CREATE INDEX "projects_userId_status_idx" ON "projects"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "api_specs_projectId_key" ON "api_specs"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_configs_apiSpecId_key" ON "auth_configs"("apiSpecId");

-- CreateIndex
CREATE UNIQUE INDEX "endpoints_apiSpecId_path_method_key" ON "endpoints"("apiSpecId", "path", "method");

-- CreateIndex
CREATE INDEX "assessments_projectId_createdAt_idx" ON "assessments"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "assessments_projectId_status_idx" ON "assessments"("projectId", "status");

-- CreateIndex
CREATE INDEX "assessments_status_createdAt_idx" ON "assessments"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_configs_assessmentId_key" ON "assessment_configs"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_summaries_assessmentId_key" ON "assessment_summaries"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_logs_assessmentId_timestamp_idx" ON "assessment_logs"("assessmentId", "timestamp");

-- CreateIndex
CREATE INDEX "findings_assessmentId_idx" ON "findings"("assessmentId");

-- CreateIndex
CREATE INDEX "security_issues_projectId_status_idx" ON "security_issues"("projectId", "status");

-- CreateIndex
CREATE INDEX "security_issues_projectId_severity_idx" ON "security_issues"("projectId", "severity");

-- CreateIndex
CREATE INDEX "security_issues_projectId_lastSeenAt_idx" ON "security_issues"("projectId", "lastSeenAt");

-- CreateIndex
CREATE INDEX "security_issues_assigneeId_idx" ON "security_issues"("assigneeId");

-- CreateIndex
CREATE INDEX "security_issues_projectId_pluginId_idx" ON "security_issues"("projectId", "pluginId");

-- CreateIndex
CREATE INDEX "security_issues_status_acceptedRiskUntil_idx" ON "security_issues"("status", "acceptedRiskUntil");

-- CreateIndex
CREATE UNIQUE INDEX "security_issues_projectId_fingerprintVersion_fingerprint_key" ON "security_issues"("projectId", "fingerprintVersion", "fingerprint");

-- CreateIndex
CREATE INDEX "finding_occurrences_issueId_detectedAt_idx" ON "finding_occurrences"("issueId", "detectedAt");

-- CreateIndex
CREATE INDEX "finding_occurrences_assessmentId_idx" ON "finding_occurrences"("assessmentId");

-- CreateIndex
CREATE INDEX "finding_occurrences_endpointId_idx" ON "finding_occurrences"("endpointId");

-- CreateIndex
CREATE UNIQUE INDEX "finding_occurrences_assessmentId_occurrenceKey_key" ON "finding_occurrences"("assessmentId", "occurrenceKey");

-- CreateIndex
CREATE INDEX "issue_status_changes_issueId_createdAt_idx" ON "issue_status_changes"("issueId", "createdAt");

-- CreateIndex
CREATE INDEX "issue_status_changes_actorId_idx" ON "issue_status_changes"("actorId");

-- CreateIndex
CREATE INDEX "reports_assessmentId_idx" ON "reports"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "plugin_user_configs_pluginId_userId_key" ON "plugin_user_configs"("pluginId", "userId");

-- CreateIndex
CREATE INDEX "plugin_executions_pluginId_startedAt_idx" ON "plugin_executions"("pluginId", "startedAt");

-- CreateIndex
CREATE INDEX "plugin_executions_assessmentId_idx" ON "plugin_executions"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_provider_configs_provider_key" ON "ai_provider_configs"("provider");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_specs" ADD CONSTRAINT "api_specs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_configs" ADD CONSTRAINT "auth_configs_apiSpecId_fkey" FOREIGN KEY ("apiSpecId") REFERENCES "api_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_apiSpecId_fkey" FOREIGN KEY ("apiSpecId") REFERENCES "api_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_configs" ADD CONSTRAINT "assessment_configs_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_configs" ADD CONSTRAINT "assessment_configs_scanProfileId_fkey" FOREIGN KEY ("scanProfileId") REFERENCES "scan_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_summaries" ADD CONSTRAINT "assessment_summaries_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_logs" ADD CONSTRAINT "assessment_logs_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "endpoints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_issues" ADD CONSTRAINT "security_issues_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_issues" ADD CONSTRAINT "security_issues_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_occurrences" ADD CONSTRAINT "finding_occurrences_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "security_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_occurrences" ADD CONSTRAINT "finding_occurrences_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_occurrences" ADD CONSTRAINT "finding_occurrences_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "endpoints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_status_changes" ADD CONSTRAINT "issue_status_changes_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "security_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_status_changes" ADD CONSTRAINT "issue_status_changes_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_status_changes" ADD CONSTRAINT "issue_status_changes_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_user_configs" ADD CONSTRAINT "plugin_user_configs_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_user_configs" ADD CONSTRAINT "plugin_user_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_executions" ADD CONSTRAINT "plugin_executions_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_executions" ADD CONSTRAINT "plugin_executions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_profiles" ADD CONSTRAINT "scan_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

