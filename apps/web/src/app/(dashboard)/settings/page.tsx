'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Settings2,
  Shield,
  Key,
  Bell,
  User,
  Info,
  ChevronRight,
  Copy,
  Check,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Terminal,
  Globe,
  Lock,
  Cpu,
  GitBranch,
  Zap,
  Sparkles,
  Users,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { AiConfigTab } from './ai-config-tab';
import { UsersTab } from './users-tab';
import { AuditLogsTab } from './audit-logs-tab';

type TabId = 'general' | 'security' | 'tokens' | 'notifications' | 'ai' | 'system' | 'about' | 'users' | 'audit-logs';

const ALL_TABS: { id: TabId; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: 'general',       label: 'General',          icon: Settings2 },
  { id: 'security',      label: 'Security',          icon: Shield },
  { id: 'tokens',        label: 'API Tokens',        icon: Key },
  { id: 'notifications', label: 'Notifications',     icon: Bell },
  { id: 'ai',            label: 'AI Configuration',  icon: Sparkles },
  { id: 'system',        label: 'System',            icon: Cpu },
  { id: 'about',         label: 'About',             icon: Info },
  { id: 'users',         label: 'Users',             icon: Users,         adminOnly: true },
  { id: 'audit-logs',   label: 'Audit Logs',        icon: ClipboardList, adminOnly: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    staleTime: 5 * 60_000,
  });

  const isAdmin = me?.role === 'ADMIN';
  const tabs = ALL_TABS.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage your account, security preferences and integrations
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {/* Non-admin tabs */}
            {tabs.filter((t) => !t.adminOnly).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                  activeTab === tab.id
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent',
                )}
              >
                <tab.icon className={cn('w-4 h-4 flex-shrink-0', activeTab === tab.id ? 'text-violet-400' : 'text-slate-500')} />
                {tab.label}
              </button>
            ))}

            {/* Admin section */}
            {isAdmin && (
              <>
                <div className="pt-4 pb-1.5 px-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Administration
                  </p>
                </div>
                {tabs.filter((t) => t.adminOnly).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                      activeTab === tab.id
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent',
                    )}
                  >
                    <tab.icon className={cn('w-4 h-4 flex-shrink-0', activeTab === tab.id ? 'text-violet-400' : 'text-slate-500')} />
                    {tab.label}
                  </button>
                ))}
              </>
            )}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general'       && <GeneralTab user={me} />}
          {activeTab === 'security'      && <SecurityTab />}
          {activeTab === 'tokens'        && <TokensTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'ai'            && <AiConfigTab />}
          {activeTab === 'system'        && <SystemTab />}
          {activeTab === 'about'         && <AboutTab />}
          {activeTab === 'users'         && isAdmin && <UsersTab currentUserId={me?.id ?? ''} />}
          {activeTab === 'audit-logs'    && isAdmin && <AuditLogsTab />}
        </div>
      </div>
    </div>
  );
}

// ─── GENERAL ──────────────────────────────────────────────────────────────────

