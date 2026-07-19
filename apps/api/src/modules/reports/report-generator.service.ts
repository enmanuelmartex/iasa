import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

type ReportType = 'TECHNICAL' | 'EXECUTIVE' | 'DEVELOPER' | 'COMPLIANCE';

const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4,
};
const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e', INFO: '#6b7280',
};

@Injectable()
export class ReportGeneratorService {
  constructor(private prisma: PrismaService) {}

  async getAssessmentData(assessmentId: string, userId: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { id: assessmentId, project: { userId } },
      include: {
        project: { select: { id: true, name: true, baseUrl: true, environment: true } },
        summary: true,
        findings: {
          orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
          include: { endpoint: { select: { path: true, method: true } } },
        },
      },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');
    return assessment;
  }

  generateJson(assessment: any): string {
    const output = {
      meta: {
        tool: 'IASA — Intelligent API Security Assessment',
        version: '0.1.0',
        generatedAt: new Date().toISOString(),
        assessmentId: assessment.id,
      },
      project: assessment.project,
      assessment: {
        id: assessment.id,
        status: assessment.status,
        startedAt: assessment.startedAt,
        completedAt: assessment.completedAt,
        duration: assessment.duration,
      },
      summary: assessment.summary,
      findings: assessment.findings.map((f: any) => ({
        id: f.id,
        title: f.title,
        severity: f.severity,
        cvssScore: f.cvssScore,
        cvssVector: f.cvssVector,
        owaspCategory: f.owaspCategory,
        cweId: f.cweId,
        category: f.category,
        affectedUrl: f.affectedUrl,
        description: f.description,
        impact: f.impact,
        remediation: f.remediation,
        references: f.references,
        aiAnalysis: f.aiAnalysis,
        status: f.status,
      })),
    };
    return JSON.stringify(output, null, 2);
  }

