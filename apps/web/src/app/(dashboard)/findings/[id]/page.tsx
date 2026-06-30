'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Shield, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { findingsApi } from '@/lib/api';
import { SeverityBadge, StatusBadge, MethodBadge } from '@/components/ui/severity-badge';
import { formatDate } from '@/lib/utils';
import type { Finding } from '@/types';

const STATUSES = ['OPEN', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED', 'ACCEPTED_RISK'];

export default function FindingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: finding, isLoading } = useQuery<Finding>({
    queryKey: ['finding', id],
    queryFn: () => findingsApi.get(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => findingsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['finding', id] });
      toast.success('Status updated');
    },
  });

  if (isLoading) return <div className="p-8"><div className="h-8 w-64 bg-slate-800 rounded animate-pulse" /></div>;
  if (!finding) return <div className="p-8 text-slate-400">Finding not found</div>;

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/findings" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <SeverityBadge severity={finding.severity} />
          <h1 className="text-xl font-bold text-white">{finding.title}</h1>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={finding.status} />
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">{finding.owaspCategory}</span>
        {finding.cweId && <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">{finding.cweId}</span>}
        {finding.cvssScore && <span className="text-xs text-slate-400">CVSS {finding.cvssScore}</span>}
        {finding.endpoint && (
          <div className="flex items-center gap-1.5">
            <MethodBadge method={finding.endpoint.method} />
            <code className="text-xs text-slate-300">{finding.endpoint.path}</code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main content */}
        <div className="col-span-2 space-y-4">
          <Section title="Description">
            <p className="text-sm text-slate-300 leading-relaxed">{finding.description}</p>
          </Section>

          {finding.impact && (
            <Section title="Impact">
              <p className="text-sm text-slate-300 leading-relaxed">{finding.impact}</p>
            </Section>
          )}

          {finding.remediation && (
            <Section title="Remediation" accent>
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {finding.remediation}
              </pre>
            </Section>
          )}

          {finding.httpRequest && (
            <Section title="HTTP Request">
              <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto">
                {finding.httpRequest}
              </pre>
            </Section>
          )}

          {finding.httpResponse && (
            <Section title="HTTP Response">
              <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto">
                {finding.httpResponse}
              </pre>
            </Section>
          )}

          {finding.aiAnalysis && (
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-5">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">🤖 AI Analysis</p>
              {finding.aiAnalysis.executiveSummary && (
                <p className="text-sm text-slate-300 mb-3">{finding.aiAnalysis.executiveSummary}</p>
              )}
              {finding.aiAnalysis.technicalAnalysis && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Technical Analysis</p>
                  <p className="text-sm text-slate-400">{finding.aiAnalysis.technicalAnalysis}</p>
                </div>
              )}
              {finding.aiAnalysis.businessImpact && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Business Impact</p>
                  <p className="text-sm text-slate-400">{finding.aiAnalysis.businessImpact}</p>
                </div>
              )}
            </div>
          )}

          {finding.references && finding.references.length > 0 && (
            <Section title="References">
              <ul className="space-y-1.5">
                {finding.references.map((ref, i) => (
                  <li key={i}>
                    <a
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Control */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Update Status</p>
            <div className="space-y-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => statusMutation.mutate(s)}
                  disabled={finding.status === s || statusMutation.isPending}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    finding.status === s
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Details</p>
            <div className="space-y-2.5">
              <Detail label="Plugin" value={finding.pluginId} mono />
              <Detail label="Category" value={finding.category} />
              <Detail label="OWASP" value={finding.owaspCategory} mono />
              {finding.cweId && <Detail label="CWE" value={finding.cweId} mono />}
              {finding.cvssScore && <Detail label="CVSS" value={String(finding.cvssScore)} />}
              <Detail label="Project" value={finding.assessment?.project?.name || ''} />
              <Detail label="Detected" value={formatDate(finding.createdAt)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`bg-slate-900 border rounded-xl p-5 ${accent ? 'border-emerald-500/20' : 'border-slate-800'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${accent ? 'text-emerald-400' : 'text-slate-400'}`}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs text-slate-300 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
