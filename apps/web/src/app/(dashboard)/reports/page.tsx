'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { ColumnDef } from '@tanstack/react-table';
import { IconActivity, IconArrowRight, IconFolder, IconShield, IconChartBar } from '@tabler/icons-react';
import { reportsApi, assessmentsApi } from '@/lib/api';
import { formatDate, formatRelative, cn } from '@/lib/utils';
import { useChartColors } from '@/lib/use-chart-colors';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { Report, ReportStats, DashboardStats } from '@/types';
import { toast } from 'sonner';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { DataTable } from '@/components/tables/data-table';
import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IconDotsVertical, IconEye, IconTrash } from '@tabler/icons-react';

const FORMAT_TONE: Record<string, string> = {
  PDF: 'border-destructive/20 bg-destructive/10 text-destructive',
  HTML: 'border-chart-2/20 bg-chart-2/10 text-chart-2',
  JSON: 'border-severity-medium/20 bg-severity-medium/10 text-severity-medium',
  SARIF: 'border-chart-3/20 bg-chart-3/10 text-chart-3',
  MARKDOWN: 'border-border bg-muted text-muted-foreground',
};

const TYPE_LABELS: Record<string, string> = {
  EXECUTIVE: 'Executive',
  TECHNICAL: 'Technical',
  COMPLIANCE: 'Compliance',
  DEVELOPER: 'Developer',
};

function scoreTone(score: number) {
  if (score >= 80) return 'success' as const;
  if (score >= 60) return 'medium' as const;
  if (score >= 40) return 'high' as const;
  return 'critical' as const;
}

const TONE_TEXT: Record<string, string> = {
  success: 'text-success',
  medium: 'text-severity-medium',
  high: 'text-severity-high',
  critical: 'text-severity-critical',
};