  generateMarkdown(assessment: any): string {
    const { project, summary, findings } = assessment;
    const date = new Date().toISOString().split('T')[0];
    const lines: string[] = [];

    lines.push(`# Security Assessment Report`);
    lines.push(`**Project:** ${project.name}  `);
    lines.push(`**URL:** ${project.baseUrl}  `);
    lines.push(`**Date:** ${date}  `);
    lines.push(`**Security Score:** ${summary?.securityScore ?? 'N/A'}/100  `);
    lines.push(`**Risk Level:** ${summary?.riskLevel ?? 'N/A'}  `);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push('| Severity | Count |');
    lines.push('|----------|-------|');
    lines.push(`| Critical | ${summary?.criticalCount ?? 0} |`);
    lines.push(`| High     | ${summary?.highCount ?? 0} |`);
    lines.push(`| Medium   | ${summary?.mediumCount ?? 0} |`);
    lines.push(`| Low      | ${summary?.lowCount ?? 0} |`);
    lines.push(`| Info     | ${summary?.infoCount ?? 0} |`);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Findings');
    lines.push('');

    const sorted = [...findings].sort(
      (a: any, b: any) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
    );

    for (const f of sorted) {
      lines.push(`### [${f.severity}] ${f.title}`);
      lines.push('');
      if (f.owaspCategory) lines.push(`**OWASP:** ${f.owaspCategory}  `);
      if (f.cvssScore) lines.push(`**CVSS:** ${f.cvssScore}  `);
      if (f.affectedUrl) lines.push(`**Affected URL:** \`${f.affectedUrl}\`  `);
      lines.push('');
      lines.push('**Description**');
      lines.push('');
      lines.push(f.description ?? '');
      lines.push('');
      if (f.impact) {
        lines.push('**Impact**');
        lines.push('');
        lines.push(f.impact);
        lines.push('');
      }
      if (f.remediation) {
        lines.push('**Remediation**');
        lines.push('');
        lines.push(f.remediation);
        lines.push('');
      }
      if (f.references?.length) {
        lines.push('**References**');
        lines.push('');
        for (const ref of f.references) lines.push(`- ${ref}`);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }

  generateSarif(assessment: any): string {
    const { project, findings } = assessment;
    const rules: Record<string, any> = {};

    for (const f of findings) {
      const ruleId = f.pluginId ?? f.owaspCategory ?? 'unknown';
      if (!rules[ruleId]) {
        rules[ruleId] = {
          id: ruleId,
          name: f.title,
          shortDescription: { text: f.title },
          fullDescription: { text: f.description ?? f.title },
          helpUri: f.references?.[0] ?? 'https://owasp.org/API-Security/',
          properties: {
            tags: [f.owaspCategory ?? 'security'],
            'security-severity': String(f.cvssScore ?? this.severityToCvss(f.severity)),
          },
        };
      }
    }

    const results = findings.map((f: any) => ({
      ruleId: f.pluginId ?? f.owaspCategory ?? 'unknown',
      level: this.severityToSarifLevel(f.severity),
      message: { text: f.description ?? f.title },
      locations: f.affectedUrl
        ? [{ physicalLocation: { artifactLocation: { uri: f.affectedUrl } } }]
        : [],
      properties: {
        cvssScore: f.cvssScore,
        cvssVector: f.cvssVector,
        cweId: f.cweId,
        owaspCategory: f.owaspCategory,
        severity: f.severity,
        remediation: f.remediation,
      },
    }));

    const sarif = {
      $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
      version: '2.1.0',
      runs: [
        {
          tool: {
            driver: {
              name: 'IASA',
              version: '0.1.0',
              informationUri: 'https://github.com/your-org/iasa',
              rules: Object.values(rules),
            },
          },
          automationDetails: {
            id: assessment.id,
            description: { text: `Security assessment of ${project.name}` },
          },
          results,
        },
      ],
    };

    return JSON.stringify(sarif, null, 2);
  }

  generateHtml(assessment: any, type: ReportType): string {
    const { project, summary, findings } = assessment;
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const score = summary?.securityScore ?? 100;
    const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444';

    const sorted = [...findings].sort(
      (a: any, b: any) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9),
    );

    const findingRows = sorted.map((f: any) => {
      const color = SEVERITY_COLOR[f.severity] ?? '#6b7280';
      return `
      <div class="finding">
        <div class="finding-header">
          <span class="badge" style="background:${color}20;color:${color};border:1px solid ${color}40">${f.severity}</span>
          <span class="finding-title">${esc(f.title)}</span>
          ${f.cvssScore ? `<span class="cvss">CVSS ${f.cvssScore}</span>` : ''}
        </div>
        ${f.owaspCategory ? `<div class="meta">OWASP: <strong>${esc(f.owaspCategory)}</strong>${f.cweId ? ` &nbsp;|&nbsp; CWE: <strong>${esc(f.cweId)}</strong>` : ''}</div>` : ''}
        ${f.affectedUrl ? `<div class="meta">URL: <code>${esc(f.affectedUrl)}</code></div>` : ''}
        <div class="section-label">Description</div>
        <div class="text">${esc(f.description ?? '')}</div>
        ${f.impact ? `<div class="section-label">Impact</div><div class="text">${esc(f.impact)}</div>` : ''}
        ${f.remediation ? `<div class="section-label">Remediation</div><div class="text remediation">${esc(f.remediation)}</div>` : ''}
        ${f.aiAnalysis ? `<div class="section-label">AI security enrichment</div><div class="text ai-box">${f.aiAnalysis.technicalAnalysis ? `<strong>Technical analysis:</strong> ${esc(f.aiAnalysis.technicalAnalysis)}<br>` : ''}${f.aiAnalysis.businessImpact ? `<strong>Business impact:</strong> ${esc(f.aiAnalysis.businessImpact)}<br>` : ''}${Array.isArray(f.aiAnalysis.securityBestPractices) ? `<strong>Best practices:</strong><ul>${f.aiAnalysis.securityBestPractices.map((item: string) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${Array.isArray(f.aiAnalysis.validationSteps) ? `<strong>Validation:</strong><ul>${f.aiAnalysis.validationSteps.map((item: string) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</div>` : ''}
        ${f.references?.length ? `<div class="section-label">References</div><ul class="refs">${f.references.map((r: string) => `<li><a href="${esc(r)}">${esc(r)}</a></li>`).join('')}</ul>` : ''}
      </div>`;
    }).join('');

    const owaspRows = this.buildOwaspTable(findings);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Security Report — ${esc(project.name)}</title>
<style>
  @media print {
    body { margin: 0; }
    .no-print { display: none !important; }
    .finding { page-break-inside: avoid; }
    .page-break { page-break-before: always; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #1e293b; background: #fff; line-height: 1.6; }
  .container { max-width: 960px; margin: 0 auto; padding: 32px 24px; }
  /* Header */
  .report-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; margin-bottom: 32px; }
  .report-header h1 { font-size: 22px; font-weight: 700; color: #0f172a; }
  .report-header p { color: #64748b; font-size: 12px; margin-top: 4px; }
  .score-circle { width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${scoreColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
  .score-num { font-size: 22px; font-weight: 800; color: ${scoreColor}; line-height: 1; }
  .score-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
  /* Summary cards */
  .summary-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 32px; }
  .sev-card { text-align: center; padding: 16px 8px; border-radius: 8px; border: 1px solid; }
  .sev-card .num { font-size: 28px; font-weight: 800; }
  .sev-card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  /* OWASP table */
  .owasp-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: 12px; }
  .owasp-table th { background: #f8fafc; padding: 8px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; font-weight: 600; }
  .owasp-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
  .owasp-table tr:hover td { background: #f8fafc; }
  /* Findings */
  .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
  .finding { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #fafafa; }
  .finding-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
  .finding-title { font-weight: 600; font-size: 14px; flex: 1; color: #0f172a; }
  .badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  .cvss { font-size: 11px; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
  .meta { font-size: 11px; color: #64748b; margin-bottom: 6px; }
  .meta code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
  .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-top: 10px; margin-bottom: 4px; }
  .text { font-size: 12px; color: #475569; }
  .remediation { color: #166534; background: #f0fdf4; padding: 8px; border-radius: 6px; border-left: 3px solid #22c55e; }
  .ai-box { background: #eff6ff; border-left: 3px solid #3b82f6; padding: 8px; border-radius: 6px; }
  .ai-box ul { padding-left: 18px; margin: 4px 0 8px; }
  .refs { padding-left: 16px; font-size: 11px; color: #64748b; }
  .refs a { color: #6366f1; }
  /* Print button */
  .no-print { position: fixed; top: 16px; right: 16px; background: #6366f1; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px; box-shadow: 0 2px 8px rgba(99,102,241,.3); }
  .no-print:hover { background: #4f46e5; }
  /* Footer */
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()">⬇ Save as PDF (Ctrl+P)</button>
<div class="container">
  <div class="report-header">
    <div>
      <h1>Security Assessment Report</h1>
      <p>${esc(project.name)} &nbsp;·&nbsp; ${esc(project.baseUrl ?? '')} &nbsp;·&nbsp; ${date}</p>
      <p style="margin-top:6px">Report type: <strong>${type}</strong> &nbsp;·&nbsp; Risk: <strong style="color:${scoreColor}">${summary?.riskLevel ?? 'N/A'}</strong></p>
    </div>
    <div class="score-circle">
      <span class="score-num">${score}</span>
      <span class="score-label">Score</span>
    </div>
  </div>

  <div class="summary-grid">
    ${this.sevCard('CRITICAL', summary?.criticalCount ?? 0)}
    ${this.sevCard('HIGH', summary?.highCount ?? 0)}
    ${this.sevCard('MEDIUM', summary?.mediumCount ?? 0)}
    ${this.sevCard('LOW', summary?.lowCount ?? 0)}
    ${this.sevCard('INFO', summary?.infoCount ?? 0)}
  </div>

  ${owaspRows ? `
  <h2 class="section-title">OWASP API Top 10 Coverage</h2>
  <table class="owasp-table">
    <thead><tr><th>Category</th><th>Findings</th></tr></thead>
    <tbody>${owaspRows}</tbody>
  </table>
  ` : ''}

  <h2 class="section-title">Findings (${findings.length} total)</h2>
  ${findingRows || '<p style="color:#94a3b8;text-align:center;padding:24px">No findings detected.</p>'}

  <div class="footer">
    Generated by <strong>IASA</strong> — Intelligent API Security Assessment &nbsp;·&nbsp; ${new Date().toISOString()}
  </div>
</div>
</body>
</html>`;
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  async generatePdf(assessment: any, type: ReportType): Promise<Buffer> {
    const browser = await puppeteer.launch({
      executablePath: this.findBrowserExecutable(),
      headless: true,
      args: process.env.CHROMIUM_DISABLE_SANDBOX === 'true'
        ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        : ['--disable-dev-shm-usage'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(this.generateHtml(assessment, type), { waitUntil: 'domcontentloaded' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '14mm', right: '12mm', bottom: '14mm', left: '12mm' } });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private findBrowserExecutable(): string {
    const candidates = [process.env.CHROMIUM_EXECUTABLE_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].filter(Boolean) as string[];
    const executable = candidates.find((candidate) => existsSync(candidate));
    if (!executable) throw new Error('PDF generation requires Chromium. Set CHROMIUM_EXECUTABLE_PATH.');
    return executable;
  }

  private sevCard(severity: string, count: number): string {
    const color = SEVERITY_COLOR[severity] ?? '#6b7280';
    return `<div class="sev-card" style="border-color:${color}30;background:${color}08">
      <div class="num" style="color:${color}">${count}</div>
      <div class="label" style="color:${color}">${severity}</div>
    </div>`;
  }

  private buildOwaspTable(findings: any[]): string {
    const map: Record<string, number> = {};
    for (const f of findings) {
      if (f.owaspCategory) map[f.owaspCategory] = (map[f.owaspCategory] || 0) + 1;
    }
    if (!Object.keys(map).length) return '';
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, cnt]) => `<tr><td>${esc(cat)}</td><td>${cnt}</td></tr>`)
      .join('');
  }

  private severityToCvss(severity: string): number {
    return { CRITICAL: 9.5, HIGH: 7.5, MEDIUM: 5.0, LOW: 3.0, INFO: 0.0 }[severity] ?? 0;
  }

  private severityToSarifLevel(severity: string): string {
    return { CRITICAL: 'error', HIGH: 'error', MEDIUM: 'warning', LOW: 'note', INFO: 'none' }[severity] ?? 'none';
  }
}

function esc(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
