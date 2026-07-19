'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconCircleCheck, IconCircleX, IconAlertTriangle, IconEye, IconEyeOff, IconBolt, IconTrash, IconWifi, IconCircleDot, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { aiApi } from '@/lib/api';
import type { AiProviderConfig, AiProfile, AiTestConnectionResult } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

// ─── Provider Catalog ─────────────────────────────────────────────────────────
// Each provider gets a distinct theme-token hue so cards stay recognizable
// without introducing a second, hardcoded color palette.

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4.1, o4-mini and the full OpenAI model family.',
    tone: 'success',
    icon: 'OA',
    models: [
      { id: 'gpt-4.1', label: 'GPT-4.1', badge: 'Latest' },
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini', badge: 'Recommended' },
      { id: 'o4-mini', label: 'o4 mini', badge: 'Reasoning' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Claude Opus, Sonnet, and Haiku — advanced reasoning and safety.',
    tone: 'severity-high',
    icon: 'CL',
    models: [
      { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', badge: 'Most Capable' },
      { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', badge: 'Balanced' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', badge: 'Fast' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google Gemini 2.5 and 3.x — multimodal reasoning via Interactions API.',
    tone: 'chart-2',
    icon: 'GM',
    models: [
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', badge: 'Best Quality' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', badge: 'Recommended' },
      { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', badge: 'Latest' },
      { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', badge: 'Fastest' },
    ],
  },
  {
    id: 'grok',
    name: 'Groq',
    description: 'Ultra-fast inference via Groq Cloud — Llama and GPT-OSS models.',
    tone: 'cyan',
    icon: 'GQ',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', badge: 'Recommended' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', badge: 'Fastest' },
      { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', badge: 'Balanced' },
      { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run any local model privately — no data leaves your infrastructure.',
    tone: 'chart-3',
    icon: 'OL',
    models: [],
  },
] as const;

type ProviderId = (typeof PROVIDERS)[number]['id'];

const PROVIDER_MAP = Object.fromEntries(PROVIDERS.map((p) => [p.id, p]));

const TONE_CLASSES: Record<string, { border: string; ring: string; bg: string; text: string; iconBg: string }> = {
  success: { border: 'border-success/40', ring: 'ring-success/20', bg: 'bg-success/10', text: 'text-success', iconBg: 'bg-success/15 text-success' },
  'severity-high': {
    border: 'border-severity-high/40',
    ring: 'ring-severity-high/20',
    bg: 'bg-severity-high/10',
    text: 'text-severity-high',
    iconBg: 'bg-severity-high/15 text-severity-high',
  },
  'chart-2': { border: 'border-chart-2/40', ring: 'ring-chart-2/20', bg: 'bg-chart-2/10', text: 'text-chart-2', iconBg: 'bg-chart-2/15 text-chart-2' },
  cyan: { border: 'border-cyan/40', ring: 'ring-cyan/20', bg: 'bg-cyan/10', text: 'text-cyan', iconBg: 'bg-cyan/15 text-cyan' },
  'chart-3': { border: 'border-chart-3/40', ring: 'ring-chart-3/20', bg: 'bg-chart-3/10', text: 'text-chart-3', iconBg: 'bg-chart-3/15 text-chart-3' },
};

// ─── AI Profiles ─────────────────────────────────────────────────────────────

const PROFILES: Array<{ id: AiProfile; label: string; description: string; tags: string[] }> = [
  { id: 'minimal', label: 'Minimal', description: 'Critical findings only. Lowest cost.', tags: ['Critical only', 'Executive summary'] },
  { id: 'balanced', label: 'Balanced', description: 'Critical + High. Best for most teams.', tags: ['Critical + High', 'Executive summary'] },
  { id: 'complete', label: 'Complete', description: 'Every severity level gets analyzed.', tags: ['All severities', 'Executive summary'] },
  { id: 'custom', label: 'Custom', description: 'Full manual control over what gets analyzed.', tags: ['Manual selection'] },
];

const PROFILE_PRESETS: Record<string, Record<string, boolean>> = {
  minimal: { analyzeCritical: true, analyzeHigh: false, analyzeMedium: false, analyzeLow: false, executiveSummary: true },
  balanced: { analyzeCritical: true, analyzeHigh: true, analyzeMedium: false, analyzeLow: false, executiveSummary: true },
  complete: { analyzeCritical: true, analyzeHigh: true, analyzeMedium: true, analyzeLow: true, executiveSummary: true },
};

const PROVIDER_DEFAULTS: Record<string, Partial<FormState>> = {
  openai: { model: 'gpt-4o-mini', maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  claude: { model: 'claude-haiku-4-5-20251001', maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  gemini: { model: 'gemini-2.5-flash', maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  grok: { model: 'llama-3.3-70b-versatile', maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  ollama: { model: 'llama3.2:3b', maxTokens: 1000, temperature: 0.2, timeoutMs: 60000, maxFindings: 5, baseUrl: 'http://localhost:11434' },
};

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  apiKey: string;
  apiKeyChanged: boolean;
  model: string;
  baseUrl: string;
  profile: AiProfile;
  analyzeCritical: boolean;
  analyzeHigh: boolean;
  analyzeMedium: boolean;
  analyzeLow: boolean;
  executiveSummary: boolean;
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
  maxFindings: number;
  retryAttempts: number;
}

function buildDefaultForm(provider: string): FormState {
  const d = PROVIDER_DEFAULTS[provider] ?? PROVIDER_DEFAULTS.openai;
  return {
    apiKey: '',
    apiKeyChanged: false,
    model: d.model ?? 'gpt-4o-mini',
    baseUrl: d.baseUrl ?? '',
    profile: 'balanced',
    analyzeCritical: true,
    analyzeHigh: true,
    analyzeMedium: false,
    analyzeLow: false,
    executiveSummary: true,
    maxTokens: d.maxTokens ?? 2000,
    temperature: d.temperature ?? 0.2,
    timeoutMs: d.timeoutMs ?? 30000,
    maxFindings: d.maxFindings ?? 20,
    retryAttempts: 2,
  };
}

function configToForm(cfg: AiProviderConfig): FormState {
  return {
    apiKey: '',
    apiKeyChanged: false,
    model: cfg.model,
    baseUrl: cfg.baseUrl ?? '',
    profile: cfg.profile,
    analyzeCritical: cfg.analyzeCritical,
    analyzeHigh: cfg.analyzeHigh,
    analyzeMedium: cfg.analyzeMedium,
    analyzeLow: cfg.analyzeLow,
    executiveSummary: cfg.executiveSummary,
    maxTokens: cfg.maxTokens,
    temperature: cfg.temperature,
    timeoutMs: cfg.timeoutMs,
    maxFindings: cfg.maxFindings,
    retryAttempts: cfg.retryAttempts,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AiConfigTab() {
  const qc = useQueryClient();

  const { data: configs = [], isLoading } = useQuery<AiProviderConfig[]>({
    queryKey: ['ai', 'configs'],
    queryFn: aiApi.getAllConfigs,
  });

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('openai');

  const providerConfig = configs.find((c) => c.provider === selectedProvider);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full space-y-2 lg:w-56">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 flex-1 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] flex-col gap-6 lg:flex-row">
      {/* Left: Provider List */}
      <div className="w-full flex-shrink-0 space-y-1 lg:w-56">
        <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">AI Providers</p>
        {PROVIDERS.map((p) => {
          const cfg = configs.find((c) => c.provider === p.id);
          const selected = selectedProvider === p.id;
          const tone = TONE_CLASSES[p.tone];

          return (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id as ProviderId)}
              className={cn(
                'w-full rounded-xl border px-3 py-3 text-left transition-all',
                selected ? cn(tone.bg, tone.border, 'shadow-sm ring-1', tone.ring) : 'border-border bg-card hover:border-foreground/20 hover:bg-accent',
              )}
            >
              <div className="mb-1.5 flex items-center gap-2.5">
                <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold', tone.iconBg)}>{p.icon}</div>
                <span className={cn('text-sm font-semibold', selected ? 'text-foreground' : 'text-muted-foreground')}>{p.name}</span>
              </div>
              <ProviderStatusLine cfg={cfg} />
            </button>
          );
        })}

        <DisableAiButton configs={configs} qc={qc} />
      </div>

      {/* Right: Provider Config Panel */}
      <div className="min-w-0 flex-1">
        <ProviderPanel
          key={selectedProvider}
          providerId={selectedProvider}
          config={providerConfig ?? null}
          configs={configs}
          onSaved={() => qc.invalidateQueries({ queryKey: ['ai', 'configs'] })}
        />
      </div>
    </div>
  );
}

// ─── Provider Status Line (sidebar) ──────────────────────────────────────────

function ProviderStatusLine({ cfg }: { cfg?: AiProviderConfig }) {
  const statusLabel = cfg?.isActive ? 'Active' : cfg?.configSource === 'database' ? 'Configured' : cfg?.envHasKey ? 'Env only' : 'Not set';

  const statusColor = cfg?.isActive ? 'text-primary' : cfg?.configSource === 'database' ? 'text-success' : cfg?.envHasKey ? 'text-severity-medium' : 'text-muted-foreground';

  const testDot = cfg?.lastTestedAt ? (cfg.lastTestSuccess ? 'bg-success' : 'bg-destructive') : null;

  return (
    <div className="flex items-center gap-2 pl-0.5">
      <span className={cn('text-[11px] font-medium', statusColor)}>{statusLabel}</span>
      {testDot && <div className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', testDot)} title={cfg?.lastTestMessage ?? ''} />}
      {cfg?.envHasKey && !cfg?.isActive && <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-severity-medium" title="Env var key present" />}
    </div>
  );
}

// ─── Disable AI Button ────────────────────────────────────────────────────────

function DisableAiButton({ configs, qc }: { configs: AiProviderConfig[]; qc: ReturnType<typeof useQueryClient> }) {
  const hasActive = configs.some((c) => c.isActive);

  const deactivateMut = useMutation({
    mutationFn: aiApi.deactivateAll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ai', 'configs'] });
      toast.success('AI analysis disabled.');
    },
    onError: () => toast.error('Failed to disable AI.'),
  });

  if (!hasActive) return null;

  return (
    <button
      onClick={() => deactivateMut.mutate()}
      disabled={deactivateMut.isPending}
      className="mt-2 w-full rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-left text-xs text-destructive transition-colors hover:bg-destructive/10"
    >
      Disable AI analysis
    </button>
  );
}

// ─── Provider Panel (right side) ─────────────────────────────────────────────

function ProviderPanel({
  providerId,
  config,
  configs,
  onSaved,
}: {
  providerId: ProviderId;
  config: AiProviderConfig | null;
  configs: AiProviderConfig[];
  onSaved: () => void;
}) {
  const p = PROVIDER_MAP[providerId];
  const tone = TONE_CLASSES[p.tone];

  const [form, setForm] = useState<FormState>(() => (config ? configToForm(config) : buildDefaultForm(providerId)));
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testResult, setTestResult] = useState<AiTestConnectionResult | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setIsDirty(true);
    setTestResult(null);
  }

  function selectProfile(profile: AiProfile) {
    const preset = PROFILE_PRESETS[profile];
    setForm((f) => ({ ...f, profile, ...(preset ?? {}) }));
    setIsDirty(true);
  }

  const requiresApiKey = providerId !== 'ollama';
  const hasExistingKey = Boolean(config?.hasKey);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const saveMut = useMutation({
    mutationFn: () =>
      aiApi.saveProviderConfig(providerId, {
        model: form.model,
        apiKey: form.apiKeyChanged ? form.apiKey : undefined,
        baseUrl: form.baseUrl || undefined,
        profile: form.profile,
        analyzeCritical: form.analyzeCritical,
        analyzeHigh: form.analyzeHigh,
        analyzeMedium: form.analyzeMedium,
        analyzeLow: form.analyzeLow,
        executiveSummary: form.executiveSummary,
        maxTokens: form.maxTokens,
        temperature: form.temperature,
        timeoutMs: form.timeoutMs,
        maxFindings: form.maxFindings,
        retryAttempts: form.retryAttempts,
      }),
    onSuccess: () => {
      onSaved();
      setIsDirty(false);
      toast.success(`${p.name} configuration saved.`);
    },
    onError: () => toast.error('Failed to save configuration.'),
  });

  const activateMut = useMutation({
    mutationFn: () => aiApi.activateProvider(providerId),
    onSuccess: () => {
      onSaved();
      toast.success(`${p.name} is now the active AI provider.`);
    },
    onError: () => toast.error('Failed to activate provider.'),
  });

  const deleteMut = useMutation({
    mutationFn: () => aiApi.deleteProviderConfig(providerId),
    onSuccess: () => {
      onSaved();
      setForm(buildDefaultForm(providerId));
      setIsDirty(false);
      toast.success(`${p.name} configuration removed.`);
    },
    onError: () => toast.error('Failed to remove configuration.'),
  });

  const testMut = useMutation({
    mutationFn: (): Promise<AiTestConnectionResult> =>
      aiApi.testProvider(providerId, {
        apiKey: form.apiKeyChanged ? form.apiKey : undefined,
        model: form.model,
        baseUrl: form.baseUrl || undefined,
      }),
    onSuccess: (data) => {
      setTestResult(data);
      onSaved();
      if (data.success) toast.success(`Connected to ${p.name} in ${data.latencyMs}ms`);
      else toast.error(data.message);
    },
    onError: () => setTestResult({ success: false, message: 'Connection test failed.' }),
  });

  const canTest = !testMut.isPending && (!requiresApiKey || hasExistingKey || Boolean(form.apiKey) || Boolean(config?.envHasKey));

  const isConfigured = !requiresApiKey || hasExistingKey || Boolean(form.apiKey) || Boolean(config?.envHasKey);

  const activeProviderName = configs.find((c) => c.isActive)?.provider;
  const isAlreadyActive = config?.isActive;
  const hasDbConfig = config?.configSource === 'database';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold', tone.iconBg)}>{p.icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
              {isAlreadyActive && (
                <Badge className="text-[10px] font-bold uppercase tracking-wider">Active</Badge>
              )}
              {config?.configSource === 'database' && !isAlreadyActive && (
                <Badge variant="secondary" className="text-[10px]">
                  Configured
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
          </div>
        </div>

        {config?.lastTestedAt && (
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px]',
              config.lastTestSuccess ? 'border-success/20 bg-success/5 text-success' : 'border-destructive/20 bg-destructive/5 text-destructive',
            )}
          >
            {config.lastTestSuccess ? <IconCircleCheck className="h-3 w-3" /> : <IconCircleX className="h-3 w-3" />}
            Last tested {new Date(config.lastTestedAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Credentials */}
      <Section title="Credentials">
        <div className="space-y-4">
          {requiresApiKey && (
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">API Key</Label>
              {!form.apiKeyChanged && hasExistingKey ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-input bg-muted/60 px-3 py-2">
                    <span className="flex-1 font-mono text-xs text-muted-foreground">{config?.maskedKey || '••••••••••••••••••••'}</span>
                    <IconCircleCheck className="h-3.5 w-3.5 flex-shrink-0 text-success" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      patch('apiKeyChanged', true);
                      patch('apiKey', '');
                    }}
                  >
                    Replace
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    value={form.apiKey}
                    onChange={(e) => {
                      patch('apiKey', e.target.value);
                      patch('apiKeyChanged', true);
                    }}
                    placeholder={`Enter your ${p.name} API key`}
                    autoComplete="off"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                  </button>
                </div>
              )}
              {config?.envHasKey && !hasExistingKey && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-severity-medium">
                  <IconAlertTriangle className="h-3 w-3 flex-shrink-0" />
                  Env var key detected — saving here will take priority.
                </p>
              )}
            </div>
          )}

          {providerId === 'ollama' && (
            <div>
              <Label htmlFor="ollama-url" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Ollama Server URL
              </Label>
              <Input id="ollama-url" type="url" value={form.baseUrl} onChange={(e) => patch('baseUrl', e.target.value)} placeholder="http://localhost:11434" />
            </div>
          )}

          <ModelSelector providerId={providerId} value={form.model} onChange={(m) => patch('model', m)} />
        </div>
      </Section>

      {/* Test Connection */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" disabled={!canTest} loading={testMut.isPending} onClick={() => testMut.mutate()}>
          {!testMut.isPending && <IconWifi className="h-4 w-4" />}
          {testMut.isPending ? 'Testing…' : 'Test Connection'}
        </Button>
        {testResult && (
          <span className={cn('flex items-center gap-1.5 text-sm', testResult.success ? 'text-success' : 'text-destructive')}>
            {testResult.success ? <IconCircleCheck className="h-4 w-4" /> : <IconCircleX className="h-4 w-4" />}
            {testResult.success ? `Connected in ${testResult.latencyMs}ms` : testResult.message}
          </span>
        )}
      </div>

      {/* Analysis Profile */}
      <Section title="Analysis Profile" description="Controls which findings are sent to the AI for enrichment">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PROFILES.map((pr) => (
            <button
              key={pr.id}
              onClick={() => selectProfile(pr.id)}
              className={cn(
                'rounded-xl border p-3.5 text-left transition-all',
                form.profile === pr.id ? 'border-primary/40 bg-primary/10' : 'border-border bg-muted/40 text-muted-foreground hover:border-foreground/20',
              )}
            >
              <p className={cn('text-sm font-semibold', form.profile === pr.id ? 'text-primary' : 'text-foreground')}>{pr.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{pr.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {pr.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', form.profile === pr.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {form.profile === 'custom' && (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Custom Settings</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  { key: 'analyzeCritical', label: 'Analyze Critical' },
                  { key: 'analyzeHigh', label: 'Analyze High' },
                  { key: 'analyzeMedium', label: 'Analyze Medium' },
                  { key: 'analyzeLow', label: 'Analyze Low' },
                  { key: 'executiveSummary', label: 'Executive Summary' },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-foreground">{label}</span>
                  <Switch checked={form[key]} onCheckedChange={(checked) => patch(key, checked)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Advanced Settings */}
      <Card className="overflow-hidden">
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 text-left">
            <p className="text-sm font-semibold text-foreground">Advanced Settings</p>
            {showAdvanced ? <IconChevronUp className="h-4 w-4 text-muted-foreground" /> : <IconChevronDown className="h-4 w-4 text-muted-foreground" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t border-border px-5 pb-5 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">Temperature</Label>
                  <span className="font-mono text-xs text-primary">{form.temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={form.temperature}
                  onChange={(e) => patch('temperature', parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
                  <span>Deterministic</span>
                  <span>Creative</span>
                </div>
              </div>
              <NumberField label="Max Tokens" value={form.maxTokens} onChange={(v) => patch('maxTokens', v)} min={100} max={8000} hint="Per API call" />
              <NumberField label="Timeout (ms)" value={form.timeoutMs} onChange={(v) => patch('timeoutMs', v)} min={5000} max={120000} hint="Per API call" />
              <NumberField label="Max Findings" value={form.maxFindings} onChange={(v) => patch('maxFindings', v)} min={1} max={100} hint="Sent to AI per scan" />
              <NumberField label="Retry Attempts" value={form.retryAttempts} onChange={(v) => patch('retryAttempts', v)} min={0} max={5} hint="On failure" />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button disabled={!isDirty} loading={saveMut.isPending} onClick={() => saveMut.mutate()}>
          {!saveMut.isPending && <IconBolt className="h-4 w-4" />}
          {saveMut.isPending ? 'Saving…' : 'Save Configuration'}
        </Button>

        {!isAlreadyActive && (
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              disabled={!isConfigured}
              loading={activateMut.isPending}
              title={!isConfigured ? `Add an API key for ${p.name} before activating` : undefined}
              onClick={() => activateMut.mutate()}
            >
              {!activateMut.isPending && <IconCircleDot className="h-4 w-4" />}
              Set as Active
            </Button>
            {!isConfigured && <p className="pl-1 text-[11px] text-muted-foreground">Save an API key first to enable activation.</p>}
          </div>
        )}

        {isAlreadyActive && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <IconCircleDot className="h-4 w-4" />
            Active provider
          </span>
        )}

        {hasDbConfig && (
          <DeleteConfirmationDialog
            title={`Remove ${p.name} configuration?`}
            description="The saved provider credentials and configuration will be permanently removed. This action cannot be undone."
            confirmLabel="Remove"
            isDeleting={deleteMut.isPending}
            onConfirm={() => deleteMut.mutateAsync()}
            trigger={<Button variant="ghost" size="sm" className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"><IconTrash />Remove</Button>}
          />
        )}
      </div>

      {activeProviderName && activeProviderName !== providerId && (
        <p className="text-xs text-muted-foreground">
          Currently active: <span className="font-medium text-foreground">{activeProviderName}</span>. Click &quot;Set as Active&quot; to switch.
        </p>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModelSelector({ providerId, value, onChange }: { providerId: ProviderId; value: string; onChange: (_m: string) => void }) {
  const provider = PROVIDER_MAP[providerId];
  const models = provider?.models ?? [];

  if (providerId === 'ollama') {
    return (
      <div>
        <Label htmlFor="ollama-model" className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Model Name
        </Label>
        <Input id="ollama-model" value={value} onChange={(e) => onChange(e.target.value)} placeholder="llama3.2:3b" />
        <p className="mt-1 text-xs text-muted-foreground">Any model installed on your Ollama server.</p>
      </div>
    );
  }

  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Model</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs transition-colors',
              value === m.id ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-muted/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground',
            )}
          >
            <span className="font-mono">{m.label}</span>
            {'badge' in m && m.badge && (
              <span className={cn('ml-1 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold', value === m.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>
                {m.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  hint,
}: {
  label: string;
  value: number;
  onChange: (_v: number) => void;
  min: number;
  max: number;
  hint?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
