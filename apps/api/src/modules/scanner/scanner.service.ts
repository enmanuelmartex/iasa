import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScanContext, ScanFinding, PluginResult } from './types/scanner.types';
import { BrokenAuthPlugin } from './plugins/authentication/broken-auth.plugin';
import { BolaPlugin } from './plugins/authorization/bola.plugin';
import { BflaPlugin } from './plugins/authorization/bfla.plugin';
import { JwtAnalysisPlugin } from './plugins/jwt/jwt-analysis.plugin';
import { RateLimitPlugin } from './plugins/rate-limit/rate-limit.plugin';
import { CorsPlugin } from './plugins/cors/cors.plugin';
import { SecurityHeadersPlugin } from './plugins/headers/security-headers.plugin';
import { SensitiveDataPlugin } from './plugins/sensitive-data/sensitive-data.plugin';
import { MassAssignmentPlugin } from './plugins/mass-assignment/mass-assignment.plugin';
import { SsrfPlugin } from './plugins/ssrf/ssrf.plugin';
import { AiAnalysisService } from './plugins/ai-analysis/ai-analysis.service';

type ProgressCallback = (progress: any) => void;
type LogCallback = (entry: { level: string; plugin: string; message: string }) => void;

@Injectable()
export class ScannerService {
  private readonly logger = new Logger(ScannerService.name);

  constructor(
    private configService: ConfigService,
    private aiAnalysisService: AiAnalysisService,
  ) {}

  async runAllPlugins(
    context: ScanContext,
    onProgress: ProgressCallback,
    onLog: LogCallback,
  ): Promise<ScanFinding[]> {
    const allFindings: ScanFinding[] = [];

    const plugins = this.buildPluginPipeline(context);
    const totalSteps = plugins.length + 2;
    let stepIndex = 2;

    for (const { plugin, enabled, name } of plugins) {
      if (!enabled) {
        onLog({ level: 'info', plugin: plugin.id, message: `Plugin ${name} disabled, skipping` });
        stepIndex++;
        continue;
      }

      const progress = Math.round((stepIndex / totalSteps) * 85) + 8;

      onProgress({
        step: name,
        stepIndex,
        totalSteps,
        progress,
        message: `Running ${name}...`,
        findingsCount: allFindings.length,
        currentPlugin: plugin.id,
        assessmentId: context.assessmentId,
      });

      onLog({ level: 'info', plugin: plugin.id, message: `Starting ${name}` });

      try {
        const result = await plugin.run(context);
        allFindings.push(...result.findings);

        onLog({
          level: 'info',
          plugin: plugin.id,
          message: `${name} completed: ${result.findings.length} findings in ${result.scanDuration}ms`,
        });

        if (result.error) {
          onLog({ level: 'warn', plugin: plugin.id, message: result.error });
        }
      } catch (error) {
        this.logger.error(`Plugin ${plugin.id} failed: ${error.message}`);
        onLog({ level: 'error', plugin: plugin.id, message: `Plugin failed: ${error.message}` });
      }

      stepIndex++;
    }

    if (context.config.enableAiAnalysis && allFindings.length > 0) {
      onProgress({
        step: 'AI Analysis',
        stepIndex: totalSteps - 1,
        totalSteps,
        progress: 88,
        message: `Running AI analysis on ${allFindings.length} findings...`,
        findingsCount: allFindings.length,
        currentPlugin: 'ai-analysis',
        assessmentId: context.assessmentId,
      });

      onLog({ level: 'info', plugin: 'ai-analysis', message: 'Starting AI-powered analysis' });

      try {
        await this.aiAnalysisService.analyzeFindings(allFindings, context);
        onLog({ level: 'info', plugin: 'ai-analysis', message: 'AI analysis completed' });
      } catch (error) {
        onLog({
          level: 'warn',
          plugin: 'ai-analysis',
          message: `AI analysis failed: ${error.message}. Continuing without AI enrichment.`,
        });
      }
    }

    return allFindings;
  }

  private buildPluginPipeline(context: ScanContext) {
    return [
      {
        plugin: new SecurityHeadersPlugin(),
        enabled: context.config.enableSecurityHeaders,
        name: 'Security Headers Analysis',
      },
      {
        plugin: new CorsPlugin(),
        enabled: context.config.enableCors,
        name: 'CORS Analysis',
      },
      {
        plugin: new BrokenAuthPlugin(),
        enabled: context.config.enableBrokenAuth,
        name: 'Broken Authentication',
      },
      {
        plugin: new JwtAnalysisPlugin(),
        enabled: context.config.enableJwtAnalysis,
        name: 'JWT Analysis',
      },
      {
        plugin: new BolaPlugin(),
        enabled: context.config.enableBola,
        name: 'Broken Object Level Authorization',
      },
      {
        plugin: new BflaPlugin(),
        enabled: context.config.enableBfla,
        name: 'Broken Function Level Authorization',
      },
      {
        plugin: new MassAssignmentPlugin(),
        enabled: context.config.enableMassAssignment,
        name: 'Mass Assignment',
      },
      {
        plugin: new RateLimitPlugin(),
        enabled: context.config.enableRateLimit,
        name: 'Rate Limiting',
      },
      {
        plugin: new SensitiveDataPlugin(),
        enabled: context.config.enableSensitiveData,
        name: 'Sensitive Data Exposure',
      },
      {
        plugin: new SsrfPlugin(),
        enabled: context.config.enableSsrf,
        name: 'Server-Side Request Forgery',
      },
    ];
  }
}
