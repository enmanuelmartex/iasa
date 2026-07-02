'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { usersApi } from '@/lib/api';
import { AuditLog, AuditActionType } from '@/types';
import { cn } from '@/lib/utils';

const ACTION_COLORS: Record<string, string> = {
  CREATE:         'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  UPDATE:         'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DELETE:         'text-red-400 bg-red-500/10 border-red-500/20',
  LOGIN:          'text-violet-400 bg-violet-500/10 border-violet-500/20',
  LOGOUT:         'text-slate-400 bg-slate-500/10 border-slate-600/30',
  ROLE_CHANGE:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
  PASSWORD_RESET: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  SCAN_START:     'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  SCAN_STOP:      'text-slate-400 bg-slate-500/10 border-slate-600/30',
  EXPORT:         'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  IMPORT:         'text-teal-400 bg-teal-500/10 border-teal-500/20',
  READ:           'text-slate-500 bg-slate-800 border-slate-700',
};

function ActionBadge({ action }: { action: AuditActionType }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase whitespace-nowrap',
        ACTION_COLORS[action] ?? ACTION_COLORS.READ,
      )}
    >
      {action.replace('_', ' ')}
    </span>
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

const RESOURCE_OPTIONS = ['', 'user', 'auth', 'project', 'assessment', 'finding', 'report'];
const ACTION_OPTIONS: Array<AuditActionType | ''> = [
  '', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
  'ROLE_CHANGE', 'PASSWORD_RESET', 'SCAN_START', 'SCAN_STOP', 'EXPORT',
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

  function handleFilterChange() {
    setPage(0);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-white">Audit Logs</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            All system actions — logins, user changes, scans, exports
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); handleFilterChange(); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">All actions</option>
            {ACTION_OPTIONS.filter(Boolean).map((a) => (
              <option key={a} value={a}>{String(a).replace('_', ' ')}</option>
            ))}
          </select>
          <select
            value={resourceFilter}
            onChange={(e) => { setResourceFilter(e.target.value); handleFilterChange(); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">All resources</option>
            {RESOURCE_OPTIONS.filter(Boolean).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <span className="ml-auto text-xs text-slate-500 self-center">
            {total} event{total !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
            <ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No audit events found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {items.map((log) => {
              const detail = formatMetadata(log.metadata);
              return (
                <div key={log.id} className="flex items-start gap-3 py-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {log.success
                      ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500/60" />
                      : <XCircle    className="w-3.5 h-3.5 text-red-500/60" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ActionBadge action={log.action} />
                      <span className="text-xs text-slate-400 font-mono">{log.resource}</span>
                      {detail && (
                        <span className="text-xs text-slate-500">· {detail}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {log.user
                        ? <><span className="text-slate-400">{log.user.name}</span> ({log.user.email})</>
                        : <span className="text-slate-600">System</span>
                      }
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 flex-shrink-0 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
