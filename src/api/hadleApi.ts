import { apiClient } from './apiClient';

export interface ClaimHandleRequest {
  name: string;
  address: string;
  chain: string;
  signature: string;
}

export interface ClaimHandleResponse {
  id: string;
  user_id: string;
  name: string;
  status: string;
  primary: boolean;
  created_at: string;
}

export const handleApi = {
  // Public homepage claim handle endpoint
  claimHandle: async (
    data: ClaimHandleRequest
  ): Promise<ClaimHandleResponse> => {
    return apiClient.post<ClaimHandleResponse>(
      '/handles/claim',
      data
    );
  },

  // Get all handles belonging to the authenticated user
  getAllByUserID: async (): Promise<ClaimHandleResponse[]> => {
    return apiClient.get<ClaimHandleResponse[]>('/handles');
  },

  // Resolve a .nid handle to a wallet address
  resolveHandle: async (
    handle: string,
    chain?: string
  ): Promise<{ address: string }> => {
    const query = chain
      ? `?handle=${encodeURIComponent(handle)}&chain=${encodeURIComponent(chain)}`
      : `?handle=${encodeURIComponent(handle)}`;

    return apiClient.get<{ address: string }>(`/resolve${query}`);
  },
};
