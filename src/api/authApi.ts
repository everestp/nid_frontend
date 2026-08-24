// src/api/authApi.ts
import { apiClient } from './apiClient';

export interface UserProfile {
  id: string;
  created_at: string;
  handles?: Array<{
    id: string;
    handle: string;
    is_primary: boolean;
  }>;
  wallets?: Array<{
    id: string;
    chain: string;
    address: string;
  }>;
}

export const authApi = {
  // Fetch current authenticated user's profile and linked assets
  getMe: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/auth/me');
  },

  // Example demo login handshake if your backend issues a token on demo mode
  demoLogin: async (): Promise<{ token: string; user: UserProfile }> => {
    return apiClient.post<{ token: string; user: UserProfile }>('/auth/demo', {});
  },
};
