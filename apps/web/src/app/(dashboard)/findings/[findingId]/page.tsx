'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IconArrowLeft, IconBug, IconExternalLink } from '@tabler/icons-react';
import { toast } from 'sonner';
import { findingsApi } from '@/lib/api';
import type { Finding, FindingStatus } from '@/types';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { SeverityBadge } from '@/components/security/severity-badge';
import { StatusBadge } from '@/components/security/finding-status-badge';
import { MethodBadge } from '@/components/security/method-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

const STATUSES: FindingStatus[] = ['OPEN', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED', 'ACCEPTED_RISK'];

export default function FindingDetailPage() {
  const { findingId } = useParams<{ findingId: string }>();
  const queryClient = useQueryClient();
  const query = useQuery<Finding>({ queryKey: ['findings', findingId], queryFn: () => findingsApi.get(findingId), enabled: Boolean(findingId) });
  const mutation = useMutation({
    mutationFn: (status: FindingStatus) => findingsApi.updateStatus(findingId, status),
    onSuccess: (finding) => { queryClient.setQueryData(['findings', findingId], finding); queryClient.invalidateQueries({ queryKey: ['findings'] }); toast.success('Finding status updated'); },
    onError: () => toast.error('The status could not be updated'),
  });

  if (query.isLoading) return <PageContainer><Skeleton className="h-9 w-72" /><Skeleton className="mt-6 h-80" /></PageContainer>;
  if (query.isError || !query.data) return <PageContainer><EmptyState icon={IconBug} title="Finding not found" description="It may have been deleted or you may not have access." action={<Button asChild variant="outline"><Link href="/findings">Back to findings</Link></Button>} /></PageContainer>;
  const finding = query.data;

  return <PageContainer>
    <PageHeader title={finding.title} description={`${finding.assessment?.project.name ?? 'Project'} · detected ${formatDate(finding.createdAt)}`} breadcrumb={<Link href="/findings" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><IconArrowLeft className="size-3" />Findings</Link>} actions={<><SeverityBadge severity={finding.severity} /><StatusBadge status={finding.status} /></>} />
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Section title="Description" text={finding.description} />
        <Section title="Impact" text={finding.impact} empty="No impact statement was produced." />
        <Section title="Remediation" text={finding.remediation} empty="No remediation guidance was produced." />
        {finding.aiAnalysis && <Card><CardHeader><CardTitle>AI security enrichment</CardTitle><CardDescription>Contextual guidance generated from the observed finding. Validate recommendations in the target environment before applying them.</CardDescription></CardHeader><CardContent className="space-y-4"><SectionBody label="Technical analysis" value={finding.aiAnalysis.technicalAnalysis} /><SectionBody label="Business impact" value={finding.aiAnalysis.businessImpact} /><ListBody label="Security best practices" items={finding.aiAnalysis.securityBestPractices} /><ListBody label="Validation steps" items={finding.aiAnalysis.validationSteps} /><ListBody label="Priority actions" items={finding.aiAnalysis.priorityActions} />{finding.aiAnalysis.confidence && <div className="flex gap-2"><Badge variant="secondary">Confidence: {finding.aiAnalysis.confidence}</Badge><Badge variant="outline">False-positive risk: {finding.aiAnalysis.falsePositiveRisk ?? '—'}</Badge></div>}</CardContent></Card>}
        {(finding.httpRequest || finding.httpResponse || finding.evidence) && <Card><CardHeader><CardTitle>Evidence</CardTitle><CardDescription>Captured scanner evidence. Secrets should be redacted by the producer.</CardDescription></CardHeader><CardContent className="space-y-3">{finding.httpRequest && <Evidence label="HTTP request" value={finding.httpRequest} />}{finding.httpResponse && <Evidence label="HTTP response" value={finding.httpResponse} />}{finding.evidence && <Evidence label="Structured evidence" value={JSON.stringify(finding.evidence, null, 2)} />}</CardContent></Card>}
      </div>
      <div className="space-y-4">
        <Card><CardHeader><CardTitle>Classification</CardTitle></CardHeader><CardContent><dl className="space-y-2 text-sm"><Row label="OWASP" value={finding.owaspCategory} /><Row label="CWE" value={finding.cweId ?? '—'} /><Row label="CVSS" value={finding.cvssScore?.toString() ?? '—'} /><Row label="Plugin" value={finding.pluginId} /></dl>{finding.endpoint && <div className="mt-4 flex items-center gap-2 rounded-md border p-3"><MethodBadge method={finding.endpoint.method} /><span className="truncate font-mono text-xs">{finding.endpoint.path}</span></div>}{finding.affectedUrl && <a href={finding.affectedUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1 break-all text-xs text-primary hover:underline">{finding.affectedUrl}<IconExternalLink className="size-3 shrink-0" /></a>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Lifecycle status</CardTitle><CardDescription>This disposition persists independently of the assessment snapshot.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2">{STATUSES.map((status) => <Button key={status} size="sm" variant={finding.status === status ? 'default' : 'outline'} disabled={mutation.isPending} onClick={() => mutation.mutate(status)}>{status.replaceAll('_', ' ')}</Button>)}</CardContent></Card>
        {finding.assessment && <Button asChild variant="outline" className="w-full"><Link href={`/assessments/${finding.assessment.id}`}>Open assessment</Link></Button>}
      </div>
    </div>
  </PageContainer>;
}

function Section({ title, text, empty }: { title: string; text?: string; empty?: string }) { return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{text || empty}</p></CardContent></Card>; }
function Evidence({ label, value }: { label: string; value: string }) { return <div><Badge variant="secondary" className="mb-2">{label}</Badge><pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 font-mono text-xs">{value}</pre></div>; }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-mono text-xs">{value}</dd></div>; }
function SectionBody({ label, value }: { label: string; value?: string }) { return value ? <div><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p></div> : null; }
function ListBody({ label, items }: { label: string; items?: string[] }) { return Array.isArray(items) && items.length ? <div><h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">{items.map((item, index) => <li key={`${label}-${index}`}>{item}</li>)}</ul></div> : null; }
