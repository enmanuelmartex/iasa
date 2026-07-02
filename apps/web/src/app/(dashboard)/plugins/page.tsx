'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Puzzle, Shield, Search, Filter, ToggleLeft, ToggleRight,
  ChevronRight, Clock, AlertTriangle, CheckCircle, Tag,
  Zap, Lock, Layers, Activity, CloudCog, Settings2,
} from 'lucide-react';
import { pluginsApi } from '@/lib/api';
import { Plugin, PluginCategory } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<string, any> = {
  'Authentication': Lock,
  'Authorization': Shield,
  'Headers': Layers,
  'Injection': AlertTriangle,
  'API Design': Settings2,
  'Performance': Zap,
  'Infrastructure': CloudCog,
  'Compliance': CheckCircle,
  'AI': Activity,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Authentication': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Authorization': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Headers': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Injection': 'text-red-400 bg-red-500/10 border-red-500/20',
  'API Design': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  'Performance': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'Infrastructure': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Compliance': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'AI': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

export default function PluginsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: plugins = [], isLoading } = useQuery<Plugin[]>({
    queryKey: ['plugins'],
    queryFn: pluginsApi.list,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      pluginsApi.toggle(id, isEnabled),
    onSuccess: (_, { isEnabled }) => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      toast.success(isEnabled ? 'Plugin enabled' : 'Plugin disabled');
    },
    onError: () => toast.error('Failed to update plugin'),
  });

  const categories = ['all', ...Array.from(new Set(plugins.map((p) => p.category))).sort()];

  const filtered = plugins.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const enabledCount = plugins.filter((p) => p.isEnabled).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Puzzle className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-semibold text-white">Plugins</h1>
          </div>
          <p className="text-sm text-slate-400">
            Manage security plugins · {enabledCount} of {plugins.length} enabled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/plugins/run"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Run Plugin
          </Link>
          <Link
            href="/plugins/profiles"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Profiles
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Installed', value: plugins.length, color: 'text-white' },
          { label: 'Enabled', value: enabledCount, color: 'text-emerald-400' },
          { label: 'Disabled', value: plugins.length - enabledCount, color: 'text-slate-400' },
          {
            label: 'Categories',
            value: new Set(plugins.map((p) => p.category)).size,
            color: 'text-violet-400',
          },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + category filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plugins…"
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                selectedCategory === cat
                  ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                  : 'text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300',
              )}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plugin grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 animate-pulse h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Puzzle className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No plugins match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              onToggle={(isEnabled) =>
                toggleMutation.mutate({ id: plugin.id, isEnabled })
              }
              isToggling={toggleMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PluginCard({
  plugin,
  onToggle,
  isToggling,
}: {
  plugin: Plugin;
  onToggle: (v: boolean) => void;
  isToggling: boolean;
}) {
  const Icon = CATEGORY_ICONS[plugin.category] ?? Puzzle;
  const colorClass = CATEGORY_COLORS[plugin.category] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20';

  return (
    <div
      className={cn(
        'group bg-slate-900/60 border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200',
        plugin.isEnabled
          ? 'border-slate-700/60 hover:border-slate-600'
          : 'border-slate-800 opacity-60 hover:opacity-80',
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0', colorClass)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{plugin.name}</p>
            <p className="text-[11px] text-slate-500 font-mono">v{plugin.version}</p>
          </div>
        </div>
        <button
          onClick={() => onToggle(!plugin.isEnabled)}
          disabled={isToggling}
          className="flex-shrink-0 transition-colors"
          title={plugin.isEnabled ? 'Disable plugin' : 'Enable plugin'}
        >
          {plugin.isEnabled ? (
            <ToggleRight className="w-6 h-6 text-violet-400 hover:text-violet-300" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-slate-600 hover:text-slate-400" />
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{plugin.description}</p>

      {/* OWASP tags */}
      <div className="flex flex-wrap gap-1">
        {plugin.owaspMappings.map((owasp) => (
          <span key={owasp} className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono text-slate-400 border border-slate-700">
            {owasp}
          </span>
        ))}
        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border', colorClass)}>
          {plugin.category}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <div className="flex items-center gap-3 text-[10px] text-slate-600">
          {plugin.stats && (
            <>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {plugin.stats.totalExecutions} runs
              </span>
              {plugin.stats.avgDurationMs > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {plugin.stats.avgDurationMs}ms avg
                </span>
              )}
            </>
          )}
        </div>
        <Link
          href={`/plugins/${plugin.id}`}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-violet-400 transition-colors"
        >
          Details
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
