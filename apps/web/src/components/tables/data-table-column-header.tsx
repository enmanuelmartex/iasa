import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

/**
 * Sorting is a direct toggle on the header: click cycles ascending →
 * descending → unsorted, and the arrow reflects the current state. Column
 * visibility lives in the toolbar's "Columns" menu instead.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-xs font-medium text-muted-foreground', className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      title={
        sorted === 'asc'
          ? 'Ordenado ascendente'
          : sorted === 'desc'
            ? 'Ordenado descendente'
            : 'Sin ordenar'
      }
      className={cn(
        '-ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium transition-colors',
        'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        sorted ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp className="size-3.5 shrink-0" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3.5 shrink-0" />
      ) : (
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" />
      )}
    </button>
  );
}
