'use client';

import { createAuthClient } from 'better-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
export const AUTH_BASE_URL = API_URL.replace('/api/v1', '');

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
});
