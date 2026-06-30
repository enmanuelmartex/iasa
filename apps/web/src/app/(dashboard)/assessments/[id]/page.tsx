'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, Shield, Clock, Globe, FileText,
  Download, ChevronRight, Terminal, AlertTriangle,
} from 'lucide-react';
import { assessmentsApi, reportsApi } from '@/lib/api';
import { StatusBadge, SeverityBadge, MethodBadge } from '@/components/ui/severity-badge';
import { formatDate, formatDuration, scoreToColor } from '@/lib/utils';
import type { Assessment, ScanProgress, Finding } from '@/types';

const OWASP_LABELS: Record<string, string> = {
  'API1:2023': 'Broken Object Level Authorization',
  'API2:2023': 'Broken Authentication',
  'API3:2023': 'Broken Object Property Level Authorization',
  'API4:2023': 'Unrestricted Resource Consumption',
  'API5:2023': 'Broken Function Level Authorization',
  'API7:2023': 'Server Side Request Forgery',
  'API8:2023': 'Security Misconfiguration',
};

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'logs'>('overview');

  const { data: assessment, refetch } = useQuery<Assessment>({
    queryKey: ['assessment', id],
    queryFn: () => assessmentsApi.get(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'RUNNING' || status === 'QUEUED' ? 3000 : false;
    },
  });

  const isRunning = assessment?.status === 'RUNNING' || assessment?.status === 'QUEUED';

  // SSE progress stream
  useEffect(() => {
    if (!isRunning) return;

    const token = localStorage.getItem('iasa_token') || '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const es = new EventSource(`${apiUrl}/assessments/${id}/progress`, {});

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setProgress(data);
        if (data.completed || data.error) {
          es.close();
          refetch();
        }
      } catch {}
    };

    es.onerror = () => es.close();

    return () => es.close();
  }, [id, isRunning, refetch]);

  const findings = assessment?.findings || [];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${assessment?.projectId}`}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {assessment?.project?.name || 'Assessment'}
              </h1>
              {assessment && <StatusBadge status={assessment.status} />}
            </div>
            <div className="flex items-center gap-4 mt-0.5 text-xs text-slate-500">
              {assessment?.project?.baseUrl && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {assessment.project.baseUrl}
                </span>
              )}
              {assessment?.startedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(assessment.startedAt)}
                </span>
              )}
              {assessment?.duration && (
                <span>{formatDuration(assessment.duration)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {assessment?.status === 'COMPLETED' && (
            <div className="flex gap-2">
              {(['HTML', 'JSON', 'SARIF', 'MARKDOWN'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => reportsApi.generate(id, fmt)}
                  className="flex items-center gap-1.5 text-xs border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="w-3 h-3" />
                  {fmt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar (when running) */}
      {isRunning && (
        <div className="bg-slate-900 border border-violet-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-sm font-medium text-violet-400">
                {progress?.step || assessment?.currentStep || 'Initializing...'}
              </span>
            </div>
            <span className="text-sm font-bold text-white">
              {progress?.progress || assessment?.progress || 0}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress?.progress || assessment?.progress || 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{progress?.message || 'Running security checks...'}</span>
            <span>{progress?.findingsCount || 0} findings so far</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {assessment?.summary && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className="relative">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke={assessment.summary.securityScore >= 80 ? '#10b981' : assessment.summary.securityScore >= 60 ? '#eab308' : '#ef4444'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(assessment.summary.securityScore / 100) * 201} 201`}
                  strokeDashoffset="50"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-black ${scoreToColor(assessment.summary.securityScore)}`}>
                  {assessment.summary.securityScore}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">Security Score</p>
              <p className={`text-lg font-bold ${scoreToColor(assessment.summary.securityScore)}`}>
                {assessment.summary.riskLevel} Risk
              </p>
              <p className="text-xs text-slate-500">{assessment.summary.testedEndpoints} endpoints tested</p>
            </div>
          </div>

          {[
            { label: 'Critical', value: assessment.summary.criticalCount, color: 'text-red-400', bg: 'bg-red-500/5 border-red-500/10' },
            { label: 'High', value: assessment.summary.highCount, color: 'text-orange-400', bg: 'bg-orange-500/5 border-orange-500/10' },
            { label: 'Medium', value: assessment.summary.mediumCount, color: 'text-yellow-400', bg: 'bg-yellow-500/5 border-yellow-500/10' },
            { label: 'Low', value: assessment.summary.lowCount, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`bg-slate-900 border ${bg} rounded-xl p-4 text-center`}>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {(['overview', 'findings', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors -mb-px border-b-2 ${
              activeTab === tab
                ? 'text-violet-400 border-violet-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            {tab === 'findings' ? `Findings (${findings.length})` : tab}
          </button>
        ))}
      </div>

      {/* Findings Tab */}
      {activeTab === 'findings' && (
        <div className="space-y-3">
          {findings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Shield className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="text-white font-medium">No findings detected</p>
              <p className="text-slate-500 text-sm">The API passed all security checks</p>
            </div>
          ) : (
            findings.map((finding) => (
              <FindingRow key={finding.id} finding={finding} />
            ))
          )}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          {/* OWASP Coverage */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">OWASP API Security Coverage</h3>
            <div className="space-y-2">
              {Object.entries(OWASP_LABELS).map(([id, label]) => {
                const count = (assessment?.summary?.owaspCoverage as any)?.[id] || 0;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 w-16">{id.split(':')[0]}</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${count > 0 ? 'bg-red-500' : 'bg-emerald-500/30'}`}
                        style={{ width: count > 0 ? '100%' : '10%' }}
                      />
                    </div>
                    <span className={`text-xs font-medium w-4 text-right ${count > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {count}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[120px]">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Assessment Details</h3>
            <div className="space-y-3">
              <InfoRow label="Status" value={<StatusBadge status={assessment?.status || ''} />} />
              <InfoRow label="Started" value={assessment?.startedAt ? formatDate(assessment.startedAt) : 'N/A'} />
              <InfoRow label="Completed" value={assessment?.completedAt ? formatDate(assessment.completedAt) : 'N/A'} />
              <InfoRow label="Duration" value={assessment?.duration ? formatDuration(assessment.duration) : 'N/A'} />
              <InfoRow label="Total Findings" value={`${assessment?.summary?.totalFindings || 0}`} />
              <InfoRow label="Endpoints Tested" value={`${assessment?.summary?.testedEndpoints || 0} / ${assessment?.summary?.totalEndpoints || 0}`} />
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="scanner-terminal p-4 space-y-1 max-h-96 overflow-y-auto">
          {assessment?.logs?.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-xs font-mono">
              <span className="text-slate-600 flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`flex-shrink-0 w-12 ${
                log.level === 'error' ? 'text-red-400' :
                log.level === 'warn' ? 'text-yellow-400' :
                'text-emerald-400'
              }`}>
                [{log.level.toUpperCase()}]
              </span>
              {log.plugin && (
                <span className="text-violet-400 flex-shrink-0">[{log.plugin}]</span>
              )}
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
          {!assessment?.logs?.length && (
            <p className="text-slate-600 text-xs">No logs available</p>
          )}
        </div>
      )}
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <SeverityBadge severity={finding.severity} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{finding.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {finding.endpoint && <MethodBadge method={finding.endpoint.method} />}
            <span className="text-xs text-slate-500 font-mono truncate">
              {finding.affectedUrl || finding.endpoint?.path}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-right">
          {finding.cvssScore && (
            <span className="text-xs font-mono text-slate-400">CVSS {finding.cvssScore}</span>
          )}
          <span className="text-xs text-slate-500">{finding.owaspCategory}</span>
          <ChevronRight
            className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-800 space-y-4">
          <p className="text-sm text-slate-300 pt-4">{finding.description}</p>

          {finding.impact && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Impact</p>
              <p className="text-sm text-slate-400">{finding.impact}</p>
            </div>
          )}

          {finding.remediation && (
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Remediation</p>
              <pre className="text-xs text-slate-300 bg-slate-800/60 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                {finding.remediation}
              </pre>
            </div>
          )}

          {finding.aiAnalysis?.executiveSummary && (
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
                🤖 AI Analysis
              </p>
              <p className="text-sm text-slate-300">{finding.aiAnalysis.executiveSummary}</p>
            </div>
          )}

          {finding.references && finding.references.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">References</p>
              <ul className="space-y-0.5">
                {finding.references.map((ref, i) => (
                  <li key={i}>
                    <a
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-400 hover:text-violet-300 truncate"
                    >
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
