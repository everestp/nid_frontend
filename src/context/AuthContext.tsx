
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

import { apiClient } from '@/api/apiClient';
import { userProfileApi } from '@/api/userProfileApi';

// ============================================================
// TYPES
// ============================================================

export interface User {
  id: string;
  email?: string;
  username?: string;
  created_at?: string;
}

interface LoginResponse {
  user: User;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext =
  createContext<AuthState | undefined>(undefined);

// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  // ==========================================================
  // REFRESH CURRENT USER
  // ==========================================================
  //
  // The backend reads the nid_token HttpOnly cookie.
  //
  // Frontend does NOT read or store the token.
  //
  // ==========================================================

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await userProfileApi.getCurrentUser();

      setUser(response);
    } catch (error) {
      console.error(
        'Authentication check failed:',
        error
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // EMAIL / PASSWORD LOGIN
  // ==========================================================

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<void> => {
      const response =
        await apiClient.post<LoginResponse>(
          '/auth/login',
          {
            email,
            password,
          }
        );

      setUser(response.user);
    },
    []
  );

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = useCallback(
    async (): Promise<void> => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error(
          'Logout failed:',
          error
        );
      } finally {
        setUser(null);
      }
    },
    []
  );

  // ==========================================================
  // INITIAL AUTH CHECK
  // ==========================================================
  //
  // Runs once when AuthProvider mounts.
  //
  // If nid_token exists and is valid:
  //
  //     user -> authenticated
  //
  // Otherwise:
  //
  //     user -> null
  //
  // ==========================================================

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value: AuthState = {
    isAuthenticated: user !== null,
    user,
    loading,
    login,
    logout,
    refreshUser,
  };

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// USE AUTH HOOK
// ============================================================

export function useAuth(): AuthState {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}
