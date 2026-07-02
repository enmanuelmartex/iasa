'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordChecks(password: string) {
  return {
    length:  password.length >= 8,
    upper:   /[A-Z]/.test(password),
    lower:   /[a-z]/.test(password),
    number:  /\d/.test(password),
    special: /[@$!%*?&#^()_\-+=[\]{}|;':",./<>?]/.test(password),
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);

  // Touched state — each field shows errors only after the user has interacted
  const [touched, setTouched]   = useState({ name: false, email: false, password: false });
  const [nameError, setNameError]   = useState('');
  const [emailError, setEmailError] = useState('');

  const passwordChecks = getPasswordChecks(form.password);
  const passwordValid  = Object.values(passwordChecks).every(Boolean);

  // ── Field validators ───────────────────────────────────────────────────────

  function validateName(value: string): string {
    if (!value.trim()) return 'Full name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  }

  function validateEmail(value: string): string {
    if (!value) return 'Email is required';
    if (!EMAIL_RE.test(value)) return 'Invalid email format';
    return '';
  }

  // ── Change handlers ────────────────────────────────────────────────────────

  function handleNameChange(value: string) {
    setForm((f) => ({ ...f, name: value }));
    if (touched.name) setNameError(validateName(value));
  }

  function handleEmailChange(value: string) {
    setForm((f) => ({ ...f, email: value }));
    if (touched.email) setEmailError(validateEmail(value));
  }

  function handlePasswordChange(value: string) {
    setForm((f) => ({ ...f, password: value }));
    // Password requirements update live — no separate error needed
  }

  // ── Blur handlers ──────────────────────────────────────────────────────────

  function handleNameBlur() {
    setTouched((t) => ({ ...t, name: true }));
    setNameError(validateName(form.name));
  }

  function handleEmailBlur() {
    setTouched((t) => ({ ...t, email: true }));
    setEmailError(validateEmail(form.email));
  }

  function handlePasswordBlur() {
    setTouched((t) => ({ ...t, password: true }));
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Force all touched so errors appear
    setTouched({ name: true, email: true, password: true });
    const ne = validateName(form.name);
    const ee = validateEmail(form.email);
    setNameError(ne);
    setEmailError(ee);
    if (ne || ee || !passwordValid) return;

    setLoading(true);
    try {
      const data = await authApi.register(form);
      localStorage.setItem('iasa_token', data.accessToken);
      localStorage.setItem('iasa_user', JSON.stringify(data.user));
      toast.success('Account created! Welcome to IASA.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-bg px-4">
      <div className="absolute inset-0 bg-glow-purple pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">IASA</span>
          </div>
          <p className="text-slate-400 text-sm">Intelligent API Security Assessment</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-1">Create an account</h1>
          <p className="text-slate-400 text-sm mb-6">Start securing your APIs in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Jane Smith"
                autoComplete="name"
                className={cn(
                  'w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors',
                  nameError && touched.name
                    ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-slate-700 focus:ring-violet-500/50 focus:border-violet-500',
                )}
              />
              {nameError && touched.name && (
                <p className="mt-1.5 text-xs text-red-400">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="analyst@company.com"
                autoComplete="email"
                className={cn(
                  'w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors',
                  emailError && touched.email
                    ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-slate-700 focus:ring-violet-500/50 focus:border-violet-500',
                )}
              />
              {emailError && touched.email && (
                <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={handlePasswordBlur}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={cn(
                    'w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors',
                    touched.password && !passwordValid
                      ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                      : touched.password && passwordValid
                        ? 'border-emerald-500/40 focus:ring-emerald-500/30 focus:border-emerald-500'
                        : 'border-slate-700 focus:ring-violet-500/50 focus:border-violet-500',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live password requirements — shown as soon as user starts typing */}
              {(form.password.length > 0 || touched.password) && (
                <div className="mt-2.5 space-y-1">
                  {[
                    { key: 'length',  label: 'At least 8 characters' },
                    { key: 'upper',   label: 'One uppercase letter'  },
                    { key: 'lower',   label: 'One lowercase letter'  },
                    { key: 'number',  label: 'One number'            },
                    { key: 'special', label: 'One special character' },
                  ].map(({ key, label }) => {
                    const ok = passwordChecks[key as keyof typeof passwordChecks];
                    return (
                      <div key={key} className="flex items-center gap-2">
                        {ok
                          ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          : <X    className="w-3 h-3 text-slate-600 flex-shrink-0" />
                        }
                        <span className={cn('text-xs', ok ? 'text-emerald-400' : 'text-slate-500')}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
