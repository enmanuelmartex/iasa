'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from 'recharts';
import { IconCashBanknote, IconCoins, IconInfoCircle, IconReceipt2, IconRobot } from '@tabler/icons-react';
import { financeApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useChartColors } from '@/lib/use-chart-colors';
import type { AiUsageEvent, FinanceSummary, FinanceUsagePage } from '@/types';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricCard } from '@/components/dashboard/metric-card';
import { DataTable } from '@/components/tables/data-table';
import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const PROVIDERS = ['openai', 'claude', 'gemini', 'grok', 'ollama'];

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

export default function FinancePage() {
  const [provider, setProvider] = useState<string>('');
  const colors = useChartColors();

  const { data: summary, isLoading: summaryLoading } = useQuery<FinanceSummary>({
    queryKey: ['finance-summary'],
    queryFn: () => financeApi.summary(),
  });

  const { data: usage, isLoading: usageLoading } = useQuery<FinanceUsagePage>({
    queryKey: ['finance-usage', provider],
    queryFn: () => financeApi.usage({ provider: provider || undefined, pageSize: 200 }),
  });

  const trendConfig: ChartConfig = {
    costUsd: { label: 'Estimated cost', color: colors.primary },
  };

  const providerChartData =
    summary?.byProvider.map((p) => ({ provider: p.provider, costUsd: Number(p.costUsd.toFixed(4)) })) ?? [];
  const providerConfig: ChartConfig = {
    costUsd: { label: 'Estimated cost', color: colors['chart-1'] },
  };

  const columns = useMemo<ColumnDef<AiUsageEvent>[]>(
    () => [
      {
        id: 'project',
        accessorFn: (row) => row.project?.name ?? '',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
        cell: ({ row }) => <span className="text-sm text-foreground">{row.original.project?.name ?? '—'}</span>,
      },
      {
        accessorKey: 'provider',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Provider" />,
        cell: ({ row }) => <span className="text-sm capitalize text-foreground">{row.original.provider}</span>,
      },
      {
        accessorKey: 'model',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.model ?? '—'}</span>,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <span className="text-xs capitalize text-muted-foreground">{row.original.status}</span>,
      },
      {
        accessorKey: 'tokensUsed',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tokens" />,
        cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{row.original.tokensUsed.toLocaleString()}</span>,
      },
      {
        accessorKey: 'estimatedCostUsd',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Est. Cost" />,
        cell: ({ row }) => <span className="text-sm tabular-nums text-foreground">{formatUsd(row.original.estimatedCostUsd)}</span>,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <PageHeader title="Finance" description="Estimated AI analysis cost across your projects" />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
        <IconInfoCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <p>
          Token usage is measured directly from each assessment&apos;s AI analysis. Dollar figures are{' '}
          <span className="font-medium text-foreground">estimates</span> based on a static per-model rate table, not
          live provider billing. Self-hosted Ollama usage is always $0.
        </p>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Estimated AI Cost"
            value={formatUsd(summary?.totalEstimatedCostUsd ?? 0)}
            icon={<IconCashBanknote className="h-5 w-5" />}
            tone="brand"
            description="Total across all assessments"
          />
          <MetricCard
            label="Tokens Used"
            value={(summary?.totalTokensUsed ?? 0).toLocaleString()}
            icon={<IconCoins className="h-5 w-5" />}
            tone="cyan"
            description="Total AI tokens consumed"
          />
          <MetricCard
            label="Assessments with AI"
            value={`${summary?.assessmentsWithAi ?? 0}`}
            icon={<IconRobot className="h-5 w-5" />}
            tone="muted"
            description="Analysis attempted or completed"
          />
          <MetricCard
            label="Avg Cost / Assessment"
            value={formatUsd(summary?.avgCostPerAssessment ?? 0)}
            icon={<IconReceipt2 className="h-5 w-5" />}
            tone="muted"
            description="Estimated, per scan"
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Cost Trend</CardTitle>
            <CardDescription>Estimated spend by month</CardDescription>
          </CardHeader>
          <CardContent>
            {summary?.trend?.length ? (
              <ChartContainer config={trendConfig} className="aspect-auto h-[220px] w-full">
                <AreaChart data={summary.trend}>
                  <defs>
                    <linearGradient id="fillCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area dataKey="costUsd" type="natural" fill="url(#fillCost)" stroke={colors.primary} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyState icon={IconCashBanknote} title="No usage yet" description="Run an assessment with AI analysis enabled." compact />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost by Provider</CardTitle>
            <CardDescription>Estimated spend per AI provider</CardDescription>
          </CardHeader>
          <CardContent>
            {providerChartData.length ? (
              <ChartContainer config={providerConfig} className="aspect-auto h-[220px] w-full">
                <BarChart data={providerChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="provider" tickLine={false} axisLine={false} tickMargin={8} className="capitalize" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="costUsd" fill={colors['chart-1']} radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyState icon={IconRobot} title="No usage yet" description="No AI provider activity recorded." compact />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={usage?.items ?? []}
          isLoading={usageLoading}
          getRowId={(row) => row.id}
          searchPlaceholder="Search usage…"
          toolbarFilters={
            <Select value={provider || 'all'} onValueChange={(v) => setProvider(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All providers</SelectItem>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          emptyState={
            <EmptyState
              icon={IconReceipt2}
              title="No usage recorded"
              description="AI usage events appear here once an assessment runs with AI analysis enabled."
              compact
            />
          }
        />
      </div>
    </PageContainer>
  );
}
