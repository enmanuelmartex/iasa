'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Eye, EyeOff, Loader2, Zap, Trash2, Sparkles, Wifi, Info,
  CircleDot, Circle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { aiApi } from '@/lib/api';
import type { AiProviderConfig, AiProfile, AiEnvStatus, AiTestConnectionResult } from '@/types';

// ─── Provider Catalog ─────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4.1, o4-mini and the full OpenAI model family.',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/40',
    accent: 'text-emerald-400',
    ring: 'ring-emerald-500/20',
    icon: 'OA',
    iconBg: 'bg-emerald-950 text-emerald-400',
    models: [
      { id: 'gpt-4.1',     label: 'GPT-4.1',     badge: 'Latest' },
      { id: 'gpt-4o',      label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini', badge: 'Recommended' },
      { id: 'o4-mini',     label: 'o4 mini',      badge: 'Reasoning' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Claude Opus, Sonnet, and Haiku — advanced reasoning and safety.',
    color: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-500/40',
    accent: 'text-orange-400',
    ring: 'ring-orange-500/20',
    icon: 'CL',
    iconBg: 'bg-orange-950 text-orange-400',
    models: [
      { id: 'claude-opus-4-8',           label: 'Claude Opus 4.8',  badge: 'Most Capable' },
      { id: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6', badge: 'Balanced' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', badge: 'Fast' },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google Gemini 2.5 and 3.x — multimodal reasoning via Interactions API.',
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/40',
    accent: 'text-blue-400',
    ring: 'ring-blue-500/20',
    icon: 'GM',
    iconBg: 'bg-blue-950 text-blue-400',
    models: [
      { id: 'gemini-2.5-pro',         label: 'Gemini 2.5 Pro',         badge: 'Best Quality' },
      { id: 'gemini-2.5-flash',        label: 'Gemini 2.5 Flash',       badge: 'Recommended' },
      { id: 'gemini-3.5-flash',        label: 'Gemini 3.5 Flash',       badge: 'Latest' },
      { id: 'gemini-3.1-flash-lite',   label: 'Gemini 3.1 Flash-Lite',  badge: 'Fastest' },
    ],
  },
  {
    id: 'grok',
    name: 'Groq',
    description: 'Ultra-fast inference via Groq Cloud — Llama and GPT-OSS models.',
    color: 'from-cyan-500/20 to-sky-500/10',
    border: 'border-cyan-500/40',
    accent: 'text-cyan-400',
    ring: 'ring-cyan-500/20',
    icon: 'GQ',
    iconBg: 'bg-cyan-950 text-cyan-400',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B',     badge: 'Recommended' },
      { id: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B',      badge: 'Fastest' },
      { id: 'openai/gpt-oss-120b',     label: 'GPT-OSS 120B',      badge: 'Balanced' },
      { id: 'openai/gpt-oss-20b',      label: 'GPT-OSS 20B' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run any local model privately — no data leaves your infrastructure.',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/40',
    accent: 'text-violet-400',
    ring: 'ring-violet-500/20',
    icon: 'OL',
    iconBg: 'bg-violet-950 text-violet-400',
    models: [],
  },
] as const;

type ProviderId = typeof PROVIDERS[number]['id'];

const PROVIDER_MAP = Object.fromEntries(PROVIDERS.map((p) => [p.id, p]));

// ─── AI Profiles ─────────────────────────────────────────────────────────────

const PROFILES: Array<{ id: AiProfile; label: string; description: string; tags: string[] }> = [
  { id: 'minimal',  label: 'Minimal',  description: 'Critical findings only. Lowest cost.',          tags: ['Critical only', 'Executive summary'] },
  { id: 'balanced', label: 'Balanced', description: 'Critical + High. Best for most teams.',         tags: ['Critical + High', 'Executive summary'] },
  { id: 'complete', label: 'Complete', description: 'Every severity level gets analyzed.',           tags: ['All severities', 'Executive summary'] },
  { id: 'custom',   label: 'Custom',   description: 'Full manual control over what gets analyzed.',  tags: ['Manual selection'] },
];

const PROFILE_PRESETS: Record<string, Record<string, boolean>> = {
  minimal:  { analyzeCritical: true,  analyzeHigh: false, analyzeMedium: false, analyzeLow: false, executiveSummary: true },
  balanced: { analyzeCritical: true,  analyzeHigh: true,  analyzeMedium: false, analyzeLow: false, executiveSummary: true },
  complete: { analyzeCritical: true,  analyzeHigh: true,  analyzeMedium: true,  analyzeLow: true,  executiveSummary: true },
};

const PROVIDER_DEFAULTS: Record<string, Partial<FormState>> = {
  openai:  { model: 'gpt-4o-mini',             maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  claude:  { model: 'claude-haiku-4-5-20251001', maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  gemini:  { model: 'gemini-2.5-flash',          maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  grok:    { model: 'llama-3.3-70b-versatile',  maxTokens: 2000, temperature: 0.2, timeoutMs: 30000, maxFindings: 20 },
  ollama:  { model: 'llama3.2:3b',              maxTokens: 1000, temperature: 0.2, timeoutMs: 60000, maxFindings: 5, baseUrl: 'http://localhost:11434' },
};

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  apiKey:           string;
  apiKeyChanged:    boolean;
  model:            string;
  baseUrl:          string;
  profile:          AiProfile;
  analyzeCritical:  boolean;
  analyzeHigh:      boolean;
  analyzeMedium:    boolean;
  analyzeLow:       boolean;
  executiveSummary: boolean;
  maxTokens:        number;
  temperature:      number;
  timeoutMs:        number;
  maxFindings:      number;
  retryAttempts:    number;
}

function buildDefaultForm(provider: string): FormState {
  const d = PROVIDER_DEFAULTS[provider] ?? PROVIDER_DEFAULTS.openai;
  return {
    apiKey: '', apiKeyChanged: false,
    model:            d.model            ?? 'gpt-4o-mini',
    baseUrl:          d.baseUrl          ?? '',
    profile:          'balanced',
    analyzeCritical:  true,
    analyzeHigh:      true,
    analyzeMedium:    false,
    analyzeLow:       false,
    executiveSummary: true,
    maxTokens:        d.maxTokens        ?? 2000,
    temperature:      d.temperature      ?? 0.2,
    timeoutMs:        d.timeoutMs        ?? 30000,
    maxFindings:      d.maxFindings      ?? 20,
    retryAttempts:    2,
  };
}

function configToForm(cfg: AiProviderConfig): FormState {
  return {
    apiKey: '', apiKeyChanged: false,
    model:            cfg.model,
    baseUrl:          cfg.baseUrl          ?? '',
    profile:          cfg.profile,
    analyzeCritical:  cfg.analyzeCritical,
    analyzeHigh:      cfg.analyzeHigh,
    analyzeMedium:    cfg.analyzeMedium,
    analyzeLow:       cfg.analyzeLow,
    executiveSummary: cfg.executiveSummary,
    maxTokens:        cfg.maxTokens,
    temperature:      cfg.temperature,
    timeoutMs:        cfg.timeoutMs,
    maxFindings:      cfg.maxFindings,
    retryAttempts:    cfg.retryAttempts,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AiConfigTab() {
  const qc = useQueryClient();

  const { data: configs = [], isLoading } = useQuery<AiProviderConfig[]>({
    queryKey: ['ai', 'configs'],
    queryFn:  aiApi.getAllConfigs,
  });

  const [selectedProvider, setSelectedProvider] = useState<ProviderId>('openai');

  const providerConfig = configs.find((c) => c.provider === selectedProvider);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* ── Left: Provider List ─────────────────────────────────────────────── */}
      <div className="w-56 flex-shrink-0 space-y-1">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3 px-1">
          AI Providers
        </p>
        {PROVIDERS.map((p) => {
          const cfg     = configs.find((c) => c.provider === p.id);
          const selected = selectedProvider === p.id;

          return (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id as ProviderId)}
              className={cn(
                'w-full text-left px-3 py-3 rounded-xl border transition-all',
                selected
                  ? `bg-gradient-to-br ${p.color} ${p.border} shadow-sm ring-1 ${p.ring}`
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60',
              )}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0', p.iconBg)}>
                  {p.icon}
                </div>
                <span className={cn('text-sm font-semibold', selected ? 'text-white' : 'text-slate-300')}>
                  {p.name}
                </span>
              </div>
              <ProviderStatusLine cfg={cfg} providerId={p.id} selected={selected} />
            </button>
          );
        })}

        {/* Disable AI */}
        <DisableAiButton configs={configs} qc={qc} />
      </div>

      {/* ── Right: Provider Config Panel ──────────────────────────────────── */}
      <div className="flex-1 min-w-0">
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

function ProviderStatusLine({
  cfg,
  providerId,
  selected,
}: {
  cfg?: AiProviderConfig;
  providerId: string;
  selected: boolean;
}) {
  const p = PROVIDER_MAP[providerId as ProviderId];

  const statusLabel = cfg?.isActive
    ? 'Active'
    : cfg?.configSource === 'database'
      ? 'Configured'
      : cfg?.envHasKey
        ? 'Env only'
        : 'Not set';

  const statusColor = cfg?.isActive
    ? 'text-violet-400'
    : cfg?.configSource === 'database'
      ? 'text-emerald-400'
      : cfg?.envHasKey
        ? 'text-amber-400'
        : 'text-slate-600';

  const testDot = cfg?.lastTestedAt
    ? cfg.lastTestSuccess
      ? 'bg-emerald-400'
      : 'bg-red-400'
    : null;

  return (
    <div className="flex items-center gap-2 pl-0.5">
      <span className={cn('text-[11px] font-medium', statusColor)}>{statusLabel}</span>
      {testDot && (
        <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', testDot)} title={cfg?.lastTestMessage ?? ''} />
      )}
      {cfg?.envHasKey && !cfg?.isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Env var key present" />
      )}
    </div>
  );
}

// ─── Disable AI Button ────────────────────────────────────────────────────────

function DisableAiButton({
  configs,
  qc,
}: {
  configs: AiProviderConfig[];
  qc: ReturnType<typeof useQueryClient>;
}) {
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
      className="w-full mt-2 text-left px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs text-red-400 transition-colors"
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

  const [form, setForm]               = useState<FormState>(() =>
    config ? configToForm(config) : buildDefaultForm(providerId),
  );
  const [showKey, setShowKey]         = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [testResult, setTestResult]   = useState<AiTestConnectionResult | null>(null);
  const [isDirty, setIsDirty]         = useState(false);

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
        model:            form.model,
        apiKey:           form.apiKeyChanged ? form.apiKey : undefined,
        baseUrl:          form.baseUrl || undefined,
        profile:          form.profile,
        analyzeCritical:  form.analyzeCritical,
        analyzeHigh:      form.analyzeHigh,
        analyzeMedium:    form.analyzeMedium,
        analyzeLow:       form.analyzeLow,
        executiveSummary: form.executiveSummary,
        maxTokens:        form.maxTokens,
        temperature:      form.temperature,
        timeoutMs:        form.timeoutMs,
        maxFindings:      form.maxFindings,
        retryAttempts:    form.retryAttempts,
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
        apiKey:  form.apiKeyChanged ? form.apiKey : undefined,
        model:   form.model,
        baseUrl: form.baseUrl || undefined,
      }),
    onSuccess: (data) => {
      setTestResult(data);
      onSaved(); // refresh lastTested* in sidebar
      if (data.success) toast.success(`Connected to ${p.name} in ${data.latencyMs}ms`);
      else toast.error(data.message);
    },
    onError: () => setTestResult({ success: false, message: 'Connection test failed.' }),
  });

  const canTest = !testMut.isPending && (
    !requiresApiKey || hasExistingKey || Boolean(form.apiKey)
  );

  const activeProviderName = configs.find((c) => c.isActive)?.provider;
  const isAlreadyActive    = config?.isActive;
  const hasDbConfig        = config?.configSource === 'database';

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold', p.iconBg)}>
            {p.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">{p.name}</h3>
              {isAlreadyActive && (
                <span className="text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
              {config?.configSource === 'database' && !isAlreadyActive && (
                <span className="text-[10px] font-medium bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  Configured
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
          </div>
        </div>

        {/* Source + last test info */}
        {config?.lastTestedAt && (
          <div className={cn(
            'flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border',
            config.lastTestSuccess
              ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
              : 'text-red-400 bg-red-500/5 border-red-500/20',
          )}>
            {config.lastTestSuccess ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            Last tested {new Date(config.lastTestedAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* ── Credentials ─────────────────────────────────────────────────── */}
      <Section title="Credentials">
        <div className="space-y-4">
          {requiresApiKey && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">API Key</label>
              {!form.apiKeyChanged && hasExistingKey ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                    <span className="text-xs font-mono text-slate-400 flex-1">
                      {config?.maskedKey || '••••••••••••••••••••'}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  </div>
                  <button
                    onClick={() => { patch('apiKeyChanged', true); patch('apiKey', ''); }}
                    className="text-xs text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={form.apiKey}
                    onChange={(e) => { patch('apiKey', e.target.value); patch('apiKeyChanged', true); }}
                    placeholder={`Enter your ${p.name} API key`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
              {config?.envHasKey && !hasExistingKey && (
                <p className="flex items-center gap-1.5 text-xs text-amber-400 mt-1.5">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  Env var key detected — saving here will take priority.
                </p>
              )}
            </div>
          )}

          {providerId === 'ollama' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Ollama Server URL</label>
              <input
                type="url"
                value={form.baseUrl}
                onChange={(e) => patch('baseUrl', e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          )}

          <ModelSelector providerId={providerId} value={form.model} onChange={(m) => patch('model', m)} />
        </div>
      </Section>

      {/* ── Test Connection ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => testMut.mutate()}
          disabled={!canTest}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            canTest
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800',
          )}
        >
          {testMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
          {testMut.isPending ? 'Testing…' : 'Test Connection'}
        </button>
        {testResult && (
          <span className={cn('flex items-center gap-1.5 text-sm', testResult.success ? 'text-emerald-400' : 'text-red-400')}>
            {testResult.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {testResult.success ? `Connected in ${testResult.latencyMs}ms` : testResult.message}
          </span>
        )}
      </div>

      {/* ── Analysis Profile ─────────────────────────────────────────────── */}
      <Section title="Analysis Profile" description="Controls which findings are sent to the AI for enrichment">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PROFILES.map((pr) => (
            <button
              key={pr.id}
              onClick={() => selectProfile(pr.id)}
              className={cn(
                'text-left p-3.5 rounded-xl border transition-all',
                form.profile === pr.id
                  ? 'bg-violet-500/10 border-violet-500/40 text-white'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700',
              )}
            >
              <p className={cn('text-sm font-semibold', form.profile === pr.id ? 'text-violet-300' : 'text-slate-300')}>
                {pr.label}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pr.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {pr.tags.map((tag) => (
                  <span key={tag} className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded font-medium',
                    form.profile === pr.id ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-800 text-slate-500',
                  )}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {form.profile === 'custom' && (
          <div className="mt-4 p-4 bg-slate-800/40 border border-slate-700 rounded-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Custom Settings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { key: 'analyzeCritical',  label: 'Analyze Critical' },
                { key: 'analyzeHigh',      label: 'Analyze High' },
                { key: 'analyzeMedium',    label: 'Analyze Medium' },
                { key: 'analyzeLow',       label: 'Analyze Low' },
                { key: 'executiveSummary', label: 'Executive Summary' },
              ] as const).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-slate-300">{label}</span>
                  <Toggle enabled={form[key]} onChange={() => patch(key, !form[key])} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Advanced Settings ────────────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-3.5 text-left"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <p className="text-sm font-semibold text-white">Advanced Settings</p>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showAdvanced && (
          <div className="px-5 pb-5 border-t border-slate-800 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-400">Temperature</label>
                  <span className="text-xs font-mono text-violet-400">{form.temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.1"
                  value={form.temperature}
                  onChange={(e) => patch('temperature', parseFloat(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                  <span>Deterministic</span><span>Creative</span>
                </div>
              </div>
              <NumberField label="Max Tokens"    value={form.maxTokens}    onChange={(v) => patch('maxTokens', v)}    min={100}  max={8000}  hint="Per API call" />
              <NumberField label="Timeout (ms)"  value={form.timeoutMs}    onChange={(v) => patch('timeoutMs', v)}    min={5000} max={120000} hint="Per API call" />
              <NumberField label="Max Findings"  value={form.maxFindings}  onChange={(v) => patch('maxFindings', v)}  min={1}    max={100}   hint="Sent to AI per scan" />
              <NumberField label="Retry Attempts" value={form.retryAttempts} onChange={(v) => patch('retryAttempts', v)} min={0} max={5} hint="On failure" />
            </div>
          </div>
        )}
      </div>

      {/* ── Action Bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-1">
        {/* Save */}
        <button
          onClick={() => saveMut.mutate()}
          disabled={!isDirty || saveMut.isPending}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors',
            isDirty && !saveMut.isPending
              ? 'bg-violet-600 hover:bg-violet-500 text-white'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed',
          )}
        >
          {saveMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {saveMut.isPending ? 'Saving…' : 'Save Configuration'}
        </button>

        {/* Activate */}
        {!isAlreadyActive && (
          <button
            onClick={() => activateMut.mutate()}
            disabled={activateMut.isPending}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition-colors',
              activateMut.isPending
                ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                : 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50',
            )}
          >
            {activateMut.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CircleDot className="w-4 h-4" />
            )}
            Set as Active
          </button>
        )}

        {/* Active indicator */}
        {isAlreadyActive && (
          <span className="flex items-center gap-1.5 text-sm text-violet-400">
            <CircleDot className="w-4 h-4" />
            Active provider
          </span>
        )}

        {/* Remove */}
        {hasDbConfig && (
          <button
            onClick={() => deleteMut.mutate()}
            disabled={deleteMut.isPending}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 border border-slate-700 hover:border-red-500/30 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      {/* Active provider notice */}
      {activeProviderName && activeProviderName !== providerId && (
        <p className="text-xs text-slate-600">
          Currently active: <span className="text-slate-400 font-medium">{activeProviderName}</span>. Click "Set as Active" to switch.
        </p>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModelSelector({
  providerId, value, onChange,
}: {
  providerId: ProviderId; value: string; onChange: (m: string) => void;
}) {
  const provider = PROVIDER_MAP[providerId];
  const models   = provider?.models ?? [];

  if (providerId === 'ollama') {
    return (
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Model Name</label>
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="llama3.2:3b"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        <p className="text-xs text-slate-600 mt-1">Any model installed on your Ollama server.</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">Model</label>
      <div className="grid grid-cols-2 gap-2">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg border text-left text-xs transition-colors',
              value === m.id
                ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200',
            )}
          >
            <span className="font-mono">{m.label}</span>
            {'badge' in m && m.badge && (
              <span className={cn(
                'text-[10px] font-semibold px-1.5 py-0.5 rounded ml-1 flex-shrink-0',
                value === m.id ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-700 text-slate-500',
              )}>
                {m.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({
  title, description, children,
}: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn('relative w-9 h-5 rounded-full transition-colors flex-shrink-0', enabled ? 'bg-violet-600' : 'bg-slate-700')}
    >
      <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', enabled ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  );
}

function NumberField({
  label, value, onChange, min, max, hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type="number" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min} max={max}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
      />
      {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}
