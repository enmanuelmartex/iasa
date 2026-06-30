import { cn, severityToBg } from '@/lib/utils';
import type { Severity } from '@/types';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, className, size = 'md' }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border uppercase tracking-wider',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1',
        severityToBg(severity),
        className,
      )}
    >
      {severity}
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const colors: Record<string, string> = {
    OPEN: 'bg-red-500/10 text-red-400 border-red-500/20',
    CONFIRMED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    FALSE_POSITIVE: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    RESOLVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ACCEPTED_RISK: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    QUEUED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    RUNNING: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
    CANCELLED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border uppercase tracking-wider',
        colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        className,
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'RUNNING' && 'bg-violet-400 animate-pulse',
          status === 'COMPLETED' && 'bg-emerald-400',
          status === 'FAILED' && 'bg-red-400',
          status === 'PENDING' || status === 'QUEUED' ? 'bg-slate-400' : '',
        )}
      />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/10 text-emerald-400',
    POST: 'bg-blue-500/10 text-blue-400',
    PUT: 'bg-yellow-500/10 text-yellow-400',
    PATCH: 'bg-orange-500/10 text-orange-400',
    DELETE: 'bg-red-500/10 text-red-400',
    HEAD: 'bg-purple-500/10 text-purple-400',
    OPTIONS: 'bg-slate-500/10 text-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono text-[10px] font-bold px-2 py-0.5 rounded',
        colors[method] || 'bg-slate-500/10 text-slate-400',
      )}
    >
      {method}
    </span>
  );
}
