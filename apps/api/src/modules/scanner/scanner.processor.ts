import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { ScannerService } from './scanner.service';
import { ScanContext, BasePlugin } from './types/scanner.types';
import { resolveTargetUrl } from '../../common/utils/url-resolver.util';
import { PluginRegistryService } from '../plugins/plugin-registry.service';
import { ReportGeneratorService } from '../reports/report-generator.service';
import { ReportsService } from '../reports/reports.service';

interface JobData {
  assessmentId: string;
  projectId:    string;
  specId:       string;
  userId?:      string;
}

@Processor('scanner', { concurrency: 3 })
export class ScannerProcessor extends WorkerHost {
  private readonly logger = new Logger(ScannerProcessor.name);

  constructor(
    private prisma:           PrismaService,
    private scannerService:   ScannerService,
    private eventEmitter:     EventEmitter2,
    private pluginRegistry:   PluginRegistryService,
    private reportGenerator:  ReportGeneratorService,
    private reportsService:   ReportsService,
  ) {
    super();
  }

  async process(job: Job<JobData>) {
    const { assessmentId, projectId, specId, userId } = job.data;
    const startTime = Date.now();

    this.logger.log(`Starting assessment ${assessmentId} (user: ${userId ?? 'anonymous'})`);

    try {
      await this.prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: 'RUNNING', startedAt: new Date(), progress: 0 },
      });

      this.emit(assessmentId, {
        step: 'Initializing', stepIndex: 0, totalSteps: 12,
        progress: 2, message: 'Initializing assessment engine...', findingsCount: 0,
      });

      const [spec, project] = await Promise.all([
        this.prisma.apiSpec.findUnique({
          where: { id: specId },
          include: { authConfig: true, endpoints: true },
        }),
        this.prisma.project.findUnique({ where: { id: projectId } }),
      ]);

      if (!spec)    throw new Error('API specification not found');
      if (!project) throw new Error('Project not found');

      // Cast to any: Bun's internal package cache serves stale Prisma types at
      // TS compile time; the DB schema and runtime behaviour are correct.
      const assessmentConfig: any = await this.prisma.assessmentConfig.findUnique({
        where: { assessmentId },
      });

      // The API resolves and freezes the effective selection before queueing.
      // Never fall back to all plugins when an explicit selection is empty/invalid.
      let resolvedPluginIds: string[] = assessmentConfig?.resolvedPlugins ?? [];

      // Backward compatibility for jobs created before resolvedPlugins existed.
      if (!resolvedPluginIds.length && assessmentConfig?.executionMode === 'profile' && assessmentConfig.scanProfileId) {
        const legacyProfile = await this.prisma.scanProfile.findUnique({ where: { id: assessmentConfig.scanProfileId } });
        resolvedPluginIds = legacyProfile?.enabledPlugins ?? [];
      } else if (!resolvedPluginIds.length && assessmentConfig?.executionMode === 'manual') {
        resolvedPluginIds = assessmentConfig.manualPlugins ?? [];
      } else if (!resolvedPluginIds.length && (!assessmentConfig?.executionMode || assessmentConfig.executionMode === 'all')) {
        resolvedPluginIds = userId
          ? (await this.pluginRegistry.getEnabledForUser(userId)).map((plugin) => plugin.manifest.id)
          : (await this.pluginRegistry.getEnabledGlobally()).map((plugin) => plugin.manifest.id);
      }

      if (!resolvedPluginIds.length) throw new Error('Assessment has no resolved plugins');
      const pluginOverride: BasePlugin[] = this.pluginRegistry.getByIds(resolvedPluginIds);
      if (pluginOverride.length !== resolvedPluginIds.length) {
        throw new Error('One or more assessment plugins are no longer available');
      }

      this.emit(assessmentId, {
        step: 'Parsing', stepIndex: 1, totalSteps: 12,
        progress: 8, message: `Discovered ${spec.endpoints.length} endpoints`, findingsCount: 0,
      });

      await this.addLog(assessmentId, 'info', 'core', `Found ${spec.endpoints.length} endpoints to test`);

      const context: ScanContext = {
        assessmentId,
        projectId,
        baseUrl: resolveTargetUrl(project.baseUrl ?? ''),
        auth: {
          type:           (spec.authConfig?.type as any) || 'NONE',
          token:          spec.authConfig?.token        ?? undefined,
          username:       spec.authConfig?.username     ?? undefined,
          password:       spec.authConfig?.password     ?? undefined,
          apiKey:         spec.authConfig?.apiKey       ?? undefined,
          apiKeyHeader:   spec.authConfig?.apiKeyHeader ?? undefined,
          apiKeyLocation: (spec.authConfig?.apiKeyLocation as any) ?? 'header',
          customHeaders:  (spec.authConfig?.customHeaders as any)  ?? undefined,
        },
        endpoints: spec.endpoints.map((e) => ({
          id:          e.id,
          path:        e.path,
          method:      e.method,
          summary:     e.summary     ?? undefined,
          tags:        e.tags,
          parameters:  (e.parameters as any) ?? [],
          requestBody: e.requestBody  ?? undefined,
          responses:   e.responses   ?? undefined,
          security:    (e.security as any) ?? [],
          deprecated:  e.deprecated,
        })),
        config: {
          executionMode:          (assessmentConfig?.executionMode as any) ?? 'all',
          enableAiAnalysis:       assessmentConfig?.enableAiAnalysis       ?? true,
          maxRequestsPerEndpoint: assessmentConfig?.maxRequestsPerEndpoint ?? 10,
          requestDelayMs:         assessmentConfig?.requestDelayMs         ?? 200,
          timeoutMs:              assessmentConfig?.timeoutMs              ?? 10000,
        },
      };

      await this.prisma.assessmentSummary.create({
        data: { assessmentId, totalEndpoints: spec.endpoints.length, testedEndpoints: 0 },
      });

      // ── Execute all enabled plugins + AI analysis ─────────────────────────
      const { findings, pluginPlan, aiMeta } = await this.scannerService.runAllPlugins(
        context,
        (progress) => {
          this.emit(assessmentId, progress);
          this.updateProgress(assessmentId, progress.progress);
        },
        (logEntry) => {
          this.addLog(assessmentId, logEntry.level, logEntry.plugin, logEntry.message);
        },
        userId,
        pluginOverride,
      );

      this.emit(assessmentId, {
        step: 'Saving Results', stepIndex: 11, totalSteps: 12,
        progress: 92, message: `Saving ${findings.length} findings...`, findingsCount: findings.length,
      });

      // ── Persist findings ──────────────────────────────────────────────────
      await Promise.all(
        findings.map((f) =>
          this.prisma.finding.create({
            data: {
              assessmentId,
              endpointId:   f.endpointId || null,
              title:        f.title,
              category:     f.category,
              severity:     f.severity,
              cvssScore:    f.cvssScore,
              cvssVector:   f.cvssVector,
              owaspCategory: f.owaspCategory,
              cweId:        f.cweId,
              pluginId:     f.pluginId,
              affectedUrl:  f.affectedUrl,
              description:  f.description,
              impact:       f.impact,
              likelihood:   f.likelihood,
              riskScore:    f.riskScore,
              evidence:     f.evidence as any,
              httpRequest:  f.httpRequest,
              httpResponse: f.httpResponse,
              remediation:  f.remediation,
              references:   f.references || [],
              aiAnalysis:   f.aiAnalysis as any ?? undefined,
            },
          }),
        ),
      );

      // ── Compute and persist summary ───────────────────────────────────────
      const summary = this.calculateSummary(findings, spec.endpoints.length);

      await this.prisma.assessmentSummary.update({
        where: { assessmentId },
        data: {
          testedEndpoints: spec.endpoints.length,
          totalFindings:   findings.length,
          criticalCount:   summary.critical,
          highCount:       summary.high,
          mediumCount:     summary.medium,
          lowCount:        summary.low,
          infoCount:       summary.info,
          securityScore:   summary.score,
          riskLevel:       summary.riskLevel,
          owaspCoverage:   summary.owaspCoverage,
          pluginResults:   pluginPlan as any,
          aiStatus:        aiMeta as any,
        },
      });

      const duration = Math.round((Date.now() - startTime) / 1000);

      await this.prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          status:      'COMPLETED',
          completedAt: new Date(),
          progress:    100,
          duration,
          currentStep: 'Completed',
        },
      });

      // PDF is the canonical automatic artifact; other formats remain on-demand exports.
      this.autoGenerateReport(assessmentId, userId).catch((err) =>
        this.logger.warn(`Auto-report generation failed for ${assessmentId}: ${err.message}`),
      );

      this.emit(assessmentId, {
        step:          'Completed',
        stepIndex:     12,
        totalSteps:    12,
        progress:      100,
        message:       `Assessment completed — ${findings.length} issues found in ${duration}s`,
        findingsCount: findings.length,
        completed:     true,
        pluginPlan,
        aiMeta,
      });

      this.logger.log(
        `Assessment ${assessmentId} completed in ${duration}s — ` +
        `${findings.length} findings, ${pluginPlan.executed.length} plugins ran, ` +
        `${pluginPlan.skipped.length} skipped, AI: ${aiMeta.available ? aiMeta.provider : 'off'}`,
      );

      return { assessmentId, findingsCount: findings.length, duration, pluginPlan, aiMeta };
    } catch (error) {
      this.logger.error(`Assessment ${assessmentId} failed: ${error.message}`, error.stack);

      await this.prisma.assessment.update({
        where: { id: assessmentId },
        data: { status: 'FAILED', completedAt: new Date(), currentStep: `Failed: ${error.message}` },
      });

      await this.addLog(assessmentId, 'error', 'core', error.message);

      this.emit(assessmentId, {
        step:         'Failed',
        progress:     0,
        message:      `Assessment failed: ${error.message}`,
        findingsCount: 0,
        error:        error.message,
      });

      throw error;
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────

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

  private async autoGenerateReport(assessmentId: string, userId?: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        project: { select: { id: true, name: true, baseUrl: true, environment: true } },
        summary: true,
        findings: {
          orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
          include: { endpoint: { select: { path: true, method: true } } },
        },
      },
    });
    if (!assessment) return;

    const content = await this.reportGenerator.generatePdf(assessment, 'TECHNICAL');
    const projectName = (assessment.project as any).name ?? 'report';
    const ts = new Date().toISOString().split('T')[0];

    await this.reportsService.createRecord({
      assessmentId,
      type:     'TECHNICAL',
      format:   'PDF',
      title:    `Automatic security report — ${projectName} — ${ts}`,
      fileSize: content.length,
    });
  }

  private calculateSummary(findings: any[], _totalEndpoints: number) {
    const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
    const high     = findings.filter((f) => f.severity === 'HIGH').length;
    const medium   = findings.filter((f) => f.severity === 'MEDIUM').length;
    const low      = findings.filter((f) => f.severity === 'LOW').length;
    const info     = findings.filter((f) => f.severity === 'INFO').length;

    let score = 100;
    score -= critical * 20;
    score -= high     * 10;
    score -= medium   *  5;
    score -= low      *  2;
    score = Math.max(0, Math.min(100, score));

    let riskLevel = 'LOW';
    if (critical > 0)               riskLevel = 'CRITICAL';
    else if (high > 2)              riskLevel = 'HIGH';
    else if (high > 0 || medium > 3) riskLevel = 'HIGH';
    else if (medium > 0 || low > 5) riskLevel = 'MEDIUM';

    const owaspCoverage: Record<string, number> = {};
    for (const f of findings) {
      owaspCoverage[f.owaspCategory] = (owaspCoverage[f.owaspCategory] || 0) + 1;
    }

    return { critical, high, medium, low, info, score, riskLevel, owaspCoverage };
  }
}