function GeneralTab({ user }: { user: any }) {
  const [name, setName] = useState(user?.name ?? '');

  return (
    <div className="space-y-6">
      <Section title="Profile" description="Your public information">
        <div className="space-y-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-violet-400">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-flex items-center mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          <Field label="Display Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Your name"
            />
          </Field>

          <Field label="Email Address">
            <input
              value={user?.email ?? ''}
              readOnly
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-600 mt-1.5">Email changes require support contact</p>
          </Field>

          <button
            onClick={() => toast.success('Profile updated')}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Save changes
          </button>
        </div>
      </Section>

      <Section title="Preferences" description="Interface and behavior">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-800">
            <div>
              <p className="text-sm text-white">Theme</p>
              <p className="text-xs text-slate-500 mt-0.5">Application color scheme</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500">
              <option>Dark (Default)</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-800">
            <div>
              <p className="text-sm text-white">Timezone</p>
              <p className="text-xs text-slate-500 mt-0.5">Used for timestamps and scheduling</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
              <option>Europe/Berlin</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-white">Language</p>
              <p className="text-xs text-slate-500 mt-0.5">Interface language</p>
            </div>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500">
              <option>English (Default)</option>
              <option>Spanish</option>
              <option>Portuguese</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── SECURITY ─────────────────────────────────────────────────────────────────

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [current, setCurrent] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPwd.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setCurrent('');
    setNewPwd('');
    setConfirm('');
  }

  return (
    <div className="space-y-6">
      <Section title="Change Password" description="Update your authentication credentials">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Current password">
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>
          <Field label="New password">
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>
          <Field label="Confirm new password">
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </Field>
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Update password
          </button>
        </form>
      </Section>

      <Section title="Sessions" description="Active sessions and access history">
        <div className="space-y-3">
          <div className="flex items-center gap-4 py-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm text-white">Current session</p>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Web Browser · localhost</p>
            </div>
            <span className="text-xs text-slate-500">Now</span>
          </div>
          <p className="text-xs text-slate-600">Only the current session is shown. Multi-device session management coming in v0.2.</p>
        </div>
      </Section>

      <Section title="Danger Zone" description="Irreversible account actions">
        <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete Account</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently remove your account and all associated data.
              </p>
            </div>
            <button
              onClick={() => toast.error('Account deletion requires admin approval')}
              className="text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 text-xs font-medium px-3 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── TOKENS ───────────────────────────────────────────────────────────────────

const MOCK_TOKENS = [
  { id: '1', name: 'CI/CD Pipeline', preview: 'iasa_••••••••••••efg3', lastUsedAt: new Date(Date.now() - 3_600_000).toISOString(), createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(), scopes: ['read', 'write'] },
  { id: '2', name: 'Monitoring Script', preview: 'iasa_••••••••••••mno7', lastUsedAt: new Date(Date.now() - 86_400_000).toISOString(), createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(), scopes: ['read'] },
];

function TokensTab() {
  const [copied, setCopied] = useState<string | null>(null);
  const [tokens, setTokens] = useState(MOCK_TOKENS);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  function copyToken(preview: string) {
    navigator.clipboard.writeText(preview);
    setCopied(preview);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Token copied to clipboard');
  }

  function createToken() {
    if (!newName.trim()) return;
    const newToken = {
      id: String(Date.now()),
      name: newName,
      preview: `iasa_${'•'.repeat(12)}${Math.random().toString(36).slice(-4)}`,
      lastUsedAt: null as any,
      createdAt: new Date().toISOString(),
      scopes: ['read', 'write'],
    };
    setTokens((prev) => [newToken, ...prev]);
    setNewName('');
    setShowCreate(false);
    toast.success('API token created');
  }

  function deleteToken(id: string) {
    setTokens((prev) => prev.filter((t) => t.id !== id));
    toast.success('Token revoked');
  }

  return (
    <div className="space-y-6">
      <Section
        title="API Tokens"
        description="Manage tokens for programmatic access and integrations"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 border border-violet-500/20 hover:border-violet-500/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Token
          </button>
        }
      >
        {showCreate && (
          <div className="mb-4 p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
            <p className="text-sm font-medium text-white mb-3">Create new token</p>
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Token name (e.g. CI/CD Pipeline)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                onKeyDown={(e) => e.key === 'Enter' && createToken()}
                autoFocus
              />
              <button
                onClick={createToken}
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="text-slate-400 hover:text-white border border-slate-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {tokens.length === 0 ? (
          <div className="py-8 text-center">
            <Key className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No API tokens yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {tokens.map((token) => (
              <div key={token.id} className="flex items-center gap-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Key className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{token.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-mono text-slate-500">{token.preview}</span>
                    {token.scopes.map((s) => (
                      <span key={s} className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500 text-right flex-shrink-0">
                  <p>{token.lastUsedAt ? `Used ${new Date(token.lastUsedAt).toLocaleDateString()}` : 'Never used'}</p>
                  <p className="text-slate-600 mt-0.5">Created {new Date(token.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => copyToken(token.preview)}
                    className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Copy token"
                  >
                    {copied === token.preview ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteToken(token.id)}
                    className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/5 transition-colors"
                    title="Revoke token"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
        <div className="flex gap-3">
          <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-slate-300 mb-1">Token Security</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              API tokens grant programmatic access to IASA. Store them securely in environment variables
              — never commit to version control. Tokens can be revoked at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    scanComplete: true,
    criticalFindings: true,
    weeklyDigest: false,
    scanFailed: true,
    newReports: false,
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preference updated');
  }

  const items = [
    { key: 'scanComplete' as const, label: 'Scan completed', desc: 'When a security assessment finishes' },
    { key: 'criticalFindings' as const, label: 'Critical findings', desc: 'Immediate alert for critical vulnerabilities' },
    { key: 'scanFailed' as const, label: 'Scan failed', desc: 'When an assessment fails or is cancelled' },
    { key: 'newReports' as const, label: 'New reports', desc: 'When a new security report is generated' },
    { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of your security posture each week' },
  ];

  return (
    <div className="space-y-6">
      <Section title="In-App Notifications" description="What you see inside IASA">
        <div className="divide-y divide-slate-800/60">
          {items.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <Toggle enabled={prefs[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Email Notifications" description="Coming in v0.2">
        <div className="py-6 text-center">
          <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Email notifications are not configured yet</p>
          <p className="text-slate-600 text-xs mt-1">Configure SMTP settings in the system panel to enable this feature</p>
        </div>
      </Section>
    </div>
  );
}

// ─── SYSTEM ───────────────────────────────────────────────────────────────────

function SystemTab() {
  return (
    <div className="space-y-6">
      <Section title="System Information" description="Runtime and infrastructure details">
        <div className="space-y-0">
          {[
            { label: 'Platform', value: 'IASA API v1' },
            { label: 'Runtime', value: 'Bun 1.x + NestJS 10' },
            { label: 'Database', value: 'PostgreSQL 16' },
            { label: 'Queue', value: 'Redis 7 + BullMQ 5' },
            { label: 'Frontend', value: 'Next.js 15 + React 19' },
            { label: 'Scanner Plugins', value: '11 OWASP Plugins Active' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <span className="text-sm text-slate-400">{label}</span>
              <span className="text-sm text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Scanner Configuration" description="Active security plugins">
        <div className="space-y-2">
          {[
            { id: 'API1:2023', name: 'BOLA — Broken Object Level Authorization', active: true },
            { id: 'API2:2023', name: 'Broken Authentication', active: true },
            { id: 'API3:2023', name: 'Mass Assignment', active: true },
            { id: 'API4:2023', name: 'Unrestricted Resource Consumption', active: true },
            { id: 'API5:2023', name: 'BFLA — Broken Function Level Authorization', active: true },
            { id: 'API7:2023', name: 'Server Side Request Forgery (SSRF)', active: false },
            { id: 'API8:2023', name: 'Security Misconfiguration', active: true },
          ].map(({ id, name, active }) => (
            <div key={id} className="flex items-center gap-3 py-2">
              <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', active ? 'bg-emerald-400' : 'bg-slate-600')} />
              <span className="font-mono text-[10px] text-slate-500 w-20 flex-shrink-0">{id.split(':')[0]}</span>
              <span className="text-sm text-slate-300 flex-1">{name}</span>
              <span className={cn('text-[10px] font-semibold uppercase', active ? 'text-emerald-400' : 'text-slate-600')}>
                {active ? 'Active' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">IASA</h2>
        <p className="text-slate-400 text-sm">Intelligent API Security Assessment</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-slate-600 font-mono">v0.1.0</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
            Open Source MVP
          </span>
        </div>
      </div>

      <Section title="About This Project" description="Mission and objectives">
        <div className="prose prose-sm prose-invert max-w-none">
          <p className="text-slate-400 text-sm leading-relaxed">
            IASA is an open source platform for automated security evaluation of RESTful APIs,
            aligned with the <span className="text-violet-400 font-medium">OWASP API Security Top 10</span>.
            It detects vulnerabilities, generates professional reports, and allows managing
            multiple projects and users across organizations.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { icon: Zap, label: '11 OWASP Plugins', desc: 'Full API Top 10 2023 coverage' },
              { icon: GitBranch, label: 'Open Source', desc: 'MIT License — free forever' },
              { icon: Terminal, label: 'API-First', desc: 'REST API with Swagger docs' },
              { icon: Shield, label: 'OWASP Aligned', desc: 'API Security Top 10 2023' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-slate-800/50 border border-slate-800 rounded-xl p-3.5">
                <Icon className="w-4 h-4 text-violet-400 mb-2" />
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Stack" description="Technologies powering IASA">
        <div className="grid grid-cols-2 gap-2">
          {[
            'NestJS 10', 'Next.js 15', 'React 19', 'PostgreSQL 16',
            'Redis 7', 'BullMQ 5', 'Prisma ORM', 'TypeScript 5',
            'Bun Runtime', 'TanStack Query', 'Tailwind CSS', 'Recharts',
          ].map((tech) => (
            <div key={tech} className="flex items-center gap-2 py-1.5 text-sm text-slate-400">
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {tech}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors flex-shrink-0',
        enabled ? 'bg-violet-600' : 'bg-slate-700',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
          enabled ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  );
}
