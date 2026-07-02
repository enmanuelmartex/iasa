'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Play, Zap, List, LayoutTemplate, AlertTriangle, Bot } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { profilesApi, pluginsApi, aiApi } from '@/lib/api';
import type { ScanProfile, Plugin, AiProviderStatus } from '@/types';

const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  claude: 'Claude',
  gemini: 'Gemini',
  grok:   'Groq',
  ollama: 'Ollama',
};

interface RunScanDialogProps {
  projectId: string;
  onClose: () => void;
  onRun: (config: {
    executionMode: 'all' | 'profile' | 'manual';
    scanProfileId?: string;
    manualPlugins?: string[];
    enableAiAnalysis: boolean;
  }) => void;
  isRunning: boolean;
}

export function RunScanDialog({ projectId: _projectId, onClose, onRun, isRunning }: RunScanDialogProps) {
  const [mode, setMode]               = useState<'all' | 'profile' | 'manual'>('all');
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [manualPlugins, setManualPlugins]     = useState<string[]>([]);
  const [enableAi, setEnableAi]       = useState(true);

  const { data: profiles = [] } = useQuery<ScanProfile[]>({
    queryKey: ['scan-profiles'],
    queryFn:  profilesApi.list,
  });

  const { data: plugins = [] } = useQuery<Plugin[]>({
    queryKey: ['plugins'],
    queryFn:  pluginsApi.list,
    enabled:  mode === 'manual',
  });

  const { data: aiStatus, isLoading: aiLoading } = useQuery<AiProviderStatus>({
    queryKey: ['ai', 'status'],
    queryFn:  aiApi.status,
    staleTime: 30_000,
  });

  const userProfiles   = profiles.filter((p) => !p.isSystem);
  const systemProfiles = profiles.filter((p) => p.isSystem);
  const allProfiles    = [...systemProfiles, ...userProfiles];

  function togglePlugin(id: string) {
    setManualPlugins((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  // AI is enabled but no provider is configured → block run
  const aiBlocksRun = enableAi && !aiLoading && aiStatus !== undefined && !aiStatus.available;

  function canRun() {
    if (aiBlocksRun) return false;
    if (mode === 'profile') return Boolean(selectedProfile);
    if (mode === 'manual')  return manualPlugins.length > 0;
    return true;
  }

  function handleRun() {
    onRun({
      executionMode: mode,
      scanProfileId: mode === 'profile' ? selectedProfile : undefined,
      manualPlugins: mode === 'manual'  ? manualPlugins  : undefined,
      enableAiAnalysis: enableAi,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white">Configure Scan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Choose how to run this assessment</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Execution mode ─────────────────────────────────────────────── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Execution Mode</p>
            <div className="space-y-2">
              {[
                { id: 'all',     icon: Zap,            label: 'All Enabled Plugins', desc: 'Run every plugin you have enabled globally' },
                { id: 'profile', icon: LayoutTemplate,  label: 'Scan Profile',        desc: 'Use a saved collection of plugins' },
                { id: 'manual',  icon: List,            label: 'Manual Selection',    desc: 'Pick plugins individually for this scan only' },
              ].map(({ id, icon: Icon, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setMode(id as typeof mode)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all',
                    mode === id
                      ? 'bg-violet-500/10 border-violet-500/40'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700',
                  )}
                >
                  <div className={cn('w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5', mode === id ? 'border-violet-500 bg-violet-500' : 'border-slate-600')} />
                  <div>
                    <p className={cn('text-sm font-medium', mode === id ? 'text-violet-300' : 'text-slate-300')}>
                      <Icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      {label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Profile selector ───────────────────────────────────────────── */}
          {mode === 'profile' && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Profile</p>
              {allProfiles.length === 0 ? (
                <p className="text-sm text-slate-500 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  No profiles available. Create one in Plugins → Profiles.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {allProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfile(p.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors',
                        selectedProfile === p.id
                          ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700',
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.description && <p className="text-xs text-slate-500">{p.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {p.isSystem && (
                          <span className="text-[10px] font-medium bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">System</span>
                        )}
                        <span className="text-xs text-slate-500">{p.enabledPlugins.length} plugins</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Manual plugin selector ─────────────────────────────────────── */}
          {mode === 'manual' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Plugins</p>
                <span className="text-xs text-slate-500">{manualPlugins.length} selected</span>
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {plugins.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlugin(p.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors',
                      manualPlugins.includes(p.id)
                        ? 'bg-violet-500/10 border-violet-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700',
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                      manualPlugins.includes(p.id) ? 'bg-violet-500 border-violet-500' : 'border-slate-600',
                    )}>
                      {manualPlugins.includes(p.id) && (
                        <span className="text-white text-[10px] font-bold">✓</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn('text-sm font-medium truncate', manualPlugins.includes(p.id) ? 'text-violet-300' : 'text-slate-300')}>
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{p.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── AI Analysis ────────────────────────────────────────────────── */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">AI Analysis</p>

                {/* Provider status line */}
                {aiLoading ? (
                  <p className="text-xs text-slate-600 mt-0.5">Checking provider…</p>
                ) : aiStatus?.available ? (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Bot className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    <span>
                      Provider:{' '}
                      <span className="text-violet-400 font-medium">
                        {PROVIDER_LABELS[aiStatus.provider] ?? aiStatus.provider}
                      </span>
                      {' · '}
                      <span className="font-mono">{aiStatus.model}</span>
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">No active provider configured</p>
                )}
              </div>

              <button
                onClick={() => setEnableAi(!enableAi)}
                className={cn(
                  'relative w-9 h-5 rounded-full transition-colors flex-shrink-0',
                  enableAi ? 'bg-violet-600' : 'bg-slate-700',
                )}
              >
                <span className={cn(
                  'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                  enableAi ? 'translate-x-4' : 'translate-x-0',
                )} />
              </button>
            </div>

            {/* Warning: AI enabled but no provider */}
            {enableAi && !aiLoading && aiStatus !== undefined && !aiStatus.available && (
              <div className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-300">No AI provider configured</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    AI Analysis requires an active provider.{' '}
                    <Link
                      href="/settings"
                      onClick={onClose}
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      Settings → AI Configuration
                    </Link>
                    {' '}or disable AI Analysis to proceed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            disabled={!canRun() || isRunning}
            title={
              aiBlocksRun
                ? 'Configure an AI provider or disable AI Analysis to continue'
                : undefined
            }
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors',
              canRun() && !isRunning
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed',
            )}
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Starting…' : 'Run Scan'}
          </button>
        </div>
      </div>
    </div>
  );
}
