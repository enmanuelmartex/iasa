'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';
import { IconArrowRight, IconBug } from '@tabler/icons-react';
import { findingsApi } from '@/lib/api';
import { SeverityBadge } from '@/components/security/severity-badge';
import { StatusBadge } from '@/components/security/finding-status-badge';
import { MethodBadge } from '@/components/security/method-badge';
import { formatRelative, formatDate } from '@/lib/utils';
import type { Finding, Severity, FindingStatus } from '@/types';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/tables/data-table';
import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';

const SEVERITIES: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const STATUSES: FindingStatus[] = ['OPEN', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED', 'ACCEPTED_RISK'];

export default function FindingsPage() {
  const [severity, setSeverity] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [selected, setSelected] = useState<Finding | null>(null);

  const { data: findings, isLoading } = useQuery<Finding[]>({
    queryKey: ['findings', severity, status],
    queryFn: () => findingsApi.list({ severity: severity || undefined, status: status || undefined }),
  });

  const columns = useMemo<ColumnDef<Finding>[]>(
    () => [
      {
        accessorKey: 'severity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Severity" />,
        cell: ({ row }) => <SeverityBadge severity={row.original.severity} size="sm" />,
        size: 110,
      },
      {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Finding" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{row.original.title}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.assessment?.project?.name}</p>
          </div>
        ),
      },
      {
        id: 'endpoint',
        accessorFn: (row) => (row.endpoint ? `${row.endpoint.method} ${row.endpoint.path}` : ''),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Endpoint" />,
        cell: ({ row }) =>
          row.original.endpoint ? (
            <div className="flex items-center gap-1.5">
              <MethodBadge method={row.original.endpoint.method} />
              <span className="truncate font-mono text-xs text-muted-foreground">{row.original.endpoint.path}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: 'owaspCategory',
        header: ({ column }) => <DataTableColumnHeader column={column} title="OWASP" />,
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.owaspCategory}</span>,
      },
      {
        accessorKey: 'cvssScore',
        header: ({ column }) => <DataTableColumnHeader column={column} title="CVSS" />,
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.cvssScore ?? '—'}</span>,
        size: 70,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Detected" />,
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatRelative(row.original.createdAt)}</span>,
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <PageHeader title="Findings" description="All vulnerability findings across your projects" />

      <DataTable
        columns={columns}
        data={findings ?? []}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        onRowClick={(row) => setSelected(row)}
        searchPlaceholder="Search findings…"
        toolbarFilters={
          <>
            <Select value={severity || 'all'} onValueChange={(v) => setSeverity(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                {SEVERITIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status || 'all'} onValueChange={(v) => setStatus(v === 'all' ? '' : v)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        emptyState={
          <EmptyState
            icon={IconBug}
            title="No findings"
            description={severity || status ? 'Try adjusting your filters' : 'Run a security assessment to detect vulnerabilities'}
            compact
          />
        }
      />

      <FindingDrawer finding={selected} onClose={() => setSelected(null)} />
    </PageContainer>
  );
}

function FindingDrawer({ finding, onClose }: { finding: Finding | null; onClose: () => void }) {
  const qc = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FindingStatus }) => findingsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['findings'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <Sheet open={!!finding} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {finding && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={finding.severity} size="sm" />
                <StatusBadge status={finding.status} />
              </div>
              <SheetTitle>{finding.title}</SheetTitle>
              <SheetDescription>
                {finding.assessment?.project?.name} · {formatDate(finding.createdAt)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-5 pb-6">
              {finding.endpoint && (
                <div className="flex items-center gap-1.5">
                  <MethodBadge method={finding.endpoint.method} />
                  <span className="font-mono text-xs text-muted-foreground">{finding.endpoint.path}</span>
                </div>
              )}

              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</h4>
                <p className="text-sm text-foreground">{finding.description}</p>
              </div>

              {finding.impact && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Impact</h4>
                  <p className="text-sm text-foreground">{finding.impact}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">OWASP Category</p>
                  <p className="font-mono text-foreground">{finding.owaspCategory}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CVSS Score</p>
                  <p className="text-foreground">{finding.cvssScore ?? '—'}</p>
                </div>
              </div>

              {finding.remediation && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Remediation</h4>
                  <p className="text-sm text-foreground">{finding.remediation}</p>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Change status</h4>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={finding.status === s ? 'default' : 'outline'}
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: finding.id, status: s })}
                    >
                      {s.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href={`/findings/${finding.id}`}>
                  View full details
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
