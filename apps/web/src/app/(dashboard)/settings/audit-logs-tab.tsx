'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IconClipboardList, IconChevronLeft, IconChevronRight, IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { usersApi } from '@/lib/api';
import type { AuditLog, AuditActionType } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'text-success bg-success/10 border-success/20',
  UPDATE: 'text-chart-2 bg-chart-2/10 border-chart-2/20',
  DELETE: 'text-destructive bg-destructive/10 border-destructive/20',
  LOGIN: 'text-primary bg-primary/10 border-primary/20',
  LOGOUT: 'text-muted-foreground bg-muted border-border',
  ROLE_CHANGE: 'text-severity-medium bg-severity-medium/10 border-severity-medium/20',
  PASSWORD_RESET: 'text-severity-high bg-severity-high/10 border-severity-high/20',
  SCAN_START: 'text-cyan bg-cyan/10 border-cyan/20',
  SCAN_STOP: 'text-muted-foreground bg-muted border-border',
  EXPORT: 'text-chart-3 bg-chart-3/10 border-chart-3/20',
  IMPORT: 'text-chart-3 bg-chart-3/10 border-chart-3/20',
  READ: 'text-muted-foreground bg-muted border-border',
};

function ActionBadge({ action }: { action: AuditActionType }) {
  return (
    <Badge variant="outline" className={cn('whitespace-nowrap text-[10px] font-semibold uppercase', ACTION_COLORS[action] ?? ACTION_COLORS.READ)}>
      {action.replace('_', ' ')}
    </Badge>
  );
}

function formatMetadata(meta: Record<string, any> | undefined): string | null {
  if (!meta) return null;
  if (meta.from !== undefined && meta.to !== undefined) return `${meta.from} → ${meta.to}`;
  if (meta.field && meta.value !== undefined) return `${meta.field}: ${meta.value}`;
  if (meta.email) return meta.email;
  if (meta.role) return meta.role;
  return null;
}

const PAGE_SIZE = 25;

const RESOURCE_OPTIONS = ['user', 'auth', 'project', 'assessment', 'finding', 'report'];
const ACTION_OPTIONS: AuditActionType[] = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'ROLE_CHANGE',
  'PASSWORD_RESET',
  'SCAN_START',
  'SCAN_STOP',
  'EXPORT',
];

export function AuditLogsTab() {
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resourceFilter, setResourceFilter] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, actionFilter, resourceFilter],
    queryFn: () =>
      usersApi.auditLogs({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        action: actionFilter || undefined,
        resource: resourceFilter || undefined,
      }),
    staleTime: 30_000,
  });

  const total: number = data?.total ?? 0;
  const items: AuditLog[] = data?.items ?? [];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-foreground">Audit Logs</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">All system actions — logins, user changes, scans, exports</p>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Select
              value={actionFilter || 'all'}
              onValueChange={(v) => {
                setActionFilter(v === 'all' ? '' : v);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {ACTION_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={resourceFilter || 'all'}
              onValueChange={(v) => {
                setResourceFilter(v === 'all' ? '' : v);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="All resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All resources</SelectItem>
                {RESOURCE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="ml-auto self-center text-xs text-muted-foreground">
              {total} event{total !== 1 ? 's' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState icon={IconClipboardList} title="No audit events found" compact />
          ) : (
            <div className="divide-y divide-border">
              {items.map((log) => {
                const detail = formatMetadata(log.metadata);
                return (
                  <div key={log.id} className="flex items-start gap-3 py-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {log.success ? <IconCircleCheck className="h-3.5 w-3.5 text-success/60" /> : <IconCircleX className="h-3.5 w-3.5 text-destructive/60" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <ActionBadge action={log.action} />
                        <span className="font-mono text-xs text-muted-foreground">{log.resource}</span>
                        {detail && <span className="text-xs text-muted-foreground">· {detail}</span>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {log.user ? (
                          <>
                            <span className="text-muted-foreground">{log.user.name}</span> ({log.user.email})
                          </>
                        ) : (
                          <span className="text-muted-foreground/70">System</span>
                        )}
                      </p>
                    </div>
                    <span className="flex-shrink-0 whitespace-nowrap text-[10px] text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
              <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                <IconChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>
                Next
                <IconChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
