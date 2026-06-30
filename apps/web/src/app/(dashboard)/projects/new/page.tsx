'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Shield, Globe, Upload, Link2, Key, Lock } from 'lucide-react';
import { projectsApi } from '@/lib/api';

const ENVIRONMENTS = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'] as const;
const AUTH_TYPES = ['NONE', 'BEARER', 'BASIC', 'API_KEY', 'OAUTH2'] as const;
const SPEC_SOURCES = ['URL', 'UPLOAD', 'SKIP'] as const;

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<'project' | 'spec' | 'auth'>('project');
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    baseUrl: '',
    environment: 'DEVELOPMENT' as typeof ENVIRONMENTS[number],
  });

  const [specSource, setSpecSource] = useState<typeof SPEC_SOURCES[number]>('URL');
  const [specUrl, setSpecUrl] = useState('');
  const [specContent, setSpecContent] = useState('');

  const [authType, setAuthType] = useState<typeof AUTH_TYPES[number]>('NONE');
  const [authForm, setAuthForm] = useState({
    token: '',
    username: '',
    password: '',
    apiKey: '',
    apiKeyHeader: 'X-API-Key',
    clientId: '',
    clientSecret: '',
    tokenUrl: '',
  });

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const proj = await projectsApi.create(projectForm);
      setProjectId(proj.id);
      setStep('spec');
      toast.success('Project created!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  async function importSpec(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return;

    if (specSource === 'SKIP') {
      setStep('auth');
      return;
    }

    setLoading(true);
    try {
      if (specSource === 'URL') {
        await projectsApi.importFromUrl(projectId, specUrl);
        toast.success('OpenAPI spec imported!');
      } else if (specSource === 'UPLOAD') {
        const parsed = JSON.parse(specContent);
        await projectsApi.importFromContent(projectId, parsed);
        toast.success('OpenAPI spec uploaded!');
      }
      setStep('auth');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to import spec');
    } finally {
      setLoading(false);
    }
  }

  async function saveAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return;

    if (authType === 'NONE') {
      router.push(`/projects/${projectId}`);
      return;
    }

    setLoading(true);
    try {
      await projectsApi.saveAuth(projectId, {
        type: authType,
        ...authForm,
      });
      toast.success('Authentication configured!');
      router.push(`/projects/${projectId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save auth');
    } finally {
      setLoading(false);
    }
  }

  const steps = ['project', 'spec', 'auth'];
  const stepLabels = ['Project Details', 'API Specification', 'Authentication'];

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">New Project</h1>
            <p className="text-slate-400 text-sm">Set up a new API security project</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  step === s
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : steps.indexOf(step) > i
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s ? 'bg-violet-500 text-white' : steps.indexOf(step) > i ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {steps.indexOf(step) > i ? '✓' : i + 1}
                </span>
                {stepLabels[i]}
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-800" />}
            </div>
          ))}
        </div>

        {/* Step 1: Project Details */}
        {step === 'project' && (
          <form onSubmit={createProject} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-semibold text-white">Project Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Name *</label>
              <input
                required
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="My REST API"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Base URL *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  required
                  value={projectForm.baseUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, baseUrl: e.target.value })}
                  placeholder="https://api.example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Brief description of this API..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Environment</label>
              <div className="flex gap-2">
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => setProjectForm({ ...projectForm, environment: env })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      projectForm.environment === env
                        ? 'bg-violet-500/10 border-violet-500/40 text-violet-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Continue →
            </button>
          </form>
        )}

        {/* Step 2: API Spec */}
        {step === 'spec' && (
          <form onSubmit={importSpec} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-semibold text-white">API Specification</h2>
            </div>

            <div className="flex gap-2">
              {SPEC_SOURCES.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSpecSource(src)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    specSource === src
                      ? 'bg-violet-500/10 border-violet-500/40 text-violet-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {src === 'URL' ? 'From URL' : src === 'UPLOAD' ? 'Upload JSON' : 'Skip'}
                </button>
              ))}
            </div>

            {specSource === 'URL' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">OpenAPI/Swagger URL</label>
                <input
                  value={specUrl}
                  onChange={(e) => setSpecUrl(e.target.value)}
                  placeholder="https://api.example.com/openapi.json"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                />
                <p className="text-xs text-slate-500 mt-1.5">Supports OpenAPI 2.0 (Swagger) and 3.x formats</p>
              </div>
            )}

            {specSource === 'UPLOAD' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">OpenAPI JSON/YAML</label>
                <textarea
                  value={specContent}
                  onChange={(e) => setSpecContent(e.target.value)}
                  placeholder='Paste your OpenAPI specification JSON here...'
                  rows={8}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 font-mono resize-none"
                />
              </div>
            )}

            {specSource === 'SKIP' && (
              <div className="bg-slate-800/40 rounded-lg p-4 text-sm text-slate-400">
                You can import an API specification later from the project settings.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Continue →
            </button>
          </form>
        )}

        {/* Step 3: Auth */}
        {step === 'auth' && (
          <form onSubmit={saveAuth} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-semibold text-white">Authentication</h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {AUTH_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAuthType(type)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    authType === type
                      ? 'bg-violet-500/10 border-violet-500/40 text-violet-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {type === 'NONE' ? 'No Auth' : type === 'BEARER' ? 'Bearer' : type === 'BASIC' ? 'Basic' : type === 'API_KEY' ? 'API Key' : 'OAuth2'}
                </button>
              ))}
            </div>

            {authType === 'BEARER' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Bearer Token</label>
                <input
                  value={authForm.token}
                  onChange={(e) => setAuthForm({ ...authForm, token: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                />
                <p className="text-xs text-slate-500 mt-1.5">Use <code className="text-violet-400">{'{{TOKEN}}'}</code> for environment variables</p>
              </div>
            )}

            {authType === 'BASIC' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                  <input value={authForm.username} onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} placeholder="username" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500" />
                </div>
              </div>
            )}

            {authType === 'API_KEY' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">API Key</label>
                  <input value={authForm.apiKey} onChange={(e) => setAuthForm({ ...authForm, apiKey: e.target.value })} placeholder="your-api-key-here" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Header Name</label>
                  <input value={authForm.apiKeyHeader} onChange={(e) => setAuthForm({ ...authForm, apiKeyHeader: e.target.value })} placeholder="X-API-Key" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500" />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push(`/projects/${projectId}`)}
                className="flex-1 border border-slate-700 text-slate-300 hover:text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authType === 'NONE' ? 'Finish →' : 'Save & Finish →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
