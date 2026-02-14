import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import api from '@/lib/api';
import { getSecureItem, removeSecureItem, setSecureItem } from '@/lib/secureStorage';

export type User = {
  id: string;
  email: string;
  name?: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

async function persistTokens(tokens: Tokens) {
  await Promise.all([
    setSecureItem('accessToken', tokens.accessToken),
    setSecureItem('refreshToken', tokens.refreshToken)
  ]);
}

async function clearTokens() {
  await Promise.all([removeSecureItem('accessToken'), removeSecureItem('refreshToken')]);
}

async function refreshTokens(): Promise<Tokens> {
  const refreshToken = await getSecureItem('refreshToken');
  if (!refreshToken) throw new Error('Missing refresh token');

  // Use a raw request without relying on api interceptors to avoid loops.
  const res = await api.post('/auth/refresh', { refreshToken });
  // After interceptor unwrap, res is { success, data }
  const tokens = res.data.tokens as Tokens;
  await persistTokens(tokens);
  return tokens;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshingRef = useRef<Promise<Tokens> | null>(null);

  const isAuthenticated = !!user;

  const bootstrap = async () => {
    try {
      const accessToken = await getSecureItem('accessToken');
      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        // /auth/me returns { success: true, data: { id, email, name } }
        // After unwrap, res = { success, data } and user is res.data directly.
        setUser(res.data as User);
      } catch (err: any) {
        const code = err?.response?.data?.error?.code;
        const status = err?.response?.status;

        if (status === 401 && code === 'AUTH_TOKEN_EXPIRED') {
          try {
            if (!refreshingRef.current) {
              refreshingRef.current = refreshTokens().finally(() => {
                refreshingRef.current = null;
              });
            }
            await refreshingRef.current;
            const res2 = await api.get('/auth/me');
            setUser(res2.data as User);
          } catch {
            await clearTokens();
            setUser(null);
          }
        } else {
          // Any other failure: treat as signed out.
          await clearTokens();
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    // Server returns { success: true, data: { user: {...}, tokens: {...} } }
    const nextUser = res.data.user as User;
    const tokens = res.data.tokens as Tokens;
    await persistTokens(tokens);
    setUser(nextUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    const res = await api.post('/auth/signup', { email, password, name });
    const nextUser = res.data.user as User;
    const tokens = res.data.tokens as Tokens;
    await persistTokens(tokens);
    setUser(nextUser);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      await clearTokens();
      setUser(null);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