export default function ReportsPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const [formatFilter, setFormatFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const colors = useChartColors();

  const { data: stats, isLoading: statsLoading } = useQuery<ReportStats>({
    queryKey: ['reports-stats'],
    queryFn: reportsApi.stats,
    staleTime: 60_000,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: () => reportsApi.list(),
    staleTime: 30_000,
  });

  const { data: dashStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: assessmentsApi.dashboard,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] });
      qc.invalidateQueries({ queryKey: ['reports-stats'] });
      toast.success('Report deleted');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete report'),
  });

  const filteredReports = reports?.filter((r) => {
    if (formatFilter && r.format !== formatFilter) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    return true;
  });

  const securityScore = stats?.avgSecurityScore ?? dashStats?.avgSecurityScore ?? 0;

  const chartData = stats?.trend.length
    ? stats.trend
    : Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return { date: d.toISOString().split('T')[0], critical: 0, high: 0, medium: 0, low: 0, total: 0, score: 100 };
      });

  const chartFormatted = chartData.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const trendConfig: ChartConfig = {
    critical: { label: 'Critical', color: colors['severity-critical'] },
    high: { label: 'High', color: colors['severity-high'] },
    medium: { label: 'Medium', color: colors['severity-medium'] },
    low: { label: 'Low', color: colors['severity-low'] },
  };

  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Report" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.original.title}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{row.original.id.substring(0, 16)}…</p>
          </div>
        ),
      },
      {
        id: 'project',
        accessorFn: (row) => row.assessment?.project?.name ?? '',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
        cell: ({ row }) =>
          row.original.assessment?.project ? (
            <Link
              href={`/projects/${row.original.assessment.project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconFolder className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{row.original.assessment.project.name}</span>
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'format',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Format" />,
        cell: ({ row }) => (
          <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', FORMAT_TONE[row.original.format])}>
            {row.original.format}
          </Badge>
        ),
        size: 90,
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{TYPE_LABELS[row.original.type] || row.original.type}</span>,
      },
      {
        accessorKey: 'generatedAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Generated" />,
        cell: ({ row }) => (
          <div>
            <p className="text-xs text-muted-foreground">{formatRelative(row.original.generatedAt)}</p>
            <p className="text-[11px] text-muted-foreground/70">{formatDate(row.original.generatedAt).split(',')[0]}</p>
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <IconDotsVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
                  <Link href={`/reports/${row.original.id}`} className="flex items-center gap-2">
                    <IconEye className="h-3.5 w-3.5" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(row.original);
                  }}
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 50,
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Security assessment history and vulnerability intelligence"
        actions={
          <Button asChild variant="outline">
            <Link href="/assessments">
              <IconActivity className="h-4 w-4" />
              Run new scan
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatCard label="Avg Score" value={`${securityScore}`} suffix="/100" color={TONE_TEXT[scoreTone(securityScore)]} loading={statsLoading} />
        <StatCard label="Projects" value={`${stats?.totalProjects ?? dashStats?.totalProjects ?? 0}`} color="text-primary" loading={statsLoading} />
        <StatCard label="Scans" value={`${stats?.totalAssessments ?? dashStats?.totalAssessments ?? 0}`} color="text-chart-2" loading={statsLoading} />
        <StatCard label="Reports" value={`${stats?.totalReports ?? 0}`} color="text-foreground" loading={statsLoading} />
        <StatCard label="Critical" value={`${stats?.criticalCount ?? 0}`} color="text-severity-critical" loading={statsLoading} danger={!!stats?.criticalCount} />
        <StatCard label="High" value={`${stats?.highCount ?? 0}`} color="text-severity-high" loading={statsLoading} />
        <StatCard label="Medium" value={`${stats?.mediumCount ?? 0}`} color="text-severity-medium" loading={statsLoading} />
        <StatCard label="Low" value={`${stats?.lowCount ?? 0}`} color="text-severity-low" loading={statsLoading} />
      </div>

      {/* Main Chart */}
      <Card className="mb-4">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Vulnerability Trend</CardTitle>
            <CardDescription>Daily findings by severity — last 30 days</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {(['critical', 'high', 'medium', 'low'] as const).map((key) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: trendConfig[key].color as string }} />
                {trendConfig[key].label as string}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trendConfig} className="aspect-auto h-[260px] w-full">
            <AreaChart data={chartFormatted} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                {(['critical', 'high', 'medium', 'low'] as const).map((key) => (
                  <linearGradient key={key} id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={trendConfig[key].color as string} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={trendConfig[key].color as string} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: colors['muted-foreground'] }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: colors['muted-foreground'] }} axisLine={false} tickLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ stroke: colors.border, strokeWidth: 1 }} />
              {(['critical', 'high', 'medium', 'low'] as const).map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={trendConfig[key].color as string}
                  strokeWidth={1.5}
                  fill={`url(#g-${key})`}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <DataTable
        columns={columns}
        data={filteredReports ?? []}
        isLoading={reportsLoading}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/reports/${row.id}`)}
        searchPlaceholder="Search reports…"
        toolbarFilters={
          <>
            <Select value={formatFilter || 'all'} onValueChange={(v) => setFormatFilter(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All formats</SelectItem>
                {['PDF', 'HTML', 'JSON', 'SARIF', 'MARKDOWN'].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter || 'all'} onValueChange={(v) => setTypeFilter(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        emptyState={
          <EmptyState
            icon={IconChartBar}
            title={reports?.length ? 'No reports match your filters' : 'No reports generated yet'}
            description={
              reports?.length
                ? 'Try adjusting your format or type filters.'
                : 'Complete an assessment and generate a report to see it here.'
            }
            action={
              !reports?.length ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/projects">
                    <IconShield className="h-3.5 w-3.5" />
                    Go to Projects
                  </Link>
                </Button>
              ) : undefined
            }
          />
        }
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"><IconTrash /></AlertDialogMedia>
            <AlertDialogTitle>{deleteTarget?.title ? `Delete “${deleteTarget.title}”?` : 'Delete report?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost" disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(event) => { event.preventDefault(); if (deleteTarget) deleteMutation.mutate(deleteTarget.id); }}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}

function StatCard({
  label,
  value,
  suffix,
  color,
  loading,
  danger,
}: {
  label: string;
  value: string;
  suffix?: string;
  color: string;
  loading?: boolean;
  danger?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="h-7 w-16 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(danger && 'border-destructive/20 bg-destructive/5')}>
      <CardContent className="p-4">
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-0.5">
          <span className={cn('text-xl font-black', color)}>{value}</span>
          {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
