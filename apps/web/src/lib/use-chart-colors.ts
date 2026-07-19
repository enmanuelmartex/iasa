'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const VAR_NAMES = [
  'severity-critical',
  'severity-high',
  'severity-medium',
  'severity-low',
  'severity-info',
  'success',
  'primary',
  'border',
  'muted-foreground',
  'chart-1',
  'chart-2',
  'chart-3',
] as const;

type ChartColorKey = (typeof VAR_NAMES)[number];
type ChartColors = Record<ChartColorKey, string>;

const FALLBACK: ChartColors = {
  'severity-critical': 'hsl(0 84% 60%)',
  'severity-high': 'hsl(25 95% 53%)',
  'severity-medium': 'hsl(38 92% 50%)',
  'severity-low': 'hsl(199 89% 58%)',
  'severity-info': 'hsl(215 16% 57%)',
  success: 'hsl(142 71% 45%)',
  primary: 'hsl(217 91% 60%)',
  border: 'hsl(222 24% 18%)',
  'muted-foreground': 'hsl(215 20% 65%)',
  'chart-1': 'hsl(199 89% 58%)',
  'chart-2': 'hsl(217 91% 60%)',
  'chart-3': 'hsl(262 83% 66%)',
};

/**
 * Resolves the app's CSS custom properties (`--severity-critical`, etc.) into concrete
 * `hsl(...)` strings, recomputed on theme change — needed because SVG-based chart libraries
 * (Recharts) don't reliably resolve `var()` inside `fill`/`stroke` presentation attributes.
 */
export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(FALLBACK);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const next = { ...FALLBACK };
    for (const name of VAR_NAMES) {
      const value = styles.getPropertyValue(`--${name}`).trim();
      if (value) next[name] = `hsl(${value})`;
    }
    setColors(next);
  }, [resolvedTheme]);

  return colors;
}
