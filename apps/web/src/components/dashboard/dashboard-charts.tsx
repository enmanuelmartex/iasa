'use client';

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart } from 'recharts';
import { IconShieldCheck } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { EmptyState } from '@/components/ui/empty-state';
import { useChartColors } from '@/lib/use-chart-colors';

export const OWASP_CATEGORIES = [
  { id: 'API1:2023', label: 'API1', fullName: 'Broken Object Level Authorization' },
  { id: 'API2:2023', label: 'API2', fullName: 'Broken Authentication' },
  { id: 'API3:2023', label: 'API3', fullName: 'Broken Object Property Level Authorization' },
  { id: 'API4:2023', label: 'API4', fullName: 'Unrestricted Resource Consumption' },
  { id: 'API5:2023', label: 'API5', fullName: 'Broken Function Level Authorization' },
  { id: 'API6:2023', label: 'API6', fullName: 'Unrestricted Access to Sensitive Business Flows' },
  { id: 'API7:2023', label: 'API7', fullName: 'Server Side Request Forgery' },
  { id: 'API8:2023', label: 'API8', fullName: 'Security Misconfiguration' },
  { id: 'API9:2023', label: 'API9', fullName: 'Improper Inventory Management' },
  { id: 'API10:2023', label: 'API10', fullName: 'Unsafe Consumption of APIs' },
] as const;

export function getScoreEvaluation(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

export function SecurityScoreChart({ score, hasData }: { score: number; hasData: boolean }) {
  const maximumScore = 100;
  const securityScore = Math.min(maximumScore, Math.max(0, Number.isFinite(score) ? score : 0));
  const percentage = Math.round((securityScore / maximumScore) * 100);
  const chartData = [{ securityScore }];
  const config = {
    securityScore: { label: 'Overall Security Score', color: '#638cff' },
  } satisfies ChartConfig;

  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader>
        <CardTitle>Overall Security Score</CardTitle>
        <CardDescription>Average security posture across completed assessments</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 items-center justify-center px-4 py-5 sm:px-6 sm:py-6">
        {hasData ? (
          <div className="relative flex aspect-square w-full max-w-[15rem] shrink-0 items-center justify-center">
            <div aria-hidden="true" className="absolute aspect-square w-[80%] rounded-full bg-black" />
            <ChartContainer
              config={config}
              className="relative z-10 aspect-square h-auto w-full max-w-full"
              role="img"
              aria-label={`Overall security score: ${securityScore} out of ${maximumScore}.`}
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={-270}
                innerRadius="80%"
                outerRadius="90%"
                barSize={9}
              >
                <defs>
                  <linearGradient id="security-score-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c5cff" />
                    <stop offset="45%" stopColor="#638cff" />
                    <stop offset="100%" stopColor="#62d6ff" />
                  </linearGradient>
                </defs>
                <PolarAngleAxis type="number" domain={[0, maximumScore]} tick={false} axisLine={false} />
                <RadialBar
                  dataKey="securityScore"
                  fill="url(#security-score-gradient)"
                  background={{ fill: 'rgba(255, 255, 255, 0.08)' }}
                  cornerRadius={999}
                  isAnimationActive
                  animationDuration={650}
                  animationEasing="ease-out"
                />
                <ChartTooltip
                  cursor={false}
                  offset={18}
                  wrapperStyle={{ zIndex: 30, pointerEvents: 'none' }}
                  content={(
                    <ChartTooltipContent
                      hideLabel
                      hideIndicator
                      className="min-w-44 border-white/10 bg-popover/95 px-3 py-2.5 backdrop-blur-sm"
                      formatter={() => (
                        <div className="grid gap-1">
                          <span className="font-medium text-foreground">Overall Security Score</span>
                          <span className="text-base font-semibold tabular-nums text-foreground">
                            {securityScore} <span className="text-sm font-medium text-muted-foreground">/ {maximumScore}</span>
                          </span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                      )}
                    />
                  )}
                />
              </RadialBarChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold leading-none tracking-tight text-white tabular-nums">{securityScore}</div>
              <span className="mt-1.5 text-xs font-medium leading-none text-zinc-400 sm:text-sm">
                Score
              </span>
            </div>
          </div>
        ) : (
          <EmptyState icon={IconShieldCheck} title="No score available" description="Complete an assessment to calculate your security score." compact />
        )}
      </CardContent>
      {hasData && (
        <CardFooter className="border-t border-border/50 px-6 py-4 text-xs text-muted-foreground">
          Overall score across assessments in the last six months
        </CardFooter>
      )}
    </Card>
  );
}

type SeverityDatum = { key: string; name: string; value: number };

type SeverityChartDatum = SeverityDatum & {
  rawValue: number;
  chartValue: number;
  fill: string;
};

function buildSeverityChartData(data: SeverityDatum[], shades: string[]): SeverityChartDatum[] {
  return data.map((item, index) => {
    const rawValue = Math.max(0, Number.isFinite(item.value) ? item.value : 0);
    return {
      ...item,
      value: rawValue,
      rawValue,
      chartValue: rawValue,
      fill: shades[index] ?? shades[shades.length - 1],
    };
  });
}

