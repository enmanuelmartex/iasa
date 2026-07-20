import type { Severity } from '@prisma/client';

/**
 * score-v1 — the single scoring formula.
 *
 * Pure and deterministic: same input, same output, no clock, no database, no
 * current issue state. Everything that persists or reads a score goes through
 * here; no controller, report service, processor or frontend mapper may
 * implement its own arithmetic.
 *
 * ── A note on `exposureMultiplier` ───────────────────────────────────────────
 *
 * The specified formula is
 *
 *     exposureMultiplier = min(2.0, 1 + 0.25 × log2(max(1, distinctAffectedComponents)))
 *     issuePenalty       = severityWeight × exposureMultiplier
 *
 * with a component defined as METHOD + normalizedRoute + component.
 *
 * Applied per FINGERPRINT this multiplier is inert. A fingerprint already
 * contains METHOD, normalizedRoute and component, so one fingerprint has
 * exactly one affected component and the multiplier is always 1.0.
 *
 * It only carries meaning when penalties are grouped per RULE
 * (pluginId + ruleId): "missing HSTS affects 12 endpoints" is genuinely worse
 * than "missing HSTS affects 1", and that breadth is what the multiplier
 * expresses. Grouping per rule also preserves discrimination — penalising each
 * fingerprint separately drives the score to 0 at four critical endpoints,
 * which is the immediate-saturation failure the scoring brief explicitly ruled
 * out.
 *
 * So: deduplicate by fingerprint (an issue detected many times is one issue),
 * then apply one exposure-scaled penalty per rule.
 */

export const SCORE_VERSION = 'score-v1';

/** Penalty weights by severity. INFO is deliberately 0: informational is not risk. */
export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  CRITICAL: 40,
  HIGH: 20,
  MEDIUM: 8,
  LOW: 2,
  INFO: 0,
};

export const MAX_EXPOSURE_MULTIPLIER = 2.0;
export const MAX_TOTAL_PENALTY = 100;

export type ScoreStatus = 'UNAVAILABLE' | 'PROVISIONAL' | 'FINAL';

/** One deduplicated issue as observed by the assessment being scored. */
export interface ScorableIssue {
  fingerprint: string;
  pluginId: string;
  ruleId: string;
  /** Severity AT SCAN TIME, from the occurrence snapshot — never the issue's current value. */
  severity: Severity;
  method: string;
  normalizedRoute: string;
  component: string;
}

export interface CoverageInput {
  plannedChecks: number;
  successfulChecks: number;
  failedChecks: number;
  skippedChecks: number;
  executionErrors: number;
}

export interface ScoreInput {
  /** Terminal state of the assessment. Non-terminal states cannot be scored. */
  assessmentStatus: string;
  issues: ScorableIssue[];
  coverage: CoverageInput;
}

/** Per-rule contribution, retained so a score can be explained line by line. */
export interface RulePenalty {
  pluginId: string;
  ruleId: string;
  severity: Severity;
  severityWeight: number;
  /** Distinct METHOD + normalizedRoute + component triples this rule affects. */
  distinctAffectedComponents: number;
  affectedComponents: string[];
  exposureMultiplier: number;
  penalty: number;
  fingerprints: string[];
}

export interface ScoreResult {
  scoreVersion: string;
  securityScore: number | null;
  scoreStatus: ScoreStatus;
  coveragePercent: number | null;
  totalPenalty: number;
  /** Penalty before the 100-point cap, so saturation is visible. */
  uncappedPenalty: number;
  severityBreakdown: Record<Severity, number>;
  rulePenalties: RulePenalty[];
  /** Why the score is PROVISIONAL or UNAVAILABLE. Empty for FINAL. */
  reasons: string[];
  weights: Record<Severity, number>;
  issuesConsidered: number;
  coverage: CoverageInput;
}

/** Assessment states that can never carry a score. */
const UNSCORABLE_STATUSES = new Set(['PENDING', 'QUEUED', 'RUNNING', 'FAILED', 'CANCELLED']);

/**
 * The identity of an affected component within a rule.
 * Documented contract: METHOD + normalizedRoute + component.
 */
export function componentKey(issue: ScorableIssue): string {
  return `${issue.method} ${issue.normalizedRoute} [${issue.component}]`;
}

export function exposureMultiplier(distinctAffectedComponents: number): number {
  const n = Math.max(1, distinctAffectedComponents);
  return Math.min(MAX_EXPOSURE_MULTIPLIER, 1 + 0.25 * Math.log2(n));
}

/**
 * Computes the score, its status, its coverage and a full explanation.
 *
 * Never returns a fabricated value: when a score cannot be computed the score
 * is `null` and the reasons say why. A real score of 0 is preserved as 0 — the
 * caller must distinguish "no data" from "worst possible posture", which is
 * exactly what `|| 100` and `|| 0` fallbacks destroyed in the previous code.
 */
