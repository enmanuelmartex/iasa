'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { IconDotsVertical, IconFileAnalytics, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import { reportsApi } from '@/lib/api';
import { formatDate, formatRelative } from '@/lib/utils';
import type { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { DataTable } from '@/components/tables/data-table';
import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ReportsTable({ reports, isLoading, hideProjectColumn = false, emptyAction }: { reports: Report[]; isLoading?: boolean; hideProjectColumn?: boolean; emptyAction?: React.ReactNode }) {
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: reportsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports-stats'] });
      toast.success('Report deleted');
    },
    onError: () => toast.error('The report could not be deleted.'),
  });

  const columns = useMemo<ColumnDef<Report>[]>(() => {
    const result: ColumnDef<Report>[] = [
      { accessorKey: 'title', header: ({ column }) => <DataTableColumnHeader column={column} title="Report" />, cell: ({ row }) => <Link href={`/reports/${row.original.id}`} className="text-sm font-medium hover:underline">{row.original.title}</Link> },
      { accessorKey: 'format', header: 'Format', cell: ({ row }) => <Badge variant="outline">{row.original.format}</Badge> },
      { accessorKey: 'type', header: 'Type', cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.type}</span> },
      { accessorKey: 'generatedAt', header: ({ column }) => <DataTableColumnHeader column={column} title="Generated" />, cell: ({ row }) => <div><p className="text-xs">{formatRelative(row.original.generatedAt)}</p><p className="text-[11px] text-muted-foreground">{formatDate(row.original.generatedAt)}</p></div> },
      { id: 'actions', cell: ({ row }) => <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${row.original.title}`}><IconDotsVertical /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href={`/reports/${row.original.id}`}>View report</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href={`/assessments/${row.original.assessmentId}`}>View assessment</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" disabled={remove.isPending} onSelect={() => remove.mutate(row.original.id)}><IconTrash />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu> },
    ];
    if (!hideProjectColumn) result.splice(1, 0, { id: 'project', accessorFn: (report) => report.assessment?.project?.name ?? '', header: 'Project', cell: ({ row }) => row.original.assessment?.project ? <Link href={`/projects/${row.original.assessment.project.id}`} className="text-sm hover:underline">{row.original.assessment.project.name}</Link> : <span className="text-muted-foreground">—</span> });
    return result;
  }, [hideProjectColumn, remove.isPending]);

  return <DataTable columns={columns} data={reports} isLoading={isLoading} getRowId={(report) => report.id} searchPlaceholder="Search reports…" emptyState={<EmptyState icon={IconFileAnalytics} title="No reports yet" description="Reports generated from completed assessments will appear here." action={emptyAction} compact />} />;
}
