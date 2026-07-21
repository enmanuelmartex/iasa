'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IconArrowLeft, IconDownload, IconFileAnalytics } from '@tabler/icons-react';
import { toast } from 'sonner';
import { reportsApi } from '@/lib/api';
import type { Report } from '@/types';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const report = useQuery<Report>({ queryKey: ['reports', reportId], queryFn: () => reportsApi.get(reportId), enabled: Boolean(reportId) });

  if (report.isLoading) return <PageContainer><Skeleton className="h-9 w-64" /><Skeleton className="mt-6 h-72 w-full" /></PageContainer>;
  if (report.isError || !report.data) return <PageContainer><EmptyState icon={IconFileAnalytics} title="Report not found" description="The report may have been deleted or you may not have access to it." action={<Button asChild variant="outline"><Link href="/reports">Back to reports</Link></Button>} /></PageContainer>;

  const data = report.data;
  const summary = data.assessment?.summary;
  const findings = data.assessment?.occurrences ?? [];
  const download = async () => {
    try { await reportsApi.generate(data.assessmentId, data.format, data.type); toast.success('Report downloaded'); }
    catch { toast.error('The report could not be downloaded.'); }
  };

  return (
    <PageContainer>
      <PageHeader title={data.title} description={`Generated ${new Date(data.generatedAt).toLocaleString()}`} breadcrumb={<Link href="/reports" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><IconArrowLeft className="size-3" />Reports</Link>} actions={<><Button asChild variant="outline"><Link href={`/assessments/${data.assessmentId}`}>View assessment</Link></Button><Button onClick={download}><IconDownload />Download {data.format}</Button></>} />
      <div className="grid gap-4 sm:grid-cols-3"><Card><CardHeader><CardDescription>Format</CardDescription><CardTitle><Badge variant="outline">{data.format}</Badge></CardTitle></CardHeader></Card><Card><CardHeader><CardDescription>Type</CardDescription><CardTitle className="text-base">{data.type}</CardTitle></CardHeader></Card><Card><CardHeader><CardDescription>Project</CardDescription><CardTitle className="text-base">{data.assessment?.project?.name ?? 'Unavailable'}</CardTitle></CardHeader></Card></div>
      <Card className="mt-4"><CardHeader><CardTitle>Assessment summary</CardTitle><CardDescription>Security results stored with this report.</CardDescription></CardHeader><CardContent>{summary ? <dl className="grid gap-4 sm:grid-cols-4"><Metric label="Security score" value={`${summary.securityScore == null ? "—" : Math.round(summary.securityScore)}/100`} /><Metric label="Endpoints tested" value={`${summary.testedEndpoints}/${summary.totalEndpoints}`} /><Metric label="Findings" value={summary.totalFindings} /><Metric label="Risk level" value={summary.riskLevel} /></dl> : <p className="text-sm text-muted-foreground">No summary is available.</p>}</CardContent></Card>
      <Card className="mt-4"><CardHeader><CardTitle>Findings</CardTitle><CardDescription>{findings.length} findings included in the underlying assessment.</CardDescription></CardHeader><CardContent className="space-y-2">{findings.length ? findings.slice(0, 20).map((finding) => <Link key={finding.id} href={`/findings/${finding.id}`} className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"><span className="truncate text-sm font-medium">{finding.titleSnapshot}</span><Badge variant="outline">{finding.severitySnapshot}</Badge></Link>) : <p className="text-sm text-muted-foreground">No findings were recorded.</p>}</CardContent></Card>
    </PageContainer>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-lg font-semibold">{value}</dd></div>; }
