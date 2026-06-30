'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  FolderOpen,
  Activity,
  Plus,
  ArrowRight,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { assessmentsApi } from '@/lib/api';
import { StatusBadge } from '@/components/ui/severity-badge';
import { formatRelative, formatDuration, scoreToColor } from '@/lib/utils';
import type { DashboardStats } from '@/types';

const OWASP_CATEGORIES = [
  { id: 'API1:2023', label: 'BOLA', fullName: 'Broken Object Level Auth' },
  { id: 'API2:2023', label: 'Broken Auth', fullName: 'Broken Authentication' },
  { id: 'API3:2023', label: 'Mass Assign', fullName: 'Mass Assignment' },
  { id: 'API4:2023', label: 'Rate Limit', fullName: 'Resource Consumption' },
  { id: 'API5:2023', label: 'BFLA', fullName: 'Broken Function Level Auth' },
  { id: 'API6:2023', label: 'Bus. Flows', fullName: 'Sensitive Business Flows' },
  { id: 'API7:2023', label: 'SSRF', fullName: 'Server Side Request Forgery' },
  { id: 'API8:2023', label: 'Misconfig', fullName: 'Security Misconfiguration' },
  { id: 'API9:2023', label: 'Inventory', fullName: 'Improper Inventory Mgmt' },
  { id: 'API10:2023', label: 'Unsafe API', fullName: 'Unsafe API Consumption' },
];

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280',
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: assessmentsApi.dashboard,
    refetchInterval: 30000,
  });

  const securityScore = stats?.avgSecurityScore ?? 0;

  const pieData = stats?.findings
    ? Object.entries(stats.findings).map(([key, value]) => ({
        name: key.toUpperCase(),
        value,
        color: SEVERITY_COLORS[key as keyof typeof SEVERITY_COLORS] || '#6b7280',
      }))
    : [];

  const radarData = OWASP_CATEGORIES.map((cat) => {
    const hasFindings = stats?.recentAssessments?.some((a) =>
      (a.summary?.owaspCoverage as any)?.[cat.id],
    );
    return {
      subject: cat.label,
      value: hasFindings ? 80 : 20,
      fullMark: 100,
    };
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Monitor your API security posture across all projects
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Security Score"
          value={`${securityScore}`}
          suffix="/100"
          icon={<Shield className="w-5 h-5" />}
          color={scoreToColor(securityScore)}
          description="Average across all assessments"
          trend={securityScore >= 70 ? 'up' : 'down'}
        />
        <MetricCard
          label="Critical Findings"
          value={`${stats?.findings?.critical ?? 0}`}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="text-red-400"
          description="Require immediate attention"
          danger={!!(stats?.findings?.critical && stats.findings.critical > 0)}
        />
        <MetricCard
          label="Projects"
          value={`${stats?.totalProjects ?? 0}`}
          icon={<FolderOpen className="w-5 h-5" />}
          color="text-violet-400"
          description="Active API projects"
        />
        <MetricCard
          label="Assessments"
          value={`${stats?.totalAssessments ?? 0}`}
          icon={<Activity className="w-5 h-5" />}
          color="text-blue-400"
          description="Completed security scans"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Security Score Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Overall Security Score</h3>
          <div className="relative">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="65" fill="none" stroke="#1e293b" strokeWidth="12" />
              <circle
                cx="80"
                cy="80"
                r="65"
                fill="none"
                stroke={
                  securityScore >= 80 ? '#10b981' : securityScore >= 60 ? '#eab308' : '#ef4444'
                }
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(securityScore / 100) * 408} 408`}
                strokeDashoffset="102"
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-4xl font-black ${scoreToColor(securityScore)}`}
              >
                {securityScore}
              </span>
              <span className="text-slate-500 text-xs">/ 100</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className={`text-sm font-semibold ${scoreToColor(securityScore)}`}>
              {securityScore >= 80 ? 'Good' : securityScore >= 60 ? 'Fair' : 'At Risk'}
            </span>
          </div>
        </div>

        {/* Findings by Severity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Findings by Severity</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
              No findings yet
            </div>
          )}
        </div>

        {/* OWASP Coverage Radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">OWASP API Top 10 Coverage</h3>
          <ResponsiveContainer width="100%" height={150}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
              <Radar
                name="Coverage"
                dataKey="value"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">Recent Assessments</h3>
          <Link
            href="/assessments"
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {!stats?.recentAssessments?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium">No assessments yet</p>
            <p className="text-slate-600 text-sm mt-1">Create a project and run your first scan</p>
            <Link
              href="/projects/new"
              className="mt-4 text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Get started
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {stats.recentAssessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/assessments/${assessment.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {assessment.project?.name}
                    </span>
                    <StatusBadge status={assessment.status} />
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {assessment.project?.baseUrl}
                  </p>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0 text-right">
                  {assessment.summary && (
                    <>
                      <div>
                        <p className={`text-sm font-bold ${scoreToColor(assessment.summary.securityScore)}`}>
                          {assessment.summary.securityScore}
                        </p>
                        <p className="text-[10px] text-slate-600">Score</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-400">{assessment.summary.criticalCount + assessment.summary.highCount}</p>
                        <p className="text-[10px] text-slate-600">Critical+High</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-xs text-slate-400">{formatRelative(assessment.createdAt)}</p>
                    {assessment.duration && (
                      <p className="text-[10px] text-slate-600">{formatDuration(assessment.duration)}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  icon,
  color,
  description,
  danger,
  trend,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  danger?: boolean;
  trend?: 'up' | 'down';
}) {
  return (
    <div
      className={`bg-slate-900 border rounded-xl p-5 ${
        danger ? 'border-red-500/20 bg-red-500/5' : 'border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <div className={`${color} opacity-60`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-black ${color}`}>{value}</span>
        {suffix && <span className="text-slate-500 text-sm">{suffix}</span>}
      </div>
      {description && <p className="text-[11px] text-slate-600 mt-1">{description}</p>}
    </div>
  );
}
