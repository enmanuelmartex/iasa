'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { IconActivity, IconAlertTriangle, IconFolder, IconPlus, IconShield } from '@tabler/icons-react';
import { assessmentsApi } from '@/lib/api';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCard } from '@/components/dashboard/metric-card';
import { FindingsSeverityChart, OwaspCoverageRadar, OWASP_CATEGORIES, SecurityScoreChart } from '@/components/dashboard/dashboard-charts';
import { RecentAssessmentsTable } from '@/components/dashboard/recent-assessments-table';
import type { DashboardStats } from '@/types';

function aggregateOwaspCoverage(stats?: DashboardStats) {
  const totals: Record<string, number> = {};
  const assessments = stats?.recentAssessments ?? [];
  for (const category of OWASP_CATEGORIES) {
    const values = assessments
      .map((assessment) => assessment.summary?.owaspCoverage?.[category.id])
      .filter((value): value is number => typeof value === 'number');
    totals[category.id] = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  }
  return totals;
}

function DashboardSkeleton() {
  return <PageContainer><Skeleton className="mb-6 h-16 w-80 max-w-full" /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-36 rounded-xl" />)}</div><div className="mt-5 grid gap-5 lg:grid-cols-12">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-80 rounded-xl lg:col-span-4" />)}</div></PageContainer>;
}

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery<DashboardStats>({ queryKey: ['dashboard'], queryFn: assessmentsApi.dashboard, refetchInterval: 30000 });
  if (isLoading) return <DashboardSkeleton />;

  const hasData = Boolean(stats?.totalAssessments);
  // Null means no project has a computable score. Rendering it as 0 would
  // claim the worst possible posture for a workspace that has simply not been
  // scanned yet.
  const securityScore = stats?.avgSecurityScore ?? null;

  return <PageContainer className="space-y-5 pb-10">
    <PageHeader title="Security Dashboard" description="Monitor your API security posture across all projects" className="mb-0" actions={<Button asChild><Link href="/projects/new"><IconPlus className="h-4 w-4" />New Project</Link></Button>} />
    {isError && <div role="alert" className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">Dashboard data could not be refreshed. Try again shortly.</div>}
    <section aria-label="Security metrics" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Security Score" value={securityScore === null ? '—' : String(securityScore)} suffix={securityScore === null ? undefined : '/100'} icon={<IconShield className="h-4 w-4" />} tone="muted" description={hasData ? 'Average across all assessments' : 'No assessments yet'} />
      <MetricCard label="Critical Findings" value={String(stats?.findings?.critical ?? 0)} icon={<IconAlertTriangle className="h-4 w-4" />} tone="muted" description="Require immediate attention" highlight={Boolean(stats?.findings?.critical)} />
      <MetricCard label="Projects" value={String(stats?.totalProjects ?? 0)} icon={<IconFolder className="h-4 w-4" />} tone="muted" description="Active API projects" />
      <MetricCard label="Assessments" value={String(stats?.totalAssessments ?? 0)} icon={<IconActivity className="h-4 w-4" />} tone="muted" description="Completed security scans" />
    </section>
    <section aria-label="Security analytics" className="grid auto-rows-fr grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
      <SecurityScoreChart trend={stats?.scoreTrend ?? []} yearAverage={stats?.scoreTrendAverage ?? null} />
      <FindingsSeverityChart trend={stats?.findingsTrend ?? []} previousTotal={stats?.findingsTrendPreviousTotal ?? 0} />
      <OwaspCoverageRadar coverage={aggregateOwaspCoverage(stats)} />
    </section>
    <RecentAssessmentsTable assessments={stats?.recentAssessments ?? []} />
  </PageContainer>;
}
