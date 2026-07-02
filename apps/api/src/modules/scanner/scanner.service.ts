import { Injectable, Logger } from '@nestjs/common';
import { ScanContext, ScanFinding, BasePlugin } from './types/scanner.types';
import { AiService } from '../ai/ai.service';
import type { AiAnalysisMeta } from '../ai/interfaces/ai-provider.interface';
import { PluginRegistryService } from '../plugins/plugin-registry.service';
import { PluginExecutorService } from '../plugins/plugin-executor.service';

type ProgressCallback = (progress: any) => void;
type LogCallback      = (entry: { level: string; plugin: string; message: string }) => void;

// ── Result contract ────────────────────────────────────────────────────────────

export interface PluginExecutionPlan {
  /** All plugin IDs present in the registry */
  available:      string[];
  /** Plugin IDs that actually ran this assessment */
  executed:       string[];
  /** Plugin IDs that were skipped (disabled by user or globally) */
  skipped:        string[];
  /** Why each skipped plugin was skipped */
  skippedReason:  Record<string, string>;
  /** Plugin version strings */
  versions:       Record<string, string>;
  /** Wall-clock execution time per plugin (ms) */
  durationMs:     Record<string, number>;
  /** Findings count per plugin */
  findingCounts:  Record<string, number>;
}

export interface ScanRunResult {
  findings:      ScanFinding[];
  pluginPlan:    PluginExecutionPlan;
  aiMeta:        AiAnalysisMeta;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class ScannerService {
  private readonly logger = new Logger(ScannerService.name);

  constructor(
    private readonly aiService:        AiService,
    private readonly pluginRegistry:   PluginRegistryService,
    private readonly pluginExecutor:   PluginExecutorService,
  ) {}

  async runAllPlugins(
    context:        ScanContext,
    onProgress:     ProgressCallback,
    onLog:          LogCallback,
    userId?:        string,
    pluginOverride?: BasePlugin[],
  ): Promise<ScanRunResult> {
    const allFindings: ScanFinding[] = [];

    // ── 1. Resolve which plugins should run ───────────────────────────────────
    //
    //  pluginOverride supplied  → use exactly those plugins (profile / manual mode)
    //  With user context        → respect per-user enable/disable (PluginUserConfig)
    //                             falling back to global Plugin.isEnabled
    //  Without user context     → use global Plugin.isEnabled only
    //
    const enabledPlugins: BasePlugin[] = pluginOverride?.length
      ? pluginOverride
      : userId
        ? await this.pluginRegistry.getEnabledForUser(userId)
        : await this.pluginRegistry.getEnabledGlobally();

    const allRegistered = this.pluginRegistry.getAll();

    // Build the execution plan (tracks available / executed / skipped)
    const enabledIds = new Set(enabledPlugins.map((p) => p.manifest.id));
    const plan: PluginExecutionPlan = {
      available:     allRegistered.map((p) => p.manifest.id),
      executed:      [],
      skipped:       [],
      skippedReason: {},
      versions:      Object.fromEntries(allRegistered.map((p) => [p.manifest.id, p.manifest.version])),
      durationMs:    {},
      findingCounts: {},
    };

    for (const p of allRegistered) {
      if (!enabledIds.has(p.manifest.id)) {
        plan.skipped.push(p.manifest.id);
        plan.skippedReason[p.manifest.id] = userId ? 'disabled_by_user' : 'disabled_globally';
      }
    }

    // ── 2. Log the execution plan ─────────────────────────────────────────────
    onLog({
      level: 'info',
      plugin: 'core',
      message: `Plugin execution plan: ${enabledPlugins.length} enabled, ${plan.skipped.length} skipped`,
    });

    if (plan.skipped.length > 0) {
      onLog({
        level: 'info',
        plugin: 'core',
        message: `Skipped plugins: ${plan.skipped.join(', ')}`,
      });
    }

    const totalSteps = enabledPlugins.length + 2; // +2 for init + AI
    let stepIndex = 2;

    // ── 3. Execute each enabled plugin ────────────────────────────────────────
    for (const plugin of enabledPlugins) {
      const pluginId   = plugin.manifest.id;
      const pluginName = plugin.manifest.name;
      const progress   = Math.round((stepIndex / totalSteps) * 82) + 8;

      const pluginConfig = userId
        ? await this.pluginRegistry.getPluginConfig(pluginId, userId)
        : (plugin.manifest.defaultConfig ?? {});

      onProgress({
        step:          pluginName,
        stepIndex,
        totalSteps,
        progress,
        message:       `Running ${pluginName}...`,
        findingsCount: allFindings.length,
        currentPlugin: pluginId,
        assessmentId:  context.assessmentId,
      });

      onLog({ level: 'info', plugin: pluginId, message: `Starting ${pluginName}` });

      const { findings, durationMs, status } = await this.pluginExecutor.executeInPipeline(
        plugin,
        context,
        userId ?? 'system',
        pluginConfig,
      );

      allFindings.push(...findings);
      plan.executed.push(pluginId);
      plan.durationMs[pluginId]    = durationMs;
      plan.findingCounts[pluginId] = findings.length;

      const logLevel = status === 'SUCCESS' ? 'info' : (status === 'TIMEOUT' ? 'warn' : 'error');
      onLog({
        level:   logLevel,
        plugin:  pluginId,
        message: status === 'SUCCESS'
          ? `${pluginName} completed — ${findings.length} finding(s) in ${durationMs}ms`
          : `${pluginName} ${status.toLowerCase()} after ${durationMs}ms`,
      });

      stepIndex++;
    }

    // ── 4. AI analysis (post-processor — NEVER blocks assessment completion) ──
    let aiMeta: AiAnalysisMeta = {
      provider:  'none',
      model:     'none',
      available: false,
      status:    'skipped',
      analyzed:  0,
      skipped:   allFindings.length,
      durationMs: 0,
      tokensUsed: 0,
      reason:    'AI analysis disabled for this assessment',
    };

    if (context.config.enableAiAnalysis) {
      onProgress({
        step:          'AI Analysis',
        stepIndex:     totalSteps - 1,
        totalSteps,
        progress:      92,
        message:       `AI analysis on ${allFindings.length} findings...`,
        findingsCount: allFindings.length,
        currentPlugin: 'ai-analysis',
        assessmentId:  context.assessmentId,
      });

      onLog({ level: 'info', plugin: 'ai-analysis', message: 'Starting AI-powered analysis' });

      aiMeta = await this.aiService.analyzeFindings(allFindings, context);

      if (aiMeta.available) {
        onLog({
          level:   'info',
          plugin:  'ai-analysis',
          message: `AI analysis complete — ${aiMeta.analyzed} findings enriched by ${aiMeta.provider} in ${aiMeta.durationMs}ms`,
        });
      } else {
        onLog({
          level:   'warn',
          plugin:  'ai-analysis',
          message: `AI analysis skipped: ${aiMeta.reason ?? 'provider unavailable'}`,
        });
      }
    }

    return { findings: allFindings, pluginPlan: plan, aiMeta };
  }
}
