import { IconAlertOctagon, IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconShieldExclamation } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { Severity } from '@/types';

const SEVERITY_META: Record<Severity, { label: string; className: string; icon: React.ElementType }> = {
  CRITICAL: { label: 'Critical', className: 'severity-critical', icon: IconShieldExclamation },
  HIGH: { label: 'High', className: 'severity-high', icon: IconAlertOctagon },
  MEDIUM: { label: 'Medium', className: 'severity-medium', icon: IconAlertTriangle },
  LOW: { label: 'Low', className: 'severity-low', icon: IconAlertCircle },
  INFO: { label: 'Info', className: 'severity-info', icon: IconInfoCircle },
};

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export function SeverityBadge({ severity, className, size = 'md', showIcon = true }: SeverityBadgeProps) {
  const meta = SEVERITY_META[severity] ?? SEVERITY_META.INFO;
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wide',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1',
        meta.className,
        className,
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} aria-hidden="true" />}
      {meta.label}
    </span>
  );
}
