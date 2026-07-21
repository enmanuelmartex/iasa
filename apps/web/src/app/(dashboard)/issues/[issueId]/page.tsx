'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IconArrowLeft, IconBug, IconRobot, IconSearch } from '@tabler/icons-react';
import { toast } from 'sonner';
import { issuesApi } from '@/lib/api';
import type { IssueStatus, SecurityIssue } from '@/types';
import { ISSUE_STATUSES_REQUIRING_REASON } from '@/types';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { SeverityBadge } from '@/components/security/severity-badge';
import { StatusBadge } from '@/components/security/finding-status-badge';
import { MethodBadge } from '@/components/security/method-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

const STATUSES: IssueStatus[] = [
  'OPEN',
  'ACKNOWLEDGED',
  'RESOLVED',
  'ACCEPTED_RISK',
  'FALSE_POSITIVE',
];

export default function IssueDetailPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const queryClient = useQueryClient();

  const query = useQuery<SecurityIssue>({
    queryKey: ['issues', issueId],
    queryFn: () => issuesApi.get(issueId),
    enabled: Boolean(issueId),
  });

  const mutation = useMutation({
    mutationFn: (next: IssueStatus) => {
      let reason: string | undefined;
      if (ISSUE_STATUSES_REQUIRING_REASON.includes(next)) {
        const entered = window.prompt(`Why are you marking this issue as ${next.replace(/_/g, ' ').toLowerCase()}?`);
        if (!entered?.trim()) throw new Error('A reason is required for this decision.');
        reason = entered.trim();
      }
      return issuesApi.updateStatus(issueId, { status: next, reason });
    },
    onSuccess: (issue) => {
      queryClient.setQueryData(['issues', issueId], issue);
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue updated');
    },
    onError: (error: Error) => toast.error(error.message || 'Could not update the issue'),
  });

  if (query.isLoading) {
    return (
      <PageContainer>
        <Skeleton className="mb-6 h-16 w-80 max-w-full" />
        <Skeleton className="h-96 rounded-xl" />
      </PageContainer>
    );
  }

  const issue = query.data;
  if (!issue) {
    return (
      <PageContainer>
        <EmptyState icon={IconBug} title="Issue not found" description="It may have been deleted." />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/issues">
          <IconArrowLeft className="h-4 w-4" />
          Back to Issues
        </Link>
      </Button>

      <PageHeader title={issue.title} />

      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={issue.severity} size="sm" />
        <StatusBadge status={issue.status} />
        <Badge variant="outline">{issue.owaspCategory}</Badge>
        {issue.cweId && <Badge variant="outline">{issue.cweId}</Badge>}
        <span className="flex items-center gap-1.5 font-mono text-xs">
          <MethodBadge method={issue.method} />
          {issue.normalizedRoute}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconSearch className="h-4 w-4" />
                Scanner evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="leading-relaxed text-muted-foreground">{issue.description}</p>
            </CardContent>
          </Card>

          {/*
            Occurrence history is what distinguishes an issue from a detection:
            one row per scan that observed this same vulnerability.
          */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Occurrence history ({issue.occurrenceCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {issue.occurrences?.length ? (
                <ul className="divide-y divide-border text-sm">
                  {issue.occurrences.map((occurrence) => (
                    <li key={occurrence.id} className="flex items-center justify-between py-2.5">
                      <span className="flex items-center gap-2">
                        <SeverityBadge severity={occurrence.severitySnapshot} size="sm" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {occurrence.pluginIdSnapshot} v{occurrence.pluginVersionSnapshot}
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(occurrence.detectedAt)}
                        </span>
                        {occurrence.assessmentId && (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/assessments/${occurrence.assessmentId}`}>Open scan</Link>
                          </Button>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-muted-foreground">No occurrences recorded.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity and triage history</CardTitle>
            </CardHeader>
            <CardContent>
              {issue.statusChanges?.length ? (
                <ul className="divide-y divide-border text-sm">
                  {issue.statusChanges.map((change) => (
                    <li key={change.id} className="py-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          {change.fromStatus && <StatusBadge status={change.fromStatus} />}
                          <span className="text-muted-foreground">→</span>
                          <StatusBadge status={change.toStatus} />
                          {change.automatic && (
                            <Badge variant="outline" className="gap-1 text-[10px]">
                              <IconRobot className="h-3 w-3" />
                              Automatic
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(change.createdAt)}
                        </span>
                      </div>
                      {change.reason && (
                        <p className="mt-1 text-xs text-muted-foreground">{change.reason}</p>
                      )}
                      {change.actor && (
                        <p className="mt-0.5 text-xs text-muted-foreground/80">by {change.actor.name}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-muted-foreground">No status changes recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Triage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {STATUSES.map((next) => (
                <Button
                  key={next}
                  variant={issue.status === next ? 'default' : 'outline'}
                  size="sm"
                  disabled={mutation.isPending || issue.status === next}
                  onClick={() => mutation.mutate(next)}
                >
                  {next.replace(/_/g, ' ')}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Detail label="Security check" value={issue.pluginId} />
              <Detail label="Rule" value={issue.ruleId} mono />
              <Detail label="Component" value={issue.component} mono />
              <Detail label="First seen" value={formatDate(issue.firstSeenAt)} />
              <Detail label="Last seen" value={formatDate(issue.lastSeenAt)} />
              <Detail label="Occurrences" value={String(issue.occurrenceCount)} />
              <Detail label="Reopened" value={String(issue.reopenCount)} />
              {issue.cvssScore != null && <Detail label="CVSS" value={issue.cvssScore.toFixed(1)} />}
              {issue.project && <Detail label="Project" value={issue.project.name} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? 'text-right font-mono text-xs' : 'text-right'}>{value}</span>
    </div>
  );
}
