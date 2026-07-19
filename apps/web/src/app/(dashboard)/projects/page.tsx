'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { IconActivity, IconChevronRight, IconClock, IconFileDescription, IconFolderOpen, IconPlus, IconRadar2, IconTrash, IconWorld } from '@tabler/icons-react';
import { RotateCcw } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import { cn, formatRelative } from '@/lib/utils';
import type { Project } from '@/types';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectDrawer } from '@/components/projects/project-drawer';
import { ProjectLogoPlaceholder } from '@/components/projects/project-logo-placeholder';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

const ENVIRONMENT_CONFIG: Record<Project['environment'], { label: string; className: string }> = {
  DEVELOPMENT: { label: 'Development', className: 'border-success/25 bg-success/[0.08] text-success' },
  STAGING: { label: 'Staging', className: 'border-severity-medium/25 bg-severity-medium/[0.08] text-severity-medium' },
  PRODUCTION: { label: 'Production', className: 'border-destructive/25 bg-destructive/[0.08] text-destructive' },
};

const PROJECT_STATUS_CONFIG: Record<Project['status'], {
  title: string;
  description: (_project: Project) => string;
  icon: typeof IconRadar2;
  panelClassName: string;
  iconClassName: string;
  titleClassName: string;
}> = {
  READY: {
    title: 'Ready to scan',
    description: (_project) => 'This project is ready to run a security scan.',
    icon: IconRadar2,
    panelClassName: 'border-success/20 bg-success/[0.045]',
    iconClassName: 'border-success/20 bg-success/[0.08] text-success',
    titleClassName: 'text-success',
  },
  DRAFT: {
    title: 'Setup incomplete',
    description: (project) => project.setupStep === 1
      ? 'Project details are incomplete.'
      : project.setupStep === 2
        ? 'API specification is missing.'
        : 'Authentication needs review.',
    icon: IconFileDescription,
    panelClassName: 'border-severity-medium/20 bg-severity-medium/[0.045]',
    iconClassName: 'border-severity-medium/20 bg-severity-medium/[0.08] text-severity-medium',
    titleClassName: 'text-severity-medium',
  },
};

const PROJECTS_PER_PAGE = 9;

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  const filters = {
    name: searchParams.get('name') ?? '',
    baseUrl: searchParams.get('baseUrl') ?? '',
    environment: searchParams.get('environment') ?? 'all',
    status: searchParams.get('status') ?? 'all',
  };
  const hasActiveFilters = Boolean(filters.name || filters.baseUrl || filters.environment !== 'all' || filters.status !== 'all');
  const filteredProjects = useMemo(() => {
    const name = filters.name.trim().toLocaleLowerCase();
    const baseUrl = filters.baseUrl.trim().toLocaleLowerCase();
    return (projects ?? []).filter((project) =>
      (!name || project.name.toLocaleLowerCase().includes(name)) &&
      (!baseUrl || project.baseUrl.toLocaleLowerCase().includes(baseUrl)) &&
      (filters.environment === 'all' || project.environment === filters.environment) &&
      (filters.status === 'all' || project.status === filters.status),
    );
  }, [projects, filters.name, filters.baseUrl, filters.environment, filters.status]);

  const requestedPage = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, pageCount);
  const paginatedProjects = useMemo(
    () => filteredProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE),
    [currentPage, filteredProjects],
  );
  const paginationItems = useMemo(() => getPaginationItems(currentPage, pageCount), [currentPage, pageCount]);

  useEffect(() => {
    if (isLoading || requestedPage === currentPage) return;
    const next = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) next.delete('page');
    else next.set('page', String(currentPage));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [currentPage, isLoading, pathname, requestedPage, router, searchParams]);

  function updateFilter(key: 'name' | 'baseUrl' | 'environment' | 'status', value: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('page');
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  function goToPage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), pageCount);
    const next = new URLSearchParams(searchParams.toString());
    if (nextPage === 1) next.delete('page');
    else next.set('page', String(nextPage));
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: () => toast.error('Failed to delete project'),
  });

  function newProject() {
    setEditing(null);
    setDrawerOpen(true);
  }

  async function resume(project: Project) {
    try {
      setEditing(await projectsApi.get(project.id));
      setDrawerOpen(true);
    } catch {
      toast.error('We could not load this draft. Please try again.');
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage your API security projects"
        actions={<Button onClick={newProject}><IconPlus />New Project</Button>}
      />

      {!isLoading && Boolean(projects?.length) && (
        <div className="mb-4 grid gap-3 rounded-xl border border-border/80 bg-card/70 p-3 shadow-sm sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_minmax(12rem,1fr)_11rem_9rem_2.5rem] xl:items-end">
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="project-name-filter" className="text-xs font-medium text-muted-foreground">Project name</Label>
            <Input id="project-name-filter" value={filters.name} onChange={(event) => updateFilter('name', event.target.value)} placeholder="Search projects" className="h-9 rounded-lg bg-background/80 shadow-none hover:border-foreground/20" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="project-url-filter" className="text-xs font-medium text-muted-foreground">Base URL</Label>
            <Input id="project-url-filter" type="search" value={filters.baseUrl} onChange={(event) => updateFilter('baseUrl', event.target.value)} placeholder="Search API URLs" className="h-9 rounded-lg bg-background/80 shadow-none hover:border-foreground/20" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="project-environment-filter" className="text-xs font-medium text-muted-foreground">Environment</Label>
            <Select value={filters.environment} onValueChange={(value) => updateFilter('environment', value)}>
              <SelectTrigger id="project-environment-filter" className="h-9 rounded-lg bg-background/80 shadow-none hover:border-foreground/20" aria-label="Filter by environment"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectGroup>
                  <SelectItem value="all">All environments</SelectItem>
                  <SelectItem value="DEVELOPMENT">Development</SelectItem>
                  <SelectItem value="STAGING">Staging</SelectItem>
                  <SelectItem value="PRODUCTION">Production</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="project-status-filter" className="text-xs font-medium text-muted-foreground">Status</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger id="project-status-filter" className="h-9 rounded-lg bg-background/80 shadow-none hover:border-foreground/20" aria-label="Filter by project status"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectGroup>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2 sm:justify-self-end xl:col-span-1 xl:justify-self-auto">
            <span aria-hidden="true" className="hidden text-xs font-medium text-muted-foreground xl:block">Reset</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" size="icon" className="size-9 rounded-lg shadow-none" onClick={clearFilters} disabled={!hasActiveFilters} aria-label="Reset project filters"><RotateCcw className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>Reset filters</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid auto-rows-fr grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-48 rounded-xl" />)}
        </div>
      ) : !projects?.length ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={IconFolderOpen}
              title="No projects yet"
              description="Create your first project by importing an OpenAPI specification and configuring authentication."
              action={<Button onClick={newProject}><IconPlus />Create First Project</Button>}
            />
          </CardContent>
        </Card>
      ) : !filteredProjects.length ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={IconFolderOpen}
              title="No matching projects"
              description="No projects match the current filters. Try adjusting or clearing them."
              action={<Button type="button" variant="outline" onClick={clearFilters}><RotateCcw className="size-4" />Clear filters</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              projectsQuery={searchParams.toString()}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === project.id}
              onDelete={() => deleteMutation.mutateAsync(project.id)}
              onResume={() => void resume(project)}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredProjects.length > PROJECTS_PER_PAGE && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem><PaginationPrevious onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} /></PaginationItem>
            {paginationItems.map((item, index) => item === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink isActive={item === currentPage} onClick={() => goToPage(item)} aria-label={`Go to page ${item}`}>{item}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem><PaginationNext onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ProjectDrawer open={drawerOpen} project={editing} onOpenChange={setDrawerOpen} onChanged={() => void queryClient.invalidateQueries({ queryKey: ['projects'] })} />
    </PageContainer>
  );
}

