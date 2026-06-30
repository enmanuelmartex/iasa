'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Activity, ChevronRight } from 'lucide-react';
import { assessmentsApi } from '@/lib/api';
import { StatusBadge } from '@/components/ui/severity-badge';
import { formatRelative, formatDuration, scoreToColor } from '@/lib/utils';
import type { Assessment } from '@/types';

export default function AssessmentsPage() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => assessmentsApi.list(),
    refetchInterval: 10000,
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assessments</h1>
        <p className="text-slate-400 text-sm mt-0.5">All security assessment runs</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !assessments?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="w-12 h-12 text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No assessments yet</p>
            <p className="text-slate-600 text-sm mt-1">Go to a project and run your first assessment</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 text-[11px] text-slate-500 uppercase tracking-wider">
              <div className="col-span-3">Project</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Score</div>
              <div className="col-span-1">Critical</div>
              <div className="col-span-1">High</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-2">Started</div>
            </div>
            {assessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/assessments/${assessment.id}`}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 hover:bg-slate-800/40 transition-colors group items-center"
              >
                <div className="col-span-3">
                  <p className="text-sm font-medium text-slate-200 truncate">{assessment.project?.name}</p>
                  <p className="text-xs text-slate-500 truncate font-mono">{assessment.project?.baseUrl}</p>
                </div>
                <div className="col-span-2">
                  <StatusBadge status={assessment.status} />
                </div>
                <div className="col-span-1">
                  {assessment.summary ? (
                    <span className={`text-sm font-bold ${scoreToColor(assessment.summary.securityScore)}`}>
                      {assessment.summary.securityScore}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </div>
                <div className="col-span-1 text-sm font-bold text-red-400">
                  {assessment.summary?.criticalCount ?? '—'}
                </div>
                <div className="col-span-1 text-sm font-bold text-orange-400">
                  {assessment.summary?.highCount ?? '—'}
                </div>
                <div className="col-span-1 text-sm text-slate-300">
                  {assessment.summary?.totalFindings ?? '—'}
                </div>
                <div className="col-span-1 text-xs text-slate-400">
                  {assessment.duration ? formatDuration(assessment.duration) : '—'}
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{formatRelative(assessment.createdAt)}</span>
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
