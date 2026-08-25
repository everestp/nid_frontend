// src/api/userProfileApi.ts
import { apiClient } from './apiClient';

export interface HandleInfo {
  handle: string;
  is_primary: boolean;
}

export interface SocialIdentityInfo {
  platform: string;
  handle: string;
  verified: boolean;
  metadata: Record<string, any>;
}

export interface WalletInfo {
  chain: string;
  network: string;
  address: string;
}

export interface PublicProfileResponse {
  id: string;
  created_at: string;
  handles: HandleInfo[];
  identities: SocialIdentityInfo[];
  wallets: WalletInfo[];
}

export const userProfileApi = {
  // Fetches public profile by any handle (primary or secondary)
  getPublicProfileByHandle: async (
    handle: string
  ): Promise<PublicProfileResponse> => {
    const cleanHandle = handle.replace(/^@/, '').trim().toLowerCase();
    return apiClient.get<PublicProfileResponse>(`/${cleanHandle}`);
  },
};
