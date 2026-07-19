import { cn } from '@/lib/utils';

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-success/10 text-success',
  POST: 'bg-primary/10 text-primary',
  PUT: 'bg-severity-medium/10 text-severity-medium',
  PATCH: 'bg-severity-high/10 text-severity-high',
  DELETE: 'bg-destructive/10 text-destructive',
  HEAD: 'bg-chart-3/10 text-chart-3',
  OPTIONS: 'bg-muted text-muted-foreground',
};

export function MethodBadge({ method, className }: { method: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-bold',
        METHOD_COLORS[method] || 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {method}
    </span>
  );
}
