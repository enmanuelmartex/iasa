'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  Key,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { usersApi } from '@/lib/api';
import { ManagedUser } from '@/types';
import { cn } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  ADMIN:   'Admin',
  ANALYST: 'Analyst',
  VIEWER:  'Viewer',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN:   'text-red-400 bg-red-500/10 border-red-500/20',
  ANALYST: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  VIEWER:  'text-slate-400 bg-slate-500/10 border-slate-600/30',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase',
        ROLE_COLORS[role] ?? ROLE_COLORS.VIEWER,
      )}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase',
        isActive
          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          : 'text-slate-500 bg-slate-800/60 border-slate-700',
      )}
    >
      {isActive ? 'Active' : 'Disabled'}
    </span>
  );
}

// ── Create User Modal ─────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
}

function CreateUserModal({ onClose }: CreateModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ANALYST' });
  const [showPwd, setShowPwd] = useState(false);

  const createMut = useMutation({
    mutationFn: () => usersApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created');
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to create user'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) return;
    createMut.mutate();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-base font-semibold text-white mb-4">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Jane Smith"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              placeholder="analyst@company.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Temporary password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none"
              >
                <option value="ADMIN">Admin — full access</option>
                <option value="ANALYST">Analyst — read + write scans</option>
                <option value="VIEWER">Viewer — read only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={createMut.isPending}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {createMut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create user
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Reset Password Modal ──────────────────────────────────────────────────────

function ResetPasswordModal({ user, onClose }: { user: ManagedUser; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const mut = useMutation({
    mutationFn: () => usersApi.resetPassword(user.id, password),
    onSuccess: () => {
      toast.success(`Password reset for ${user.name}`);
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to reset password'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-base font-semibold text-white mb-1">Reset Password</h2>
        <p className="text-xs text-slate-500 mb-4">Set a new password for <span className="text-slate-300">{user.name}</span></p>
        <div className="relative mb-4">
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => password.length >= 8 && mut.mutate()}
            disabled={mut.isPending || password.length < 8}
            className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {mut.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Reset password
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Row Actions Menu ──────────────────────────────────────────────────────────

function UserRowActions({
  user,
  currentUserId,
  onResetPassword,
}: {
  user: ManagedUser;
  currentUserId: string;
  onResetPassword: (u: ManagedUser) => void;
}) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const isSelf = user.id === currentUserId;

  const roleMut = useMutation({
    mutationFn: (role: string) => usersApi.changeRole(user.id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Role updated');
      setOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to update role'),
  });

  const statusMut = useMutation({
    mutationFn: () => usersApi.setStatus(user.id, !user.isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(user.isActive ? 'User disabled' : 'User enabled');
      setOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to update status'),
  });

  const deleteMut = useMutation({
    mutationFn: () => usersApi.remove(user.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
      setOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to delete user'),
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            {!isSelf && (
              <>
                {/* Role change submenu */}
                <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Change role
                </div>
                {(['ADMIN', 'ANALYST', 'VIEWER'] as const).filter((r) => r !== user.role).map((r) => (
                  <button
                    key={r}
                    onClick={() => roleMut.mutate(r)}
                    disabled={roleMut.isPending}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    Set as {ROLE_LABELS[r]}
                  </button>
                ))}
                <div className="border-t border-slate-800 my-1" />
              </>
            )}

            <button
              onClick={() => { onResetPassword(user); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <Key className="w-3.5 h-3.5" />
              Reset password
            </button>

            {!isSelf && (
              <>
                <button
                  onClick={() => statusMut.mutate()}
                  disabled={statusMut.isPending}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                >
                  {user.isActive
                    ? <><UserX className="w-3.5 h-3.5" /> Disable user</>
                    : <><UserCheck className="w-3.5 h-3.5" /> Enable user</>
                  }
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    if (confirm(`Delete ${user.name}? This cannot be undone.`)) deleteMut.mutate();
                  }}
                  disabled={deleteMut.isPending}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete user
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function UsersTab({ currentUserId }: { currentUserId: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: usersApi.list,
  });

  const filtered = users.filter(
    (u: ManagedUser) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Users</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage platform users and role assignments
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New user
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filtered.map((user: ManagedUser) => (
              <div key={user.id} className="flex items-center gap-4 py-3.5">
                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-violet-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    {user.id === currentUserId && (
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">you</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RoleBadge role={user.role} />
                  <StatusBadge isActive={user.isActive} />
                </div>
                <div className="text-xs text-slate-600 flex-shrink-0 hidden sm:block">
                  {user.lastLogin
                    ? `Last login ${new Date(user.lastLogin).toLocaleDateString()}`
                    : 'Never logged in'}
                </div>
                <UserRowActions
                  user={user}
                  currentUserId={currentUserId}
                  onResetPassword={setResetTarget}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
        <div className="flex gap-3">
          <Shield className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-slate-300 mb-1">Role Definitions</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">
                <span className="text-red-400 font-medium">Admin</span> — full platform access, user management, audit logs
              </p>
              <p className="text-xs text-slate-500">
                <span className="text-violet-400 font-medium">Analyst</span> — can create projects, run scans, manage findings
              </p>
              <p className="text-xs text-slate-500">
                <span className="text-slate-400 font-medium">Viewer</span> — read-only access to projects and reports
              </p>
            </div>
          </div>
        </div>
      </div>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} />}
      {resetTarget && <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} />}
    </div>
  );
}
