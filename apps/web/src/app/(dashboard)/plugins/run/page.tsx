'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Zap, ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle,
  Play, ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { pluginsApi, projectsApi } from '@/lib/api';
import { Plugin, Project, SinglePluginRunResult } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'text-red-400', HIGH: 'text-orange-400',
  MEDIUM: 'text-yellow-400', LOW: 'text-blue-400', INFO: 'text-slate-400',
};

export default function RunPluginPage() {
  const router = useRouter();
  const [selectedPlugin, setSelectedPlugin] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [result, setResult] = useState<SinglePluginRunResult | null>(null);

  const { data: plugins = [] } = useQuery<Plugin[]>({
    queryKey: ['plugins'],
    queryFn: pluginsApi.list,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  const runMutation = useMutation({
    mutationFn: () => pluginsApi.run(selectedPlugin, selectedProject),
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Plugin finished — ${data.findingsCount} finding${data.findingsCount !== 1 ? 's' : ''}`);
    },
    onError: () => toast.error('Plugin execution failed'),
  });

  const plugin = plugins.find((p) => p.id === selectedPlugin);
  const canRun = selectedPlugin && selectedProject && !runMutation.isPending;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-semibold text-white">Run Plugin</h1>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Execute a single plugin against a project without running a full assessment. Useful for debugging and fast validation.
      </p>

      {/* Config */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Plugin select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Plugin</label>
          <div className="relative">
            <select
              value={selectedPlugin}
              onChange={(e) => setSelectedPlugin(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 appearance-none pr-8"
            >
              <option value="">Select a plugin…</option>
              {plugins
                .filter((p) => p.isEnabled)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          {plugin && (
            <p className="text-[11px] text-slate-500">{plugin.description}</p>
          )}
        </div>

        {/* Project select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Target Project</label>
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50 appearance-none pr-8"
            >
              <option value="">Select a project…</option>
              {(projects as Project[]).filter((p) => p.isActive && p.apiSpec).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.baseUrl}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={() => runMutation.mutate()}
          disabled={!canRun}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
            canRun
              ? 'bg-violet-600 hover:bg-violet-500 text-white'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed',
          )}
        >
          {runMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running {plugin?.name}…
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run {plugin?.name ?? 'Plugin'}
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          {/* Result header */}
          <div className={cn(
            'flex items-center gap-3 px-5 py-4 border-b border-slate-800',
            result.status === 'SUCCESS' ? 'bg-emerald-500/5' : 'bg-red-500/5',
          )}>
            {result.status === 'SUCCESS' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm font-semibold text-white">
                {result.status === 'SUCCESS' ? 'Execution Complete' : `Execution ${result.status}`}
              </p>
              <p className="text-xs text-slate-400">
                {result.pluginName} · {result.durationMs}ms · {result.findingsCount} finding{result.findingsCount !== 1 ? 's' : ''}
              </p>
            </div>
            {result.error && (
              <p className="ml-auto text-xs text-red-400 max-w-xs truncate">{result.error}</p>
            )}
          </div>

          {/* Findings */}
          {result.findings.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {result.findings.map((f, i) => (
                <div key={i} className="px-5 py-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-semibold', SEVERITY_COLORS[f.severity])}>
                      {f.severity}
                    </span>
                    <span className="text-xs font-medium text-white">{f.title}</span>
                    <span className="ml-auto text-[10px] text-slate-600 font-mono">{f.owaspCategory}</span>
                  </div>
                  {f.affectedUrl && (
                    <p className="text-[11px] text-slate-500 font-mono">{f.affectedUrl}</p>
                  )}
                  <p className="text-[11px] text-slate-400 line-clamp-2">{f.description}</p>
                </div>
              ))}
            </div>
          ) : result.status === 'SUCCESS' ? (
            <div className="px-5 py-8 text-center text-slate-500 text-sm">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-500/40" />
              No findings detected by this plugin.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
