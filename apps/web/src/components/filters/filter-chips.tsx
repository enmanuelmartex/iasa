'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type FilterChipItem = {
  id: string;
  label: string;
  onRemove: () => void;
};

export type FilterChipsProps = {
  chips: FilterChipItem[];
  onClear: () => void;
  clearLabel?: string;
  className?: string;
};

/**
 * Row of active filters below a filter bar. Animates in and out with a plain
 * fade + height (grid-rows trick), so it costs no measurement or JS.
 */
export function FilterChips({ chips, onClear, clearLabel = 'Limpiar', className }: FilterChipsProps) {
  return (
    <div
      className={cn(
        'grid transition-all duration-200 ease-out motion-reduce:transition-none',
        chips.length ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        className,
      )}
    >
      <div className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {chips.map((chip) => (
            <Badge key={chip.id} variant="secondary" className="h-6 gap-1 py-0 pl-2.5 pr-1 text-xs font-normal">
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Quitar filtro ${chip.label}`}
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {chips.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="h-6 rounded-full border border-border bg-transparent px-2.5 text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {clearLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
