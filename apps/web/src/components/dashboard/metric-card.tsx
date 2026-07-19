import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export type MetricTone = 'success' | 'medium' | 'high' | 'critical' | 'muted' | 'brand' | 'cyan';

const TONE_CLASS: Record<MetricTone, string> = {
  success: 'text-foreground',
  medium: 'text-foreground',
  high: 'text-foreground',
  critical: 'text-foreground',
  muted: 'text-muted-foreground',
  brand: 'text-foreground',
  cyan: 'text-foreground',
};

interface MetricCardProps {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
  tone: MetricTone;
  description?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, suffix, icon, tone, description, highlight }: MetricCardProps) {
  return (
    <Card className={cn('min-h-36 shadow-none', highlight && 'border-foreground/20')}>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={cn('rounded-md border border-border bg-muted/60 p-2', TONE_CLASS[tone])}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn('text-3xl font-semibold tracking-tight tabular-nums', TONE_CLASS[tone])}>{value}</span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {description && <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
