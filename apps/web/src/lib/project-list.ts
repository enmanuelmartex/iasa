import type { AssessmentStatus, Project } from '@/types';

export type ProjectEnvironment = Project['environment'];
export type ProjectSortKey = 'recent' | 'name' | 'findings';
/** `DRAFT` matches projects whose setup is incomplete, alongside the real environments. */
export type ProjectEnvironmentOption = ProjectEnvironment | 'DRAFT';

/**
 * The project shape the listing renders. `GET /projects` derives both metrics:
 * `findingsCount` totals findings across every scan, `lastScanStatus` is the newest
 * scan's status. Kept optional so a stale cached response degrades instead of throwing.
 */
export type ProjectListItem = Project & {
  findingsCount?: number;
  lastScanStatus?: AssessmentStatus | null;
};

export type ProjectFilterState = {
  /** Matches the project name only. */
  name: string;
  /** Matches the base URL or the description. */
  search: string;
  environments: ProjectEnvironmentOption[];
  sort: ProjectSortKey;
};

export type ProjectFilterChip = {
  id: string;
  label: string;
  /** The state to apply when this chip is dismissed. */
  next: ProjectFilterState;
};

export const EMPTY_PROJECT_FILTERS: ProjectFilterState = {
  name: '',
  search: '',
  environments: [],
  sort: 'recent',
};

export const ENVIRONMENT_LABELS: Record<ProjectEnvironment, string> = {
  DEVELOPMENT: 'Development',
  STAGING: 'Staging',
  PRODUCTION: 'Production',
};

export const DRAFT_FILTER_LABEL = 'Draft o incompleto';

export const SORT_LABELS: Record<ProjectSortKey, string> = {
  recent: 'Recientes',
  name: 'Nombre A-Z',
  findings: 'Más hallazgos',
};

const ENVIRONMENT_VALUES = Object.keys(ENVIRONMENT_LABELS) as ProjectEnvironment[];
const ENVIRONMENT_OPTION_VALUES: ProjectEnvironmentOption[] = [...ENVIRONMENT_VALUES, 'DRAFT'];
const SORT_VALUES = Object.keys(SORT_LABELS) as ProjectSortKey[];

export function environmentOptionLabel(option: ProjectEnvironmentOption): string {
  return option === 'DRAFT' ? DRAFT_FILTER_LABEL : ENVIRONMENT_LABELS[option];
}

/** Toggles a value inside a multi-select group. */
export function toggleFilterValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function parseProjectFilters(params: URLSearchParams): ProjectFilterState {
  const raw = params.get('env');
  const selected = raw ? raw.split(',').map((value) => value.trim()) : [];
  const sort = params.get('sort');
  return {
    name: params.get('name') ?? '',
    search: params.get('q') ?? '',
    environments: ENVIRONMENT_OPTION_VALUES.filter((option) => selected.includes(option)),
    sort: SORT_VALUES.includes(sort as ProjectSortKey) ? (sort as ProjectSortKey) : 'recent',
  };
}

export function buildFilterChips(state: ProjectFilterState): ProjectFilterChip[] {
  const chips: ProjectFilterChip[] = [];

  if (state.name.trim()) {
    chips.push({ id: 'name', label: `Nombre: ${state.name.trim()}`, next: { ...state, name: '' } });
  }
  if (state.search.trim()) {
    chips.push({ id: 'search', label: `URL/desc: ${state.search.trim()}`, next: { ...state, search: '' } });
  }
  for (const option of state.environments) {
    chips.push({
      id: `env:${option}`,
      label: environmentOptionLabel(option),
      next: { ...state, environments: state.environments.filter((item) => item !== option) },
    });
  }
  if (state.sort !== 'recent') {
    chips.push({ id: 'sort', label: `Orden: ${SORT_LABELS[state.sort]}`, next: { ...state, sort: 'recent' } });
  }

  return chips;
}

/**
 * Filters live in the URL so the view is shareable and survives a refresh.
 * Page resets to 1 whenever the filter state changes.
 */
export function serializeProjectFilters(state: ProjectFilterState, page = 1): string {
  const params = new URLSearchParams();
  if (state.name.trim()) params.set('name', state.name.trim());
  if (state.search.trim()) params.set('q', state.search.trim());
  if (state.environments.length) params.set('env', state.environments.join(','));
  if (state.sort !== 'recent') params.set('sort', state.sort);
  if (page > 1) params.set('page', String(page));
  return params.toString();
}

export function parseProjectPage(params: URLSearchParams): number {
  return Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1);
}

export function hasActiveProjectFilters(state: ProjectFilterState): boolean {
  return Boolean(
    state.name.trim() || state.search.trim() || state.environments.length || state.sort !== 'recent',
  );
}

export function getScanCount(project: ProjectListItem): number {
  return project._count?.assessments ?? project.assessments?.length ?? 0;
}

export function filterAndSortProjects(
  projects: ProjectListItem[],
  state: ProjectFilterState,
): ProjectListItem[] {
  const name = state.name.trim().toLocaleLowerCase();
  const search = state.search.trim().toLocaleLowerCase();

  const filtered = projects.filter((project) => {
    if (name && !project.name.toLocaleLowerCase().includes(name)) return false;
    if (search) {
      // Description is optional on the model, so fall back to an empty string.
      const haystack = `${project.baseUrl} ${project.description ?? ''}`.toLocaleLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (state.environments.length) {
      // Selecting several options widens the result set, so any match passes.
      const matches = state.environments.some((option) =>
        option === 'DRAFT' ? project.status === 'DRAFT' : project.environment === option,
      );
      if (!matches) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    if (state.sort === 'name') return a.name.localeCompare(b.name);
    if (state.sort === 'findings') return (b.findingsCount ?? 0) - (a.findingsCount ?? 0);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/** Short relative time in Spanish, e.g. "hace 3h". */
export function formatRelativeEs(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'ahora mismo';
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)}d`;
  return `hace ${Math.floor(seconds / 604800)}sem`;
}

export function getPaginationItems(currentPage: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', pageCount];
  if (currentPage >= pageCount - 3) {
    return [1, 'ellipsis', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', pageCount];
}
