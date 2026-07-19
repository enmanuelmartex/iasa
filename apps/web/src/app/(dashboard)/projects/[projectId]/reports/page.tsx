'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api';
import type { Report } from '@/types';
import { Button } from '@/components/ui/button';
import { ReportsTable } from '@/components/reports/reports-table';

export default function ProjectReportsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const reports = useQuery<Report[]>({ queryKey: ['reports'], queryFn: () => reportsApi.list() });
  const projectReports = (reports.data ?? []).filter((report) => report.assessment?.project?.id === projectId);

  return (
    <div className="space-y-4">
      {reports.isError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">Reports could not be loaded. Please try again.</p>}
      <ReportsTable reports={projectReports} isLoading={reports.isLoading} hideProjectColumn emptyAction={<Button asChild variant="outline"><Link href={`/projects/${projectId}`}>Back to project</Link></Button>} />
    </div>
  );
}
