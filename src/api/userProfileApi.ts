import { apiClient } from './apiClient';

export interface HandleInfo {
  id?: string;
  handle: string;
  is_primary: boolean;
  status?: string;
}

export interface SocialIdentityInfo {
  id?: string;
  platform: string;
  handle: string;
  verified: boolean;
  publicly_visible?: boolean;
  metadata?: Record<string, any>;
}

export interface WalletInfo {
  id?: string;
  chain: string;
  network: string;
  address: string;
  status?: string;
}

export interface SessionInfo {
  id: string;
  client_id?: string;
  client_name?: string;
  last_used_at?: string;
  created_at: string;
}

export interface CurrentUserResponse {
  id: string;
  created_at: string;
  handles: HandleInfo[];
  identities: SocialIdentityInfo[];
  wallets: WalletInfo[];
}

export interface UserDashboardResponse {
  user_id: string;
  created_at: string;
  handles: HandleInfo[];
  socials: SocialIdentityInfo[];
  wallets: WalletInfo[];
  active_sessions: SessionInfo[];
}

export interface PublicProfileResponse {
  id: string;
  created_at: string;
  handles: HandleInfo[];
  identities: SocialIdentityInfo[];
  wallets: WalletInfo[];
}

export const userProfileApi = {
  getPublicProfileByHandle: async (
    handle: string
  ): Promise<PublicProfileResponse> => {
    const cleanHandle = handle.replace(/^@/, '').trim().toLowerCase();

    return apiClient.get<PublicProfileResponse>(`/${cleanHandle}`);
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    return apiClient.get<CurrentUserResponse>('/auth/me');
  },

  getDashboard: async (): Promise<UserDashboardResponse> => {
    return apiClient.get<UserDashboardResponse>('/user/dashboard');
  },
};
