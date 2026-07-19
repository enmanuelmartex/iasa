import type { Assessment, AssessmentStatus } from '@/types';
import { formatDuration } from '@/lib/utils';

export type AssessmentFilterState = {
  /** Matches the project name or its base URL. */
  search: string;
  statuses: AssessmentStatus[];
  /** Inclusive `yyyy-MM-dd` bounds on the start date. */
  from: string | null;
  to: string | null;
  /** Inclusive bounds in seconds. */
  durationMin: number | null;
  durationMax: number | null;
};

export type AssessmentFilterChip = {
  id: string;
  label: string;
  next: AssessmentFilterState;
};

export const EMPTY_ASSESSMENT_FILTERS: AssessmentFilterState = {
  search: '',
  statuses: [],
  from: null,
  to: null,
  durationMin: null,
  durationMax: null,
};

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  PENDING: 'Pending',
  QUEUED: 'Queued',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

const STATUS_VALUES = Object.keys(ASSESSMENT_STATUS_LABELS) as AssessmentStatus[];

/** Floor of the duration slider: large APIs can run for several minutes. */
const MIN_DURATION_BOUND = 300;

/** Highest duration in the data, rounded up, so the slider bounds fit the set. */
export function getDurationBound(assessments: Assessment[]): number {
  const max = assessments.reduce((top, item) => Math.max(top, item.duration ?? 0), 0);
  return Math.max(MIN_DURATION_BOUND, Math.ceil(max / 30) * 30);
}

export function parseAssessmentFilters(params: URLSearchParams): AssessmentFilterState {
  const raw = params.get('status');
  const selected = raw ? raw.split(',').map((value) => value.trim()) : [];
  const toNumber = (value: string | null) => {
    if (value === null) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  };
  return {
    search: params.get('q') ?? '',
    statuses: STATUS_VALUES.filter((status) => selected.includes(status)),
    from: params.get('from'),
    to: params.get('to'),
    durationMin: toNumber(params.get('dmin')),
    durationMax: toNumber(params.get('dmax')),
  };
}

export function serializeAssessmentFilters(state: AssessmentFilterState): string {
  const params = new URLSearchParams();
  if (state.search.trim()) params.set('q', state.search.trim());
  if (state.statuses.length) params.set('status', state.statuses.join(','));
  if (state.from) params.set('from', state.from);
  if (state.to) params.set('to', state.to);
  if (state.durationMin !== null) params.set('dmin', String(state.durationMin));
  if (state.durationMax !== null) params.set('dmax', String(state.durationMax));
  return params.toString();
}

export function hasActiveAssessmentFilters(state: AssessmentFilterState): boolean {
  return Boolean(
    state.search.trim() ||
      state.statuses.length ||
      state.from ||
      state.to ||
      state.durationMin !== null ||
      state.durationMax !== null,
  );
}

export function toggleFilterValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

/** Summary for the date control's trigger and its chip. */
export function describeDateRange(from: string | null, to: string | null): string | null {
  if (from && to) return `${formatDay(from)} – ${formatDay(to)}`;
  if (from) return `From ${formatDay(from)}`;
  if (to) return `Until ${formatDay(to)}`;
  return null;
}

function formatDay(value: string): string {
  // `yyyy-MM-dd` parsed as local time; `new Date(value)` would shift by timezone.
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
  });
}

export function buildAssessmentChips(state: AssessmentFilterState): AssessmentFilterChip[] {
  const chips: AssessmentFilterChip[] = [];

  if (state.search.trim()) {
    chips.push({ id: 'search', label: `Search: ${state.search.trim()}`, next: { ...state, search: '' } });
  }
  for (const status of state.statuses) {
    chips.push({
      id: `status:${status}`,
      label: ASSESSMENT_STATUS_LABELS[status],
      next: { ...state, statuses: state.statuses.filter((item) => item !== status) },
    });
  }
  const dateLabel = describeDateRange(state.from, state.to);
  if (dateLabel) {
    chips.push({ id: 'date', label: dateLabel, next: { ...state, from: null, to: null } });
  }
  if (state.durationMin !== null || state.durationMax !== null) {
    const min = state.durationMin ?? 0;
    const max = state.durationMax;
    chips.push({
      id: 'duration',
      label: max === null ? `Duration ≥ ${formatDuration(min)}` : `Duration ${formatDuration(min)} – ${formatDuration(max)}`,
      next: { ...state, durationMin: null, durationMax: null },
    });
  }

  return chips;
}

export function filterAssessments(
  assessments: Assessment[],
  state: AssessmentFilterState,
): Assessment[] {
  const search = state.search.trim().toLocaleLowerCase();

  return assessments.filter((assessment) => {
    if (search) {
      const haystack = `${assessment.project?.name ?? ''} ${assessment.project?.baseUrl ?? ''}`.toLocaleLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (state.statuses.length && !state.statuses.includes(assessment.status)) return false;

    if (state.from || state.to) {
      const started = new Date(assessment.createdAt);
      if (state.from && started < startOfDay(state.from)) return false;
      if (state.to && started > endOfDay(state.to)) return false;
    }

    if (state.durationMin !== null || state.durationMax !== null) {
      // A run without a recorded duration cannot satisfy a duration range.
      if (assessment.duration === undefined || assessment.duration === null) return false;
      if (state.durationMin !== null && assessment.duration < state.durationMin) return false;
      if (state.durationMax !== null && assessment.duration > state.durationMax) return false;
    }

    return true;
  });
}

function startOfDay(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
}

function endOfDay(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 23, 59, 59, 999);
}

/** `yyyy-MM-dd` in local time — `toISOString()` would shift across timezones. */
export function toDayString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromDayString(value: string | null): Date | undefined {
  if (!value) return undefined;
  return startOfDay(value);
}
