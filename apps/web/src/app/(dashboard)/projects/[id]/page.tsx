'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft, Play, Globe, Shield, Activity, Bug,
  Clock, CheckCircle, Tag, ChevronRight, Loader2,
} from 'lucide-react';
import { projectsApi, assessmentsApi } from '@/lib/api';
import { StatusBadge, SeverityBadge, MethodBadge } from '@/components/ui/severity-badge';
import { formatRelative, formatDuration, scoreToColor } from '@/lib/utils';
import type { Project } from '@/types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
  });

  const runMutation = useMutation({
    mutationFn: () => assessmentsApi.run(id),
    onSuccess: (assessment) => {
      toast.success('Assessment started!');
      qc.invalidateQueries({ queryKey: ['project', id] });
      router.push(`/assessments/${assessment.id}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to start assessment');
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
        <div className="h-48 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-400">
        Project not found
      </div>
    );
  }

  const latestAssessment = project.assessments?.[0];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                project.environment === 'PRODUCTION' ? 'bg-red-500/10 text-red-400' :
                project.environment === 'STAGING' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-emerald-500/10 text-emerald-400'
              }`}>
                {project.environment}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Globe className="w-3 h-3 text-slate-500" />
              <span className="text-slate-400 text-sm font-mono">{project.baseUrl}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => runMutation.mutate()}
          disabled={runMutation.isPending || !project.apiSpec}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          title={!project.apiSpec ? 'Import an API spec first' : 'Run security assessment'}
        >
          {runMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Run Assessment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* API Spec info */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">API Specification</h3>
          {project.apiSpec ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Title</span>
                <span className="text-white text-sm font-medium">{project.apiSpec.title || 'Untitled'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Version</span>
                <span className="text-white text-sm font-mono">{project.apiSpec.version || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Source</span>
                <span className="text-white text-sm">{project.apiSpec.source}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 text-sm">Endpoints</span>
                <span className="text-violet-400 text-sm font-bold">{project.apiSpec.endpoints?.length ?? 0}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-slate-500 text-sm mb-3">No API specification imported yet</p>
              <Link
                href={`/projects/${id}?edit=spec`}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Import OpenAPI Spec →
              </Link>
            </div>
          )}
        </div>

        {/* Latest Assessment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Latest Assessment</h3>
          {latestAssessment ? (
            <div className="space-y-3">
              <StatusBadge status={latestAssessment.status} />
              {latestAssessment.summary && (
                <>
                  <div className="text-center py-2">
                    <p className={`text-4xl font-black ${scoreToColor(latestAssessment.summary.securityScore)}`}>
                      {latestAssessment.summary.securityScore}
                    </p>
                    <p className="text-xs text-slate-500">Security Score</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg py-2">
                      <p className="text-sm font-bold text-red-400">{latestAssessment.summary.criticalCount}</p>
                      <p className="text-[10px] text-slate-500">Critical</p>
                    </div>
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg py-2">
                      <p className="text-sm font-bold text-orange-400">{latestAssessment.summary.highCount}</p>
                      <p className="text-[10px] text-slate-500">High</p>
                    </div>
                  </div>
                </>
              )}
              <Link
                href={`/assessments/${latestAssessment.id}`}
                className="flex items-center justify-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 mt-2 transition-colors"
              >
                View details <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-slate-500 text-sm">No assessments yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Endpoints */}
      {project.apiSpec?.endpoints && project.apiSpec.endpoints.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Endpoints ({project.apiSpec.endpoints.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
            {project.apiSpec.endpoints.slice(0, 30).map((ep) => (
              <div key={ep.id} className="flex items-center gap-3 px-5 py-3">
                <MethodBadge method={ep.method} />
                <span className="text-sm font-mono text-slate-300 flex-1 truncate">{ep.path}</span>
                {ep.summary && (
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">{ep.summary}</span>
                )}
              </div>
            ))}
            {project.apiSpec.endpoints.length > 30 && (
              <div className="px-5 py-3 text-xs text-slate-500">
                +{project.apiSpec.endpoints.length - 30} more endpoints
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Assessments */}
      {project.assessments && project.assessments.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl">
          <div className="px-5 py-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Assessment History</h3>
          </div>
          <div className="divide-y divide-slate-800/60">
            {project.assessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/assessments/${assessment.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/40 transition-colors group"
              >
                <StatusBadge status={assessment.status} />
                <div className="flex-1">
                  {assessment.summary && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`font-bold ${scoreToColor(assessment.summary.securityScore)}`}>
                        Score: {assessment.summary.securityScore}
                      </span>
                      <span className="text-red-400">{assessment.summary.criticalCount}C</span>
                      <span className="text-orange-400">{assessment.summary.highCount}H</span>
                      <span className="text-yellow-400">{assessment.summary.mediumCount}M</span>
                    </div>
                  )}
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{formatRelative(assessment.createdAt)}</p>
                  {assessment.duration && <p>{formatDuration(assessment.duration)}</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
