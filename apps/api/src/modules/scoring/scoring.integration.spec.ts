import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import type { PrismaClient } from '@prisma/client';
import { ScoringService } from './scoring.service';
import { ComparisonService } from './comparison.service';
import { IssueLifecycleService } from '../issues/issue-lifecycle.service';
import type { ScanFinding } from '../scanner/types/scanner.types';
import {
  resetTestDatabase,
  seedProjectAndAssessment,
  setupTestDatabase,
  teardownTestDatabase,
} from '../../test/db';

let prisma: PrismaClient;
let scoring: ScoringService;
let comparison: ComparisonService;
let lifecycle: IssueLifecycleService;

const PROJECT_ID = 'score-project';
const USER_ID = `user-${PROJECT_ID}`;
const SCAN_A = 'scan-a';
const SCAN_B = 'scan-b';

function finding(overrides: Partial<ScanFinding> = {}): ScanFinding {
  return {
    title: 'Missing HSTS',
    category: 'Security Misconfiguration',
    severity: 'HIGH',
    owaspCategory: 'API8:2023',
    pluginId: 'security-headers',
    ruleId: 'headers.missing-hsts',
    component: 'response-header:strict-transport-security',
    route: '/users/{id}',
    method: 'GET',
    description: 'HSTS header is missing.',
    ...overrides,
  } as ScanFinding;
}

async function runScan(
  assessmentId: string,
  findings: ScanFinding[],
  coverage: Partial<{
    plannedChecks: number;
    successfulChecks: number;
    failedChecks: number;
    skippedChecks: number;
    executionErrors: number;
  }> = {},
  scope: Partial<{ successfulPlugins: string[]; failedPlugins: string[]; skippedPlugins: string[] }> = {},
  status: any = 'COMPLETED',
) {
  const cov = {
    plannedChecks: 1,
    successfulChecks: 1,
    failedChecks: 0,
    skippedChecks: 0,
    executionErrors: 0,
    ...coverage,
  };

  await lifecycle.persistScanResults({
    projectId: PROJECT_ID,
    assessmentId,
    findings,
    detectedAt: new Date('2026-07-19T10:00:00Z'),
    scope: {
      successfulPlugins: ['security-headers'],
      failedPlugins: [],
      skippedPlugins: [],
      pluginVersions: { 'security-headers': '1.0.0' },
      ...scope,
    },
  });

  await prisma.assessmentSummary.upsert({
    where: { assessmentId },
    update: {
      ...cov,
      pluginResults: {
        executed: [...(scope.successfulPlugins ?? ['security-headers']), ...(scope.failedPlugins ?? [])],
        failed: scope.failedPlugins ?? [],
        skipped: scope.skippedPlugins ?? [],
      } as any,
    },
    create: {
      assessmentId,
      ...cov,
      pluginResults: {
        executed: [...(scope.successfulPlugins ?? ['security-headers']), ...(scope.failedPlugins ?? [])],
        failed: scope.failedPlugins ?? [],
        skipped: scope.skippedPlugins ?? [],
      } as any,
    },
  });

  await prisma.assessment.update({ where: { id: assessmentId }, data: { status } });
  return scoring.scoreAssessment(assessmentId);
}

beforeAll(async () => {
  prisma = await setupTestDatabase();
  scoring = new ScoringService(prisma as any);
  comparison = new ComparisonService(prisma as any);
  lifecycle = new IssueLifecycleService(prisma as any);
});

afterAll(async () => {
  await teardownTestDatabase();
});

beforeEach(async () => {
  await resetTestDatabase(prisma);
  await seedProjectAndAssessment(prisma, { projectId: PROJECT_ID, assessmentId: SCAN_A });
  await prisma.assessment.create({
    data: { id: SCAN_B, projectId: PROJECT_ID, status: 'RUNNING', createdAt: new Date('2026-07-20T10:00:00Z') },
  });
});

