'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppRole } from './nav-config';
import { apiLogin, type AuthUser } from './api';

const STORAGE_KEY = 'ayadati_auth';

interface AuthContextValue {
  user: AuthUser | null;
  role: AppRole | null;
  tenantSlug: string | null;
  isLoading: boolean;
  login: (tenantSlug: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapRole(apiRole: string): AppRole {
  const r = apiRole.toLowerCase();
  if (r === 'admin' || r === 'super_admin') return 'admin';
  if (r === 'auditor') return 'auditor';
  if (r === 'nurse') return 'nurse';
  if (r === 'receptionist') return 'receptionist';
  return 'patient';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as AuthUser);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (tenantSlug: string, email: string, password: string) => {
      const loggedIn = await apiLogin(tenantSlug, email, password);
      setUser(loggedIn);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user ? mapRole(user.role) : null,
      tenantSlug: user?.tenantSlug ?? null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
