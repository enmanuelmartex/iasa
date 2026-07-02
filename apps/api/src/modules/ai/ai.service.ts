import { Injectable, Logger } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { AiConfigService } from './ai-config.service';
import type {
  IAiProvider,
  AiAnalysisMeta,
  AiProviderStatus,
} from './interfaces/ai-provider.interface';
import type { ScanFinding, ScanContext } from '../scanner/types/scanner.types';

const BATCH_SIZE = 5;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly factory: AiProviderFactory,
    private readonly aiConfigService: AiConfigService,
  ) {}

  // ── Public API ────────────────────────────────────────────────────────────

  /** Enrich findings with AI analysis. Never throws — returns meta on any failure. */
  async analyzeFindings(
    findings: ScanFinding[],
    context: ScanContext,
  ): Promise<AiAnalysisMeta> {
    const startTime = Date.now();
    const provider  = await this.factory.getProvider();

    if (!provider.isAvailable()) {
      const status = provider.getStatus();
      return this.buildMeta(status.provider, status.model, false, 0, findings.length, startTime, 0, status.reason);
    }

    const config = await this.aiConfigService.getEffectiveConfig();
    const candidates = this.selectCandidates(findings, config);
    let totalTokens = 0;
    let analyzed    = 0;

    // ── Batch analysis ───────────────────────────────────────────────────────
    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
      const batch = candidates.slice(i, i + BATCH_SIZE);
      try {
        const tokens = await this.analyzeBatch(provider, batch, config);
        totalTokens += tokens;
        analyzed += batch.length;
      } catch (error: any) {
        this.logger.warn(`AI batch failed (findings ${i}–${i + batch.length}): ${error?.message}`);
      }
    }

    // ── Executive summary ────────────────────────────────────────────────────
    if (config.executiveSummary && findings.length > 0) {
      try {
        const { summary, tokens } = await this.generateExecutiveSummary(provider, findings, context, config);
        totalTokens += tokens;
        findings.forEach((f) => {
          f.aiAnalysis = f.aiAnalysis ?? {};
          f.aiAnalysis.executiveSummary = summary;
        });
      } catch (error: any) {
        this.logger.warn(`Executive summary failed: ${error?.message}`);
      }
    }

    return this.buildMeta(
      provider.providerName, provider.model, true, analyzed,
      findings.length - analyzed, startTime, totalTokens,
    );
  }

  async getProviderStatus(): Promise<AiProviderStatus> {
    return this.factory.getProviderStatus();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private selectCandidates(findings: ScanFinding[], config: any): ScanFinding[] {
    return findings
      .filter((f) => {
        if (f.severity === 'CRITICAL') return config.analyzeCritical;
        if (f.severity === 'HIGH')     return config.analyzeHigh;
        if (f.severity === 'MEDIUM')   return config.analyzeMedium;
        if (f.severity === 'LOW')      return config.analyzeLow;
        return false;
      })
      .slice(0, config.maxFindings);
  }

  private async analyzeBatch(
    provider: IAiProvider,
    findings: ScanFinding[],
    config: any,
  ): Promise<number> {
    const findingsText = findings.map((f, i) =>
      `\nFinding ${i + 1}:\n- Title: ${f.title}\n- Severity: ${f.severity}\n- OWASP: ${f.owaspCategory}\n- URL: ${f.affectedUrl || 'N/A'}\n- Description: ${f.description.substring(0, 400)}`,
    ).join('');

    const response = await provider.complete({
      systemPrompt: 'You are a senior API security expert. Return ONLY valid JSON — no markdown, no explanation.',
      userPrompt: `Analyze these ${findings.length} API security finding(s) and return a JSON array with exactly ${findings.length} object(s):

${findingsText}

Each object must have:
{
  "executiveSummary": "2-3 sentence non-technical explanation for management",
  "technicalAnalysis": "Technical root cause (2-3 sentences)",
  "businessImpact": "Business risk and consequences",
  "confidence": "HIGH|MEDIUM|LOW",
  "falsePositiveRisk": "HIGH|MEDIUM|LOW",
  "codeExamples": { "vulnerable": "brief vulnerable code", "fixed": "brief secure code" }
}`,
      maxTokens:   config.maxTokens,
      temperature: config.temperature,
      jsonMode:    true,
    });

    const parsed = this.parseJsonSafely(response.content);
    const arr = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
    findings.forEach((f, i) => {
      if (arr[i]) f.aiAnalysis = { ...(f.aiAnalysis ?? {}), ...arr[i] };
    });

    return response.tokensUsed ?? 0;
  }

  private async generateExecutiveSummary(
    provider: IAiProvider,
    findings: ScanFinding[],
    context: ScanContext,
    config: any,
  ): Promise<{ summary: string; tokens: number }> {
    const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
    const high     = findings.filter((f) => f.severity === 'HIGH').length;
    const medium   = findings.filter((f) => f.severity === 'MEDIUM').length;
    const low      = findings.filter((f) => f.severity === 'LOW').length;
    const owasp    = [...new Set(findings.map((f) => f.owaspCategory))].join(', ');

    const response = await provider.complete({
      systemPrompt: 'You are a CISO-level security expert. Be concise and professional.',
      userPrompt: `Write a 3-4 sentence executive summary of an API security assessment.

Results:
- API: ${context.baseUrl}
- Total: ${findings.length} findings (${critical} Critical, ${high} High, ${medium} Medium, ${low} Low)
- OWASP categories: ${owasp}
- Endpoints tested: ${context.endpoints.length}

Write a professional summary for a CISO. Be direct about risk level and business impact.`,
      maxTokens:   Math.min(config.maxTokens, 400),
      temperature: config.temperature,
    });

    return { summary: response.content, tokens: response.tokensUsed ?? 0 };
  }

  private parseJsonSafely(content: string): any {
    if (!content) return null;
    try { return JSON.parse(content); } catch {}
    const fenceMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenceMatch) { try { return JSON.parse(fenceMatch[1]); } catch {} }
    const arrayMatch = content.match(/\[[\s\S]*\]/);
    if (arrayMatch) { try { return JSON.parse(arrayMatch[0]); } catch {} }
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) { try { return JSON.parse(objectMatch[0]); } catch {} }
    this.logger.warn('Could not parse AI response as JSON');
    return null;
  }

  private buildMeta(
    provider: string, model: string, available: boolean,
    analyzed: number, skipped: number, startTime: number,
    tokensUsed: number, reason?: string,
  ): AiAnalysisMeta {
    return { provider, model, available, analyzed, skipped, durationMs: Date.now() - startTime, tokensUsed, reason };
  }
}