describe('persisted score snapshot', () => {
  it('stores score, status, version, coverage and the full explanation', async () => {
    await runScan(SCAN_A, [finding()]);

    const summary = await prisma.assessmentSummary.findUniqueOrThrow({ where: { assessmentId: SCAN_A } });
    expect(summary.securityScore).toBe(80);
    expect(summary.scoreStatus).toBe('FINAL');
    expect(summary.scoreVersion).toBe('score-v1');
    expect(summary.coveragePercent).toBe(100);

    const explanation = summary.scoreExplanation as any;
    expect(explanation.rulePenalties).toHaveLength(1);
    expect(explanation.rulePenalties[0].ruleId).toBe('headers.missing-hsts');
    expect(explanation.weights.CRITICAL).toBe(40);
  });

  it('a failed scan stores a null score and clears the version', async () => {
    await runScan(SCAN_A, [finding()], {}, {}, 'FAILED');

    const summary = await prisma.assessmentSummary.findUniqueOrThrow({ where: { assessmentId: SCAN_A } });
    expect(summary.securityScore).toBeNull();
    expect(summary.scoreStatus).toBe('UNAVAILABLE');
    expect(summary.scoreVersion).toBeNull();
    expect(summary.scoreComputedAt).toBeNull();
  });

  it('recomputing is idempotent — a retry writes the same snapshot', async () => {
    await runScan(SCAN_A, [finding()]);
    const first = await prisma.assessmentSummary.findUniqueOrThrow({ where: { assessmentId: SCAN_A } });

    await scoring.scoreAssessment(SCAN_A);
    const second = await prisma.assessmentSummary.findUniqueOrThrow({ where: { assessmentId: SCAN_A } });

    expect(second.securityScore).toBe(first.securityScore);
    expect(JSON.stringify(second.scoreExplanation)).toBe(JSON.stringify(first.scoreExplanation));
  });

  it('the snapshot does not change when the issue is later re-triaged or re-severitied', async () => {
    await runScan(SCAN_A, [finding({ severity: 'HIGH' })]);
    const before = await prisma.assessmentSummary.findUniqueOrThrow({ where: { assessmentId: SCAN_A } });

    // Change everything the score might naively read from the live issue.
    await prisma.securityIssue.updateMany({
      data: { severity: 'CRITICAL', status: 'FALSE_POSITIVE', title: 'Reworded' },
    });

    const after = await prisma.assessmentSummary.findUniqueOrThrow({ where: { assessmentId: SCAN_A } });
    expect(after.securityScore).toBe(before.securityScore);
    expect((after.scoreExplanation as any).rulePenalties[0].severity).toBe('HIGH');
  });
});

describe('project posture', () => {
  it('is unavailable for a project that has never been scanned', async () => {
    const posture = await scoring.getProjectPosture(PROJECT_ID);
    expect(posture.currentSecurityScore).toBeNull();
    expect(posture.currentScoreStatus).toBe('UNAVAILABLE');
    expect(posture.reason).toContain('not been scanned');
  });

  it('prefers the most recent FINAL scan', async () => {
    await runScan(SCAN_A, [finding({ severity: 'CRITICAL' })]);
    await runScan(SCAN_B, [finding({ severity: 'LOW' })]);

    const posture = await scoring.getProjectPosture(PROJECT_ID);
    expect(posture.assessmentId).toBe(SCAN_B);
    expect(posture.currentScoreStatus).toBe('FINAL');
  });

  it('falls back to a PROVISIONAL scan and says so', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 2, successfulChecks: 1, failedChecks: 1, executionErrors: 1 });

    const posture = await scoring.getProjectPosture(PROJECT_ID);
    expect(posture.currentScoreStatus).toBe('PROVISIONAL');
    expect(posture.reason).toContain('provisional');
  });

  it('reports unavailable when no scan produced a score', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 1, successfulChecks: 0, failedChecks: 1 });
    const posture = await scoring.getProjectPosture(PROJECT_ID);
    expect(posture.currentSecurityScore).toBeNull();
  });
});

