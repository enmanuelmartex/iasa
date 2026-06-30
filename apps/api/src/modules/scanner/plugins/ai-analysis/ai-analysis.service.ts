import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ScanFinding, ScanContext } from '../../types/scanner.types';

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private client: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async analyzeFindings(findings: ScanFinding[], context: ScanContext): Promise<void> {
    if (!this.client) {
      this.logger.warn('OpenAI not configured — skipping AI analysis');
      return;
    }

    const criticalAndHigh = findings.filter(
      (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH',
    );

    for (const finding of criticalAndHigh.slice(0, 10)) {
      try {
        const analysis = await this.analyzeSingleFinding(finding);
        Object.assign(finding, { aiAnalysis: analysis });
      } catch (error) {
        this.logger.warn(`AI analysis failed for finding ${finding.title}: ${error.message}`);
      }
    }

    if (findings.length > 0) {
      try {
        const summary = await this.generateExecutiveSummary(findings, context);
        findings.forEach((f) => {
          if (!f.aiAnalysis) {
            f.aiAnalysis = { executiveSummary: summary };
          } else {
            f.aiAnalysis.executiveSummary = summary;
          }
        });
      } catch (error) {
        this.logger.warn(`Failed to generate executive summary: ${error.message}`);
      }
    }
  }

  private async analyzeSingleFinding(finding: ScanFinding): Promise<any> {
    const prompt = `You are a senior API security expert analyzing a vulnerability finding.

Finding:
- Title: ${finding.title}
- Severity: ${finding.severity}
- OWASP Category: ${finding.owaspCategory}
- Affected URL: ${finding.affectedUrl || 'N/A'}
- Description: ${finding.description}
- Evidence: ${JSON.stringify(finding.evidence || {}).substring(0, 500)}

Provide a concise security analysis in JSON format:
{
  "executiveSummary": "2-3 sentence non-technical explanation for management",
  "technicalAnalysis": "Technical root cause explanation (2-3 sentences)",
  "businessImpact": "Business risk and potential consequences",
  "confidence": "HIGH|MEDIUM|LOW",
  "falsePositiveRisk": "HIGH|MEDIUM|LOW",
  "codeExamples": {
    "vulnerable": "Brief vulnerable code snippet",
    "fixed": "Brief secure code snippet"
  }
}

Be concise and practical. Focus on actionable insights.`;

    const response = await this.client!.chat.completions.create({
      model: this.configService.get<string>('openai.model', 'gpt-4o-mini'),
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.configService.get<number>('openai.maxTokens', 1000),
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  }

  private async generateExecutiveSummary(findings: ScanFinding[], context: ScanContext): Promise<string> {
    const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
    const high = findings.filter((f) => f.severity === 'HIGH').length;
    const owaspCategories = [...new Set(findings.map((f) => f.owaspCategory))];

    const prompt = `You are a CISO-level security expert. Write a 3-4 sentence executive summary of an API security assessment.

Assessment Results:
- API: ${context.baseUrl}
- Total Findings: ${findings.length}
- Critical: ${critical}, High: ${high}, Medium: ${findings.filter((f) => f.severity === 'MEDIUM').length}, Low: ${findings.filter((f) => f.severity === 'LOW').length}
- OWASP Categories Found: ${owaspCategories.join(', ')}
- Endpoints Tested: ${context.endpoints.length}

Write a professional executive summary suitable for a CISO or security manager. Be direct about risk level and business impact.`;

    const response = await this.client!.chat.completions.create({
      model: this.configService.get<string>('openai.model', 'gpt-4o-mini'),
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || '';
  }
}
