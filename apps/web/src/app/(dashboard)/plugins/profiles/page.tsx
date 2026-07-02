'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Filter, Plus, Trash2, Shield, Zap, Lock, Layers,
  List, CheckCircle, Puzzle, Edit2, X, Star,
} from 'lucide-react';
import { profilesApi, pluginsApi } from '@/lib/api';
import { ScanProfile, Plugin } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PROFILE_ICONS: Record<string, any> = {
  shield: Shield, zap: Zap, lock: Lock, layers: Layers,
  list: List, 'check-circle': CheckCircle, puzzle: Puzzle,
};

export default function ProfilesPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: profiles = [], isLoading } = useQuery<ScanProfile[]>({
    queryKey: ['scan-profiles'],
    queryFn: profilesApi.list,
  });

  const { data: plugins = [] } = useQuery<Plugin[]>({
    queryKey: ['plugins'],
    queryFn: pluginsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: profilesApi.delete,
    onMutate: (id) => {
      const previous = queryClient.getQueryData<ScanProfile[]>(['scan-profiles']);
      queryClient.setQueryData<ScanProfile[]>(['scan-profiles'], (old = []) =>
        old.filter((p) => p.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-profiles'] });
      toast.success('Profile deleted');
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['scan-profiles'], context.previous);
      }
      toast.error('Cannot delete system profiles');
    },
  });

  const systemProfiles = profiles.filter((p) => p.isSystem);
  const userProfiles = profiles.filter((p) => !p.isSystem);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Filter className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-semibold text-white">Scan Profiles</h1>
          </div>
          <p className="text-sm text-slate-400">Reusable plugin sets for targeted assessments</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Profile
        </button>
      </div>

      {/* System profiles */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3 h-3" />
          System Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systemProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} plugins={plugins} readOnly />
          ))}
        </div>
      </section>

      {/* User profiles */}
      {userProfiles.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                plugins={plugins}
                onDelete={() => deleteMutation.mutate(profile.id)}
                onEdit={() => setEditId(profile.id)}
              />
            ))}
          </div>
        </section>
      )}

      {userProfiles.length === 0 && !showCreate && (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
          <Puzzle className="w-7 h-7 mx-auto mb-2 opacity-40" />
          No custom profiles yet. Create one to save your preferred plugin set.
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateProfileModal
          plugins={plugins}
          onClose={() => setShowCreate(false)}
          onCreated={(newProfile: ScanProfile) => {
            queryClient.setQueryData<ScanProfile[]>(['scan-profiles'], (old = []) => [...old, newProfile]);
            setShowCreate(false);
            toast.success('Profile created');
          }}
        />
      )}
    </div>
  );
}

function ProfileCard({
  profile,
  plugins,
  readOnly,
  onDelete,
  onEdit,
}: {
  profile: ScanProfile;
  plugins: Plugin[];
  readOnly?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const Icon = PROFILE_ICONS[profile.icon ?? 'puzzle'] ?? Puzzle;
  const pluginNames = profile.enabledPlugins
    .map((id) => plugins.find((p) => p.id === id)?.name ?? id)
    .slice(0, 4);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5">
              {profile.name}
              {readOnly && (
                <span className="px-1 py-0.5 text-[9px] bg-slate-800 text-slate-500 rounded border border-slate-700">SYSTEM</span>
              )}
            </p>
            <p className="text-[11px] text-slate-500">{profile.enabledPlugins.length} plugins</p>
          </div>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button onClick={onEdit} className="p-1 text-slate-600 hover:text-slate-300 transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {profile.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{profile.description}</p>
      )}

      <div className="flex flex-wrap gap-1">
        {pluginNames.map((name) => (
          <span key={name} className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700">
            {name}
          </span>
        ))}
        {profile.enabledPlugins.length > 4 && (
          <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-500 border border-slate-700">
            +{profile.enabledPlugins.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
}

function CreateProfileModal({
  plugins,
  onClose,
  onCreated,
}: {
  plugins: Plugin[];
  onClose: () => void;
  onCreated: (profile: ScanProfile) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: () => profilesApi.create({ name, description, enabledPlugins: selected }),
    onSuccess: (data) => {
      onCreated(data);
    },
    onError: () => toast.error('Failed to create profile'),
  });

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">New Scan Profile</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Profile Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Profile"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description…"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Plugins ({selected.length} selected)</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
              {plugins.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left text-xs transition-colors',
                    selected.includes(p.id)
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700',
                  )}
                >
                  {selected.includes(p.id) && <CheckCircle className="w-3 h-3 flex-shrink-0" />}
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-700 text-slate-300 text-sm rounded-lg hover:border-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!name || selected.length === 0 || createMutation.isPending}
            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating…' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