describe('comparison', () => {
  it('rejects comparing a scan with itself', async () => {
    await runScan(SCAN_A, [finding()]);
    await expect(comparison.compare(SCAN_A, USER_ID, SCAN_A)).rejects.toThrow(/cannot be compared with itself/i);
  });

  it('rejects a baseline from a different project', async () => {
    await runScan(SCAN_A, [finding()]);
    await seedProjectAndAssessment(prisma, { projectId: 'other-project', assessmentId: 'other-scan' });

    await expect(comparison.compare(SCAN_A, USER_ID, 'other-scan')).rejects.toThrow();
  });

  it('classifies new, persisting and resolved issues', async () => {
    await runScan(SCAN_A, [
      finding({ ruleId: 'headers.missing-hsts', component: 'c1' }),
      finding({ ruleId: 'headers.missing-cache-control', component: 'c2' }),
    ], { plannedChecks: 1, successfulChecks: 1 });

    await runScan(SCAN_B, [
      finding({ ruleId: 'headers.missing-hsts', component: 'c1' }),
      finding({ ruleId: 'headers.missing-x-frame-options', component: 'c3' }),
    ], { plannedChecks: 1, successfulChecks: 1 });

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);

    expect(result.changes.PERSISTING).toHaveLength(1);
    expect(result.changes.NEW).toHaveLength(1);
    expect(result.changes.RESOLVED).toHaveLength(1);
    expect(result.changes.RESOLVED[0].ruleId).toBe('headers.missing-cache-control');
  });

  it('marks an absent issue NOT_TESTED when its check failed', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 1, successfulChecks: 1 });
    await runScan(
      SCAN_B,
      [],
      { plannedChecks: 1, successfulChecks: 0, failedChecks: 1, executionErrors: 1 },
      { successfulPlugins: [], failedPlugins: ['security-headers'] },
    );

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);
    expect(result.changes.NOT_TESTED).toHaveLength(1);
    expect(result.changes.RESOLVED).toHaveLength(0);
  });

  it('marks an absent issue OUT_OF_SCOPE when its check left the scope', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 1, successfulChecks: 1 });
    await runScan(
      SCAN_B,
      [],
      { plannedChecks: 1, successfulChecks: 1 },
      { successfulPlugins: ['cors'] },
    );

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);
    expect(result.changes.OUT_OF_SCOPE).toHaveLength(1);
    expect(result.changes.RESOLVED).toHaveLength(0);
  });

  it('is NOT_COMPARABLE when one side has no score', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 1, successfulChecks: 1 });
    await runScan(SCAN_B, [], { plannedChecks: 1, successfulChecks: 0, failedChecks: 1 });

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);
    expect(result.comparability).toBe('NOT_COMPARABLE');
    expect(result.warnings.join(' ')).toContain('no computable score');
  });

  it('is PARTIALLY_COMPARABLE when the scope changed', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 1, successfulChecks: 1 });
    await runScan(
      SCAN_B,
      [finding()],
      { plannedChecks: 2, successfulChecks: 2 },
      { successfulPlugins: ['security-headers', 'cors'] },
    );

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);
    expect(result.comparability).toBe('PARTIALLY_COMPARABLE');
    expect(result.scopeChanges!.addedChecks).toContain('cors');
    expect(result.scopeChanges!.sharedChecks).toContain('security-headers');
  });

  it('is COMPARABLE when version, scope and status all match', async () => {
    await runScan(SCAN_A, [finding()], { plannedChecks: 1, successfulChecks: 1 });
    await runScan(SCAN_B, [finding()], { plannedChecks: 1, successfulChecks: 1 });

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);
    expect(result.comparability).toBe('COMPARABLE');
    expect(result.warnings).toEqual([]);
    expect(result.scoreDelta).toBe(0);
  });

  it('warns when the score rose while coverage fell', async () => {
    // 2 issues over 10 checks, then 0 issues over 2 checks: the score improves
    // only because far less of the API was examined.
    await runScan(
      SCAN_A,
      [finding({ ruleId: 'headers.missing-hsts', component: 'c1' })],
      { plannedChecks: 10, successfulChecks: 10 },
    );
    await runScan(
      SCAN_B,
      [],
      { plannedChecks: 10, successfulChecks: 2, skippedChecks: 8 },
      { successfulPlugins: ['security-headers'] },
    );

    const result = await comparison.compare(SCAN_B, USER_ID, SCAN_A);

    expect(result.scoreDelta).toBeGreaterThan(0);
    expect(result.coverageDelta).toBeLessThan(0);
    expect(result.warnings[0]).toContain('not evidence that risk decreased');
    expect(result.comparability).not.toBe('COMPARABLE');
  });

  it('returns candidates for a baseline', async () => {
    await runScan(SCAN_A, [finding()]);
    await runScan(SCAN_B, [finding()]);

    const candidates = await comparison.getComparisonCandidates(SCAN_B, USER_ID);
    expect(candidates.map((c) => c.id)).toContain(SCAN_A);
    expect(candidates.map((c) => c.id)).not.toContain(SCAN_B);
  });
});
