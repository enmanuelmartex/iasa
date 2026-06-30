import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { ScannerService } from './scanner.service';
import { ScanContext } from './types/scanner.types';

@Processor('scanner', {
  concurrency: 3,
})
export class ScannerProcessor extends WorkerHost {
  private readonly logger = new Logger(ScannerProcessor.name);

  constructor(
    private prisma: PrismaService,
    private scannerService: ScannerService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<{ assessmentId: string; projectId: string; specId: string }>) {
    const { assessmentId, projectId, specId } = job.data;
    const startTime = Date.now();

    this.logger.log(`Starting assessment ${assessmentId}`);

    try {
      await this.prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: 'RUNNING', startedAt: new Date(), progress: 0 },
      });

      this.emit(assessmentId, {
        step: 'Initializing',
        stepIndex: 0,
        totalSteps: 12,
        progress: 2,
        message: 'Initializing assessment engine...',
        findingsCount: 0,
      });

      const spec = await this.prisma.apiSpec.findUnique({
        where: { id: specId },
        include: {
          authConfig: true,
          endpoints: true,
        },
      });

      if (!spec) throw new Error('API specification not found');

      const assessmentConfig = await this.prisma.assessmentConfig.findUnique({
        where: { assessmentId },
      });

      this.emit(assessmentId, {
        step: 'Parsing',
        stepIndex: 1,
        totalSteps: 12,
        progress: 8,
        message: `Discovered ${spec.endpoints.length} endpoints`,
        findingsCount: 0,
      });

      await this.addLog(assessmentId, 'info', 'core', `Found ${spec.endpoints.length} endpoints to test`);

      const context: ScanContext = {
        assessmentId,
        projectId,
        baseUrl: (await this.prisma.project.findUnique({ where: { id: projectId } }))?.baseUrl ?? '',
        auth: {
          type: (spec.authConfig?.type as any) || 'NONE',
          token: spec.authConfig?.token ?? undefined,
          username: spec.authConfig?.username ?? undefined,
          password: spec.authConfig?.password ?? undefined,
          apiKey: spec.authConfig?.apiKey ?? undefined,
          apiKeyHeader: spec.authConfig?.apiKeyHeader ?? undefined,
          apiKeyLocation: (spec.authConfig?.apiKeyLocation as any) ?? 'header',
          customHeaders: (spec.authConfig?.customHeaders as any) ?? undefined,
        },
        endpoints: spec.endpoints.map((e) => ({
          id: e.id,
          path: e.path,
          method: e.method,
          summary: e.summary ?? undefined,
          tags: e.tags,
          parameters: (e.parameters as any) ?? [],
          requestBody: e.requestBody ?? undefined,
          responses: e.responses ?? undefined,
          security: (e.security as any) ?? [],
          deprecated: e.deprecated,
        })),
        config: {
          enableBola: assessmentConfig?.enableBola ?? true,
          enableBrokenAuth: assessmentConfig?.enableBrokenAuth ?? true,
          enableMassAssignment: assessmentConfig?.enableMassAssignment ?? true,
          enableRateLimit: assessmentConfig?.enableRateLimit ?? true,
          enableBfla: assessmentConfig?.enableBfla ?? true,
          enableSsrf: assessmentConfig?.enableSsrf ?? false,
          enableSecurityHeaders: assessmentConfig?.enableSecurityHeaders ?? true,
          enableCors: assessmentConfig?.enableCors ?? true,
          enableJwtAnalysis: assessmentConfig?.enableJwtAnalysis ?? true,
          enableSensitiveData: assessmentConfig?.enableSensitiveData ?? true,
          enableAiAnalysis: assessmentConfig?.enableAiAnalysis ?? true,
          maxRequestsPerEndpoint: assessmentConfig?.maxRequestsPerEndpoint ?? 10,
          requestDelayMs: assessmentConfig?.requestDelayMs ?? 200,
          timeoutMs: assessmentConfig?.timeoutMs ?? 10000,
        },
      };

      await this.prisma.assessmentSummary.create({
        data: {
          assessmentId,
          totalEndpoints: spec.endpoints.length,
          testedEndpoints: 0,
        },
      });

      const allFindings = await this.scannerService.runAllPlugins(
        context,
        (progress) => {
          this.emit(assessmentId, progress);
          this.updateProgress(assessmentId, progress.progress);
        },
        (logEntry) => {
          this.addLog(assessmentId, logEntry.level, logEntry.plugin, logEntry.message);
        },
      );

      this.emit(assessmentId, {
        step: 'Saving Results',
        stepIndex: 11,
        totalSteps: 12,
        progress: 92,
        message: `Saving ${allFindings.length} findings...`,
        findingsCount: allFindings.length,
      });

      const savedFindings = await Promise.all(
        allFindings.map((f) =>
          this.prisma.finding.create({
            data: {
              assessmentId,
              endpointId: f.endpointId || null,
              title: f.title,
              category: f.category,
              severity: f.severity,
              cvssScore: f.cvssScore,
              cvssVector: f.cvssVector,
              owaspCategory: f.owaspCategory,
              cweId: f.cweId,
              pluginId: f.pluginId,
              affectedUrl: f.affectedUrl,
              description: f.description,
              impact: f.impact,
              likelihood: f.likelihood,
              riskScore: f.riskScore,
              evidence: f.evidence as any,
              httpRequest: f.httpRequest,
              httpResponse: f.httpResponse,
              remediation: f.remediation,
              references: f.references || [],
            },
          }),
        ),
      );

      const summary = this.calculateSummary(allFindings, spec.endpoints.length);

      await this.prisma.assessmentSummary.update({
        where: { assessmentId },
        data: {
          testedEndpoints: spec.endpoints.length,
          totalFindings: allFindings.length,
          criticalCount: summary.critical,
          highCount: summary.high,
          mediumCount: summary.medium,
          lowCount: summary.low,
          infoCount: summary.info,
          securityScore: summary.score,
          riskLevel: summary.riskLevel,
          owaspCoverage: summary.owaspCoverage as any,
        },
      });

      const duration = Math.round((Date.now() - startTime) / 1000);

      await this.prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          progress: 100,
          duration,
          currentStep: 'Completed',
        },
      });

      this.emit(assessmentId, {
        step: 'Completed',
        stepIndex: 12,
        totalSteps: 12,
        progress: 100,
        message: `Assessment completed. Found ${allFindings.length} issues in ${duration}s`,
        findingsCount: allFindings.length,
        completed: true,
      });

      this.logger.log(
        `Assessment ${assessmentId} completed in ${duration}s with ${allFindings.length} findings`,
      );

      return { assessmentId, findingsCount: allFindings.length, duration };
    } catch (error) {
      this.logger.error(`Assessment ${assessmentId} failed: ${error.message}`, error.stack);

      await this.prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          currentStep: `Failed: ${error.message}`,
        },
      });

      await this.addLog(assessmentId, 'error', 'core', error.message);

      this.emit(assessmentId, {
        step: 'Failed',
        progress: 0,
        message: `Assessment failed: ${error.message}`,
        findingsCount: 0,
        error: error.message,
      });

      throw error;
    }
  }

  private emit(assessmentId: string, data: any) {
    this.eventEmitter.emit('scanner.progress', { assessmentId, ...data });
  }

  private async updateProgress(assessmentId: string, progress: number) {
    await this.prisma.assessment.update({
      where: { id: assessmentId },
      data: { progress },
    });
  }

  private async addLog(assessmentId: string, level: string, plugin: string, message: string) {
    await this.prisma.assessmentLog.create({
      data: { assessmentId, level, plugin, message },
    });
  }

  private calculateSummary(findings: any[], totalEndpoints: number) {
    const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
    const high = findings.filter((f) => f.severity === 'HIGH').length;
    const medium = findings.filter((f) => f.severity === 'MEDIUM').length;
    const low = findings.filter((f) => f.severity === 'LOW').length;
    const info = findings.filter((f) => f.severity === 'INFO').length;

    let score = 100;
    score -= critical * 20;
    score -= high * 10;
    score -= medium * 5;
    score -= low * 2;
    score = Math.max(0, Math.min(100, score));

    let riskLevel = 'LOW';
    if (critical > 0) riskLevel = 'CRITICAL';
    else if (high > 2) riskLevel = 'HIGH';
    else if (high > 0 || medium > 3) riskLevel = 'HIGH';
    else if (medium > 0 || low > 5) riskLevel = 'MEDIUM';

    const owaspCoverage: Record<string, number> = {};
    for (const f of findings) {
      owaspCoverage[f.owaspCategory] = (owaspCoverage[f.owaspCategory] || 0) + 1;
    }

    return { critical, high, medium, low, info, score, riskLevel, owaspCoverage };
  }
}