function getFindingsTotal(data: SeverityChartDatum[]) {
  return data.reduce((sum, item) => sum + item.rawValue, 0);
}

function getSeverityPercentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export function FindingsSeverityChart({ data }: { data: SeverityDatum[] }) {
  const colors = useChartColors();
  const severityColors: Record<string, string> = {
    critical: colors['severity-critical'],
    high: colors['severity-high'],
    medium: colors['severity-medium'],
    low: colors['severity-low'],
    info: colors['severity-info'],
  };
  const shades = data.map((item) => severityColors[item.key] ?? colors['muted-foreground']);
  const chartData = buildSeverityChartData(data, shades);
  const total = getFindingsTotal(chartData);
  const maximum = Math.max(1, ...chartData.map((item) => item.chartValue));
  const config = Object.fromEntries(chartData.map((item) => [item.key, { label: item.name, color: item.fill }])) satisfies ChartConfig;

  return <Card className="h-full shadow-none">
    <CardHeader><CardTitle>Findings by Severity</CardTitle><CardDescription>Distribution across all scanned APIs</CardDescription></CardHeader>
    <CardContent className="flex min-h-[20rem] flex-col items-center px-5 pb-6">
      <ChartContainer
        config={config}
        className="h-[190px] w-full max-w-[300px] [&_.recharts-polar-grid-concentric-circle]:stroke-border/60 [&_.recharts-radial-bar-background-sector]:fill-muted/35"
        role="img"
        aria-label={`Findings by severity. ${total} total findings.`}
      >
        <RadialBarChart data={chartData} startAngle={90} endAngle={-270} innerRadius="28%" outerRadius="94%" barSize={9}>
          <PolarAngleAxis type="number" domain={[0, maximum]} tick={false} axisLine={false} />
          <PolarGrid gridType="circle" radialLines={false} stroke={colors.border} />
          <RadialBar dataKey="chartValue" background={{ fill: colors.border }} cornerRadius={8} isAnimationActive={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent
              hideLabel
              formatter={(_, __, item) => {
                const datum = item.payload as SeverityChartDatum;
                const percentage = getSeverityPercentage(datum.rawValue, total);
                return <div className="grid min-w-32 gap-1">
                  <span className="font-medium text-foreground">{datum.name}</span>
                  <span className="text-muted-foreground"><span className="font-mono font-medium tabular-nums text-foreground">{datum.rawValue.toLocaleString()}</span> findings</span>
                  {total > 0 && <span className="text-muted-foreground">{percentage}% of total</span>}
                </div>;
              }}
            />}
          />
        </RadialBarChart>
      </ChartContainer>

      <div className="mt-1 text-center" aria-live="polite">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{total.toLocaleString()}</div>
        <div className="text-[11px] text-muted-foreground">Total findings</div>
        {total === 0 && <div className="mt-1 text-[11px] text-muted-foreground">No findings detected</div>}
      </div>

      <div className="mt-6 grid w-full grid-cols-1 gap-x-6 gap-y-2.5 min-[380px]:grid-cols-2" aria-label="Severity totals">
        {chartData.map((item) => <div key={item.key} className="flex min-w-0 items-center justify-between gap-3 text-xs">
          <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
            <i aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="truncate">{item.name}</span>
          </span>
          <span className="font-medium tabular-nums">{item.rawValue.toLocaleString()}</span>
        </div>)}
      </div>
    </CardContent>
  </Card>;
}

export function OwaspCoverageRadar({ coverage }: { coverage: Record<string, number> }) {
  const colors = useChartColors();
  const data = OWASP_CATEGORIES.map((item) => ({ ...item, value: Math.min(100, Math.max(0, Number(coverage[item.id] ?? 0))) }));
  const hasCoverage = data.some((item) => item.value > 0);
  const config = { value: { label: 'Coverage', color: colors['muted-foreground'] } } satisfies ChartConfig;
  return <Card className="h-full shadow-none md:col-span-2 xl:col-span-1">
    <CardHeader><CardTitle>OWASP API Top 10 Coverage</CardTitle><CardDescription>Measured coverage from recent assessment results</CardDescription></CardHeader>
    <CardContent className="flex min-h-[20rem] items-center justify-center px-3 pb-5 sm:px-5">
      {hasCoverage ? <ChartContainer config={config} className="h-[290px] w-full max-w-[420px]"><RadarChart data={data} outerRadius="80%"><ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''} />} /><PolarGrid stroke={colors.border} /><PolarAngleAxis dataKey="label" tick={{ fill: colors['muted-foreground'], fontSize: 11 }} /><PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} /><Radar dataKey="value" stroke={colors['muted-foreground']} fill={colors['muted-foreground']} fillOpacity={0.16} dot={{ r: 2, fill: colors['chart-3'] }} /></RadarChart></ChartContainer> : <EmptyState icon={IconShieldCheck} title="Coverage unavailable" description="OWASP coverage will appear after compatible checks run." compact />}
    </CardContent>
  </Card>;
}
