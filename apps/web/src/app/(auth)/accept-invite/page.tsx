'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { authApi, usersApi } from '@/lib/api';
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

interface InviteInfo {
  email:     string;
  role:      string;
  invitedBy: string;
  expiresAt: string;
}

export default function AcceptInvitePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const inviteToken  = searchParams.get('token') ?? '';

  const [invite, setInvite]       = useState<InviteInfo | null>(null);
  const [inviteError, setInviteError] = useState('');
  const [verifying, setVerifying] = useState(true);

  const [name, setName]                 = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const [nameTouched, setNameTouched]     = useState(false);
  const [passTouched, setPassTouched]     = useState(false);
  const [nameError, setNameError]         = useState('');

  const passwordChecks = getPasswordChecks(password);
  const passwordValid  = Object.values(passwordChecks).every(Boolean);

  // ── Verify invite token on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (!inviteToken) {
      setInviteError('No invitation token provided.');
      setVerifying(false);
      return;
    }
    usersApi
      .verifyInvite(inviteToken)
      .then((data: InviteInfo) => {
        setInvite(data);
        setVerifying(false);
      })
      .catch(() => {
        setInviteError('This invitation is invalid or has expired.');
        setVerifying(false);
      });
  }, [inviteToken]);

  // ── Submit ────────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameTouched(true);
    setPassTouched(true);
    const ne = !name.trim() ? 'Full name is required' : name.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    setNameError(ne);
    if (ne || !passwordValid || !invite) return;

    setLoading(true);
    try {
      // 1. Sign up via Better Auth
      const result = await authClient.signUp.email({
        email:    invite.email,
        name:     name.trim(),
        password,
      });
      if (result.error) throw new Error(result.error.message);

      const sessionToken = (result.data as any)?.session?.token ?? (result.data as any)?.token;
      if (!sessionToken) throw new Error('No session token received');

      // 2. Exchange Better Auth session for a JWT (role=ADMIN at this point due to databaseHook)
      const data = await authApi.exchangeSession(sessionToken);
      localStorage.setItem('iasa_token', data.accessToken);
      localStorage.setItem('iasa_user', JSON.stringify(data.user));

      // 3. Accept the invitation (updates DB: role=ANALYST/VIEWER, ownerId=inviter.id)
      await usersApi.acceptInvite(inviteToken);

      // 4. Re-exchange the session now that the role is updated in DB.
      //    exchangeSession reads role from DB at call time, so this JWT has the correct role.
      const fresh = await authApi.exchangeSession(sessionToken);
      localStorage.setItem('iasa_token', fresh.accessToken);
      localStorage.setItem('iasa_user', JSON.stringify(fresh.user));

      toast.success(`Welcome to IASA! You've joined as ${invite.role}.`);
      router.replace('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────────
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (inviteError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-white font-semibold text-lg mb-2">Invalid Invitation</h1>
          <p className="text-slate-400 text-sm mb-6">{inviteError}</p>
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-bg px-4">
      <div className="absolute inset-0 bg-glow-purple pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">IASA</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {/* Invite banner */}
          <div className="bg-violet-600/10 border border-violet-500/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-violet-300">
              <strong>{invite!.invitedBy}</strong> has invited you to join as{' '}
              <strong>{invite!.role}</strong>
            </p>
          </div>

          <h1 className="text-xl font-semibold text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-6">Complete your account setup to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email — readonly, pre-filled from invite */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={invite!.email}
                readOnly
                className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg px-3.5 py-2.5 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameTouched) setNameError(!e.target.value.trim() ? 'Required' : '');
                }}
                onBlur={() => {
                  setNameTouched(true);
                  setNameError(!name.trim() ? 'Full name is required' : '');
                }}
                placeholder="Jane Smith"
                autoComplete="name"
                className={cn(
                  'w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors',
                  nameError && nameTouched
                    ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-slate-700 focus:ring-violet-500/50 focus:border-violet-500',
                )}
              />
              {nameError && nameTouched && (
                <p className="mt-1.5 text-xs text-red-400">{nameError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPassTouched(true)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className={cn(
                    'w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors',
                    passTouched && !passwordValid
                      ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                      : passTouched && passwordValid
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

              {(password.length > 0 || passTouched) && (
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
                        {ok ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            : <X    className="w-3 h-3 text-slate-600 flex-shrink-0" />}
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
              {loading ? 'Creating account…' : 'Accept invitation & create account'}
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
