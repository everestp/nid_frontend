// src/api/handleApi.ts
import { apiClient } from './apiClient';

export interface ClaimHandleRequest {
  handle: string;
  address: string;
  chain: string;
}

export interface ClaimHandleResponse {
  id: string;
  user_id: string;
  handle: string;
  status: string;
  primary: boolean;
  created_at: string;
}

export const handleApi = {
  // Public homepage claim handle endpoint
  claimHandle: async (data: ClaimHandleRequest): Promise<ClaimHandleResponse> => {
    return apiClient.post<ClaimHandleResponse>('/handles/claim', data);
  },

  // Resolve a .nid handle to a wallet address
  resolveHandle: async (handle: string, chain?: string): Promise<{ address: string }> => {
    const query = chain ? `?handle=${handle}&chain=${chain}` : `?handle=${handle}`;
    return apiClient.get<{ address: string }>(`/resolve${query}`);
  },
};