export function computeScore(input: ScoreInput): ScoreResult {
  const { assessmentStatus, issues, coverage } = input;
  const reasons: string[] = [];

  const coveragePercent =
    coverage.plannedChecks > 0
      ? Math.round((coverage.successfulChecks / coverage.plannedChecks) * 1000) / 10
      : null; // Zero planned checks means unknown coverage, never 100%.

  const base = {
    scoreVersion: SCORE_VERSION,
    weights: SEVERITY_WEIGHTS,
    coverage,
    coveragePercent,
  };

  // ── Can this assessment be scored at all? ─────────────────────────────────

  if (UNSCORABLE_STATUSES.has(assessmentStatus)) {
    reasons.push(
      assessmentStatus === 'FAILED' || assessmentStatus === 'CANCELLED'
        ? `The scan ended as ${assessmentStatus}, so its results do not describe the API's security posture.`
        : `The scan is ${assessmentStatus} and has not produced results yet.`,
    );
    return unavailable(base, reasons, issues.length);
  }

  if (coverage.successfulChecks <= 0) {
    reasons.push(
      'No security check completed successfully, so there is nothing to base a score on.',
    );
    return unavailable(base, reasons, issues.length);
  }

  if (coverage.plannedChecks <= 0) {
    reasons.push('No checks were planned for this scan, so coverage is unknown.');
    return unavailable(base, reasons, issues.length);
  }

  // ── Penalties, grouped per rule (see the note at the top of this file) ─────

  const deduplicated = dedupeByFingerprint(issues);
  const rulePenalties = buildRulePenalties(deduplicated);

  const uncappedPenalty = round2(rulePenalties.reduce((sum, rule) => sum + rule.penalty, 0));
  const totalPenalty = Math.min(MAX_TOTAL_PENALTY, uncappedPenalty);
  const securityScore = Math.round(Math.max(0, 100 - totalPenalty));

  // ── Is the result complete enough to be called final? ─────────────────────

  if (coverage.failedChecks > 0) {
    reasons.push(
      `${coverage.failedChecks} check(s) failed during this scan, so parts of the API were not evaluated.`,
    );
  }
  if (coverage.skippedChecks > 0) {
    reasons.push(
      `${coverage.skippedChecks} check(s) were not run, so this score covers only the checks that were selected.`,
    );
  }
  if (coverage.executionErrors > 0 && coverage.failedChecks === 0) {
    reasons.push(`${coverage.executionErrors} execution error(s) occurred during this scan.`);
  }

  const scoreStatus: ScoreStatus = reasons.length === 0 ? 'FINAL' : 'PROVISIONAL';

  return {
    ...base,
    securityScore,
    scoreStatus,
    totalPenalty,
    uncappedPenalty,
    severityBreakdown: severityBreakdown(deduplicated),
    rulePenalties,
    reasons,
    issuesConsidered: deduplicated.length,
  };
}

function unavailable(
  base: Pick<ScoreResult, 'scoreVersion' | 'weights' | 'coverage' | 'coveragePercent'>,
  reasons: string[],
  issuesConsidered: number,
): ScoreResult {
  return {
    ...base,
    securityScore: null,
    scoreStatus: 'UNAVAILABLE',
    totalPenalty: 0,
    uncappedPenalty: 0,
    severityBreakdown: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 },
    rulePenalties: [],
    reasons,
    issuesConsidered,
  };
}

/** An issue detected many times is still one issue. */
function dedupeByFingerprint(issues: ScorableIssue[]): ScorableIssue[] {
  const seen = new Map<string, ScorableIssue>();
  for (const issue of issues) {
    if (!seen.has(issue.fingerprint)) seen.set(issue.fingerprint, issue);
  }
  return [...seen.values()];
}

function buildRulePenalties(issues: ScorableIssue[]): RulePenalty[] {
  const groups = new Map<string, ScorableIssue[]>();
  for (const issue of issues) {
    const key = `${issue.pluginId}|${issue.ruleId}`;
    const group = groups.get(key);
    if (group) group.push(issue);
    else groups.set(key, [issue]);
  }

  const penalties: RulePenalty[] = [];

  for (const group of groups.values()) {
    // A rule can report different severities on different endpoints. Score the
    // worst one: the rule's risk is set by its most severe manifestation.
    const severity = group.reduce(
      (worst, issue) =>
        SEVERITY_WEIGHTS[issue.severity] > SEVERITY_WEIGHTS[worst] ? issue.severity : worst,
      group[0].severity,
    );

    const affectedComponents = [...new Set(group.map(componentKey))].sort();
    const multiplier = exposureMultiplier(affectedComponents.length);
    const severityWeight = SEVERITY_WEIGHTS[severity];

    penalties.push({
      pluginId: group[0].pluginId,
      ruleId: group[0].ruleId,
      severity,
      severityWeight,
      distinctAffectedComponents: affectedComponents.length,
      affectedComponents,
      exposureMultiplier: round2(multiplier),
      penalty: round2(severityWeight * multiplier),
      fingerprints: group.map((issue) => issue.fingerprint).sort(),
    });
  }

  // Deterministic order, so two runs produce byte-identical snapshots.
  return penalties.sort(
    (a, b) => b.penalty - a.penalty || a.ruleId.localeCompare(b.ruleId),
  );
}

function severityBreakdown(issues: ScorableIssue[]): Record<Severity, number> {
  const counts: Record<Severity, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };
  for (const issue of issues) counts[issue.severity] += 1;
  return counts;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
