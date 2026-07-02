'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Puzzle, ToggleRight, ToggleLeft, CheckCircle,
  XCircle, Clock, Activity, AlertTriangle, Shield, Tag,
  Settings2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { pluginsApi } from '@/lib/api';
import { Plugin, PluginExecution } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatRelative } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'text-emerald-400 bg-emerald-500/10',
  FAILED:  'text-red-400 bg-red-500/10',
  TIMEOUT: 'text-yellow-400 bg-yellow-500/10',
  SKIPPED: 'text-slate-400 bg-slate-500/10',
};

export default function PluginDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [configOpen, setConfigOpen] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  const { data: plugin, isLoading } = useQuery<Plugin>({
    queryKey: ['plugin', id],
    queryFn: () => pluginsApi.get(id),
    onSuccess: (p) => {
      setConfigValues({ ...(p.defaultConfig ?? {}), ...(p.userConfig ?? {}) });
    },
  } as any);

  const toggleMutation = useMutation({
    mutationFn: (isEnabled: boolean) => pluginsApi.toggle(id, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin', id] });
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      toast.success('Plugin updated');
    },
  });

  const configMutation = useMutation({
    mutationFn: (config: Record<string, any>) => pluginsApi.saveConfig(id, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugin', id] });
      toast.success('Configuration saved');
    },
    onError: () => toast.error('Failed to save configuration'),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p>Plugin not found.</p>
      </div>
    );
  }

  const executions: PluginExecution[] = (plugin as any).recentExecutions ?? [];
  const findingsBySeverity: Record<string, number> = plugin.stats?.findingsBySeverity ?? {};
  const totalFindings = Object.values(findingsBySeverity).reduce((a, b) => a + b, 0);

  const fields = plugin.configSchema?.fields ?? [];

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <Puzzle className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-semibold text-white">{plugin.name}</h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            v{plugin.version}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-slate-400">{plugin.isEnabled ? 'Enabled' : 'Disabled'}</span>
          <button onClick={() => toggleMutation.mutate(!plugin.isEnabled)} disabled={toggleMutation.isPending}>
            {plugin.isEnabled ? (
              <ToggleRight className="w-7 h-7 text-violet-400 hover:text-violet-300" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-600 hover:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Info card */}
        <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {plugin.longDescription ?? plugin.description}
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {[
              { label: 'Author', value: plugin.author },
              { label: 'License', value: plugin.license },
              { label: 'Category', value: plugin.category },
              { label: 'Built-in', value: plugin.isBuiltin ? 'Yes' : 'No' },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <span className="text-slate-600 w-20 flex-shrink-0">{r.label}</span>
                <span className="text-slate-300">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-600">OWASP Mappings</p>
            <div className="flex flex-wrap gap-1">
              {plugin.owaspMappings.map((o) => (
                <span key={o} className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded text-[11px] text-violet-300 font-mono">
                  {o}
                </span>
              ))}
            </div>
          </div>
          {plugin.cweIds?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-600">CWE IDs</p>
              <div className="flex flex-wrap gap-1">
                {plugin.cweIds.map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-slate-800 rounded text-[11px] text-slate-400 border border-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs text-slate-600">Permissions</p>
            <div className="flex flex-wrap gap-1">
              {plugin.permissions.map((p) => (
                <span key={p} className="px-2 py-0.5 bg-slate-800/80 border border-slate-700 rounded text-[11px] text-slate-400 font-mono">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Statistics</p>
          {[
            { label: 'Total Runs', value: plugin.stats?.totalExecutions ?? 0, color: 'text-white' },
            { label: 'Success Rate', value: `${plugin.stats?.successRate ?? 0}%`, color: 'text-emerald-400' },
            { label: 'Avg Duration', value: plugin.stats?.avgDurationMs ? `${plugin.stats.avgDurationMs}ms` : '—', color: 'text-blue-400' },
            { label: 'Total Findings', value: totalFindings, color: 'text-yellow-400' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-slate-600 mb-0.5">{s.label}</p>
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            </div>
          ))}
          {Object.keys(findingsBySeverity).length > 0 && (
            <div className="space-y-1 pt-2 border-t border-slate-800">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map((sev) => {
                const count = findingsBySeverity[sev] ?? 0;
                if (!count) return null;
                const colors: Record<string, string> = { CRITICAL: 'text-red-400', HIGH: 'text-orange-400', MEDIUM: 'text-yellow-400', LOW: 'text-blue-400', INFO: 'text-slate-400' };
                return (
                  <div key={sev} className="flex items-center justify-between text-xs">
                    <span className={colors[sev]}>{sev}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Configuration */}
      {fields.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-white">Configuration</span>
            </div>
            {configOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {configOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-slate-800">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">{field.label}</label>
                  {field.description && <p className="text-[11px] text-slate-500">{field.description}</p>}
                  {field.type === 'boolean' ? (
                    <input
                      type="checkbox"
                      checked={!!configValues[field.key]}
                      onChange={(e) => setConfigValues((v) => ({ ...v, [field.key]: e.target.checked }))}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={configValues[field.key] ?? field.default}
                      onChange={(e) => setConfigValues((v) => ({ ...v, [field.key]: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
                    >
                      {field.options?.map((o) => (
                        <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={configValues[field.key] ?? field.default ?? ''}
                      min={field.min}
                      max={field.max}
                      onChange={(e) =>
                        setConfigValues((v) => ({
                          ...v,
                          [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={() => configMutation.mutate(configValues)}
                disabled={configMutation.isPending}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
              >
                {configMutation.isPending ? 'Saving…' : 'Save Configuration'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Execution history */}
      {executions.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Recent Executions
            </p>
          </div>
          <div className="divide-y divide-slate-800">
            {executions.slice(0, 10).map((exec) => (
              <div key={exec.id} className="flex items-center gap-4 px-5 py-3">
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', STATUS_STYLES[exec.status])}>
                  {exec.status}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {exec.durationMs ?? 0}ms
                </span>
                <span className="text-xs text-slate-400">
                  {exec.findingsCount} finding{exec.findingsCount !== 1 ? 's' : ''}
                </span>
                {exec.errorMessage && (
                  <span className="text-[11px] text-red-400 truncate max-w-xs">{exec.errorMessage}</span>
                )}
                <span className="ml-auto text-[10px] text-slate-600">{formatRelative(exec.startedAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
