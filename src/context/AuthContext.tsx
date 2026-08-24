import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { DEMO_USER, DEMO_CREDENTIALS } from '@/data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  user: typeof DEMO_USER | null;
  login: (email: string, password: string) => boolean;
  demoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = 'nid_demo_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [user, setUser] = useState<typeof DEMO_USER | null>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true' ? DEMO_USER : null;
  });

  const login = useCallback((email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser(DEMO_USER);
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const demoLogin = useCallback(() => {
    setIsAuthenticated(true);
    setUser(DEMO_USER);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
