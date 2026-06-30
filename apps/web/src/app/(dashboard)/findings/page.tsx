'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Bug, ChevronRight, Filter } from 'lucide-react';
import { findingsApi } from '@/lib/api';
import { SeverityBadge, StatusBadge, MethodBadge } from '@/components/ui/severity-badge';
import { formatRelative } from '@/lib/utils';
import type { Finding, Severity } from '@/types';

const SEVERITIES: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const STATUSES = ['OPEN', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED', 'ACCEPTED_RISK'];

export default function FindingsPage() {
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  const { data: findings, isLoading } = useQuery<Finding[]>({
    queryKey: ['findings', severity, status],
    queryFn: () => findingsApi.list({ severity: severity || undefined, status: status || undefined }),
  });

  const { data: stats } = useQuery({
    queryKey: ['findings-stats'],
    queryFn: findingsApi.stats,
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Findings</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            All vulnerability findings across your projects
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-2">
        {SEVERITIES.map((sev) => {
          const count = stats?.bySeverity?.find((s: any) => s.severity === sev)?._count?._all || 0;
          return (
            <button
              key={sev}
              onClick={() => setSeverity(severity === sev ? '' : sev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                severity === sev ? 'border-violet-500/40 bg-violet-500/10 text-violet-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <SeverityBadge severity={sev} size="sm" />
              <span>{count}</span>
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        {isLoading ? (
          <div className="space-y-1 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !findings?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bug className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No findings</p>
            <p className="text-slate-600 text-sm mt-1">
              {severity || status ? 'Try adjusting your filters' : 'Run a security assessment to detect vulnerabilities'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 text-[11px] text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">Severity</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Endpoint</div>
              <div className="col-span-2">OWASP</div>
              <div className="col-span-1">CVSS</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">When</div>
            </div>

            {findings.map((finding) => (
              <Link
                key={finding.id}
                href={`/findings/${finding.id}`}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 hover:bg-slate-800/40 transition-colors group items-center"
              >
                <div className="col-span-1">
                  <SeverityBadge severity={finding.severity} size="sm" />
                </div>
                <div className="col-span-4">
                  <p className="text-sm font-medium text-slate-200 truncate">{finding.title}</p>
                  <p className="text-xs text-slate-500 truncate">{finding.assessment?.project?.name}</p>
                </div>
                <div className="col-span-2">
                  {finding.endpoint && (
                    <div className="flex items-center gap-1.5">
                      <MethodBadge method={finding.endpoint.method} />
                      <span className="text-xs font-mono text-slate-400 truncate">{finding.endpoint.path}</span>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 font-mono">{finding.owaspCategory}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-slate-400">{finding.cvssScore ?? '—'}</span>
                </div>
                <div className="col-span-1">
                  <StatusBadge status={finding.status} />
                </div>
                <div className="col-span-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatRelative(finding.createdAt)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