function ProjectCard({
  project,
  projectsQuery,
  isDeleting,
  onDelete,
  onResume,
}: {
  project: Project;
  projectsQuery: string;
  isDeleting: boolean;
  onDelete: () => Promise<unknown>;
  onResume: () => void;
}) {
  const isDraft = project.status === 'DRAFT';
  const environment = ENVIRONMENT_CONFIG[project.environment];
  const status = PROJECT_STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;

  return (
    <Card className="group h-full min-h-[13rem] overflow-hidden rounded-2xl border-border/70 bg-card shadow-[0_12px_32px_-28px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-[0_16px_36px_-28px_rgba(0,0,0,0.9)] motion-reduce:transition-none">
      <CardContent className="flex h-full flex-col p-4">
        <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ProjectLogoPlaceholder />
            <div className="min-w-0 pt-0.5">
              <h3 className="truncate text-sm font-semibold leading-5 text-foreground">{project.name || 'Untitled project'}</h3>
              <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted-foreground">{project.description || 'No description added'}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant="outline" className={cn('h-6 rounded-full px-2 text-[10px] font-semibold uppercase tracking-[0.08em]', environment.className)}>{environment.label}</Badge>
            <DeleteConfirmationDialog
              title={`Delete “${project.name || 'Untitled project'}”?`}
              description="This will permanently delete the project and its associated data. This action cannot be undone."
              isDeleting={isDeleting}
              onConfirm={onDelete}
              trigger={<Button type="button" variant="ghost" size="icon" className="size-11 text-muted-foreground transition-[color,background-color,opacity] hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 lg:-m-1.5 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100" aria-label={`Delete ${project.name || 'project'}`}><IconTrash /></Button>}
            />
          </div>
        </div>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div tabIndex={0} aria-label={`API URL: ${project.baseUrl || 'Base URL not added'}`} className="mb-3 flex min-w-0 items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-2.5 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <IconWorld className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-mono text-[11px] text-muted-foreground">{project.baseUrl || 'Base URL not added'}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm break-all font-mono text-xs">{project.baseUrl || 'Base URL not added'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className={cn('mb-3 flex items-center rounded-xl border px-3 py-2.5', status.panelClassName)}>
          <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg border', status.iconClassName)}>
            <StatusIcon className="size-4.5" stroke={1.7} />
          </div>
          <div className="ml-3 min-w-0 border-l border-border/70 pl-3">
            <div className="flex items-center gap-1.5">
              <p className={cn('text-xs font-semibold', status.titleClassName)}>{status.title}</p>
              {isDraft && <span className="text-[10px] text-muted-foreground">Step {project.setupStep} of 3</span>}
            </div>
            <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-muted-foreground">{status.description(project)}</p>
          </div>
        </div>

        <div className="mt-auto flex min-h-9 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border/70 pt-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            <span className="flex items-center gap-1.5 text-[11px]"><IconActivity className="size-3.5 text-primary" />{project._count?.assessments ?? 0} scans</span>
            <span className="flex items-center gap-1.5 text-[11px]"><IconClock className="size-3.5" />{formatRelative(project.updatedAt)}</span>
          </div>
          {isDraft ? (
            <button onClick={onResume} className="flex min-h-11 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Continue setup <IconChevronRight className="size-3.5" /></button>
          ) : (
            <Link href={`/projects/${project.id}${projectsQuery ? `?projectsQuery=${encodeURIComponent(projectsQuery)}` : ''}`} className="flex min-h-11 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">View <IconChevronRight className="size-3.5" /></Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getPaginationItems(currentPage: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', pageCount];
  if (currentPage >= pageCount - 3) return [1, 'ellipsis', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', pageCount];
}
