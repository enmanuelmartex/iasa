'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authClient, AUTH_BASE_URL } from '@/lib/auth-client';
import { authApi } from '@/lib/api';

// OAuth callback page — landed here after Google OAuth completes.
// Better Auth sets a session cookie; we read it with getSession() then exchange for JWT.
export default function AuthCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const ran          = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function finish() {
      // 1. Better Auth v1.6.x may pass token as ?token= for some flows (bearer plugin)
      const urlToken = searchParams.get('token');
      if (urlToken) {
        return exchange(urlToken);
      }

      // 2. For social OAuth, Better Auth sets a session cookie — read it via getSession()
      const sessionRes = await authClient.getSession();
      const sessionToken = (sessionRes.data as any)?.session?.token;
      if (sessionToken) {
        return exchange(sessionToken);
      }

      // 3. Fallback: try fetching session directly from the API (handles cookie forwarding)
      try {
        const res = await fetch(`${AUTH_BASE_URL}/api/auth/get-session`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const token = data?.session?.token;
          if (token) return exchange(token);
        }
      } catch {}

      toast.error('Sign-in failed — no session received');
      router.replace('/login');
    }

    async function exchange(sessionToken: string) {
      try {
        const data = await authApi.exchangeSession(sessionToken);
        localStorage.setItem('iasa_token', data.accessToken);
        localStorage.setItem('iasa_user', JSON.stringify(data.user));
        router.replace('/dashboard');
      } catch {
        toast.error('Failed to complete sign-in. Please try again.');
        router.replace('/login');
      }
    }

    finish();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">IASA</span>
      </div>
      <Loader2 className="w-6 h-6 text-violet-400 animate-spin mb-3" />
      <p className="text-slate-400 text-sm">Completing sign-in…</p>
    </div>
  );
}
