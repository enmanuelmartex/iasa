import { IconAlertTriangle, IconHelpCircle } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type ScoreStatus = 'UNAVAILABLE' | 'PROVISIONAL' | 'FINAL';

/**
 * Renders a security score together with its validity.
 *
 * A score is meaningless without its status, and the three outcomes must never
 * look interchangeable:
 *
 *   FINAL       a complete measurement
 *   PROVISIONAL a real measurement over incomplete coverage
 *   UNAVAILABLE no measurement at all — rendered as "—", never as 0 or 100
 *
 * The previous UI rendered a missing score as 0 or 100 depending on the code
 * path, which made an unscanned project look either perfect or catastrophic.
 */
export function ScoreDisplay({
  score,
  status,
  coveragePercent,
  reason,
  size = 'md',
  className,
}: {
  score: number | null;
  status: ScoreStatus;
  coveragePercent?: number | null;
  reason?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const unavailable = score === null || status === 'UNAVAILABLE';

  const numberClass = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }[size];

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            numberClass,
            'font-semibold tabular-nums',
            unavailable ? 'text-muted-foreground' : scoreToneClass(score!),
          )}
        >
          {unavailable ? '—' : score}
        </span>
        {!unavailable && <span className="text-sm text-muted-foreground">/100</span>}
      </div>

      {unavailable ? (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconHelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Security score unavailable
        </span>
      ) : status === 'PROVISIONAL' ? (
        <Badge variant="outline" className="w-fit gap-1 border-severity-medium/30 text-severity-medium">
          <IconAlertTriangle className="h-3 w-3" aria-hidden="true" />
          Provisional score
        </Badge>
      ) : null}

      {/* Coverage always travels with the score: a high score over low coverage
          is not the same result as a high score over full coverage. */}
      {coveragePercent != null && (
        <span className="text-xs text-muted-foreground">Coverage {coveragePercent}%</span>
      )}

      {reason && <span className="text-xs leading-relaxed text-muted-foreground">{reason}</span>}
    </div>
  );
}

function scoreToneClass(score: number): string {
  if (score >= 80) return 'text-severity-low';
  if (score >= 60) return 'text-severity-medium';
  if (score >= 40) return 'text-severity-high';
  return 'text-severity-critical';
}

/** Compact inline variant for table cells. */
export function ScoreCell({
  score,
  status,
}: {
  score: number | null;
  status: ScoreStatus;
}) {
  if (score === null || status === 'UNAVAILABLE') {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('text-sm font-semibold tabular-nums', scoreToneClass(score))}>{score}</span>
      {status === 'PROVISIONAL' && (
        <IconAlertTriangle
          className="h-3.5 w-3.5 text-severity-medium"
          aria-label="Provisional score"
        />
      )}
    </span>
  );
}
