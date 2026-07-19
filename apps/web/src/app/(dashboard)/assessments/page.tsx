'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { IconActivity } from '@tabler/icons-react';
import { assessmentsApi } from '@/lib/api';
import { StatusBadge } from '@/components/security/finding-status-badge';
import { formatRelative, formatDuration, cn } from '@/lib/utils';
import type { Assessment } from '@/types';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/ui/empty-state';
import { DataTable } from '@/components/tables/data-table';
import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';

function scoreClass(score: number) {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-severity-medium';
  if (score >= 40) return 'text-severity-high';
  return 'text-severity-critical';
}

export default function AssessmentsPage() {
  const router = useRouter();
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => assessmentsApi.list(),
    refetchInterval: 10000,
  });

  const columns = useMemo<ColumnDef<Assessment>[]>(
    () => [
      {
        id: 'project',
        accessorFn: (row) => row.project?.name ?? '',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.original.project?.name}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{row.original.project?.baseUrl}</p>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'score',
        accessorFn: (row) => row.summary?.securityScore ?? -1,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
        cell: ({ row }) =>
          row.original.summary ? (
            <span className={cn('text-sm font-bold', scoreClass(row.original.summary.securityScore))}>
              {row.original.summary.securityScore}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
        size: 80,
      },
      {
        id: 'critical',
        accessorFn: (row) => row.summary?.criticalCount ?? -1,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Critical" />,
        cell: ({ row }) => <span className="text-sm font-bold text-destructive">{row.original.summary?.criticalCount ?? '—'}</span>,
        size: 80,
      },
      {
        id: 'high',
        accessorFn: (row) => row.summary?.highCount ?? -1,
        header: ({ column }) => <DataTableColumnHeader column={column} title="High" />,
        cell: ({ row }) => <span className="text-sm font-bold text-severity-high">{row.original.summary?.highCount ?? '—'}</span>,
        size: 80,
      },
      {
        id: 'total',
        accessorFn: (row) => row.summary?.totalFindings ?? -1,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => <span className="text-sm text-foreground">{row.original.summary?.totalFindings ?? '—'}</span>,
        size: 70,
      },
      {
        id: 'duration',
        accessorFn: (row) => row.duration ?? -1,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{row.original.duration ? formatDuration(row.original.duration) : '—'}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Started" />,
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatRelative(row.original.createdAt)}</span>,
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <PageHeader title="Assessments" description="All security assessment runs across your projects" />

      <DataTable
        columns={columns}
        data={assessments ?? []}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/assessments/${row.id}`)}
        searchPlaceholder="Search assessments…"
        emptyState={
          <EmptyState
            icon={IconActivity}
            title="No assessments yet"
            description="Go to a project and run your first assessment."
            compact
          />
        }
      />
    </PageContainer>
  );
}
