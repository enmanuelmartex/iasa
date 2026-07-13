'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff, Loader2, Chrome } from 'lucide-react';
import { authClient, AUTH_BASE_URL } from '@/lib/auth-client';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Per-field error state — only shown after the user has interacted with the field
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  function validateEmail(value: string): string {
    if (!value) return 'Email is required';
    if (!EMAIL_RE.test(value)) return 'Invalid email format';
    return '';
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    // Clear error in real time once the user fixes the value
    if (emailTouched) setEmailError(validateEmail(value));
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Run validation on submit in case fields were never blurred
    const err = validateEmail(email);
    setEmailTouched(true);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    try {
      // Use Better Auth for email/password sign-in (bearer plugin returns token in body)
      const result = await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message);
      const sessionToken = (result.data as any)?.session?.token ?? (result.data as any)?.token;
      if (!sessionToken) throw new Error('No session token received');
      const data = await authApi.exchangeSession(sessionToken);
      localStorage.setItem('iasa_token', data.accessToken);
      localStorage.setItem('iasa_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

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
          <p className="text-slate-400 text-sm">Intelligent API Security Assessment</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your security dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="analyst@company.com"
                autoComplete="email"
                className={cn(
                  'w-full bg-slate-800/60 border rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors',
                  emailError && emailTouched
                    ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-slate-700 focus:ring-violet-500/50 focus:border-violet-500',
                )}
              />
              {emailError && emailTouched && (
                <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <>
              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900 px-3 text-slate-500">or continue with</span>
                </div>
              </div>

              {/* Google OAuth */}
              <button
                type="button"
                disabled={googleLoading}
                onClick={async () => {
                  setGoogleLoading(true);
                  try {
                    await authClient.signIn.social({
                      provider: 'google',
                      callbackURL: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
                    });
                  } catch {
                    toast.error('Google sign-in failed');
                    setGoogleLoading(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                {googleLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )
                }
                Continue with Google
              </button>
            </>
          )}

          <p className="text-center text-sm text-slate-400 mt-5">
            No account yet?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Use only on authorized APIs and approved testing environments
        </p>
      </div>
    </div>
  );
}
