'use client';

import * as React from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/** --popover matches --card in dark, so border and shadow do the separating. */
export const FILTER_SURFACE_CLASS =
  'z-[100] border-border bg-popover text-popover-foreground shadow-xl';

export type FilterPopoverProps = {
  /** Drives the indicator dot and the accessible label. */
  activeCount?: number;
  label?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

/**
 * Funnel button that opens an advanced-filter panel. The dot is the only cue
 * that filters are applied while the panel is closed, so it mirrors the count.
 */
export function FilterPopover({
  activeCount = 0,
  label = 'Filtros',
  contentClassName,
  children,
}: FilterPopoverProps) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative size-9 shrink-0 shadow-none"
              aria-label={activeCount ? `${label} (${activeCount} activos)` : label}
            >
              <Filter className="size-4" />
              {activeCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary"
                />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className={cn(FILTER_SURFACE_CLASS, contentClassName)}>
        {children}
      </PopoverContent>
    </Popover>
  );
}
