// src/api/walletApi.ts
import { apiClient } from './apiClient';

export interface LinkWalletRequest {
  address: string;
  chain: string;
  network?: string;
  signature: string;
  message: string;
}

export interface WalletResponse {
  id: string;
  user_id: string;
  chain: string;
  network: string;
  address: string;
  status: string;
  linked_at: string;
}

export const walletApi = {
  // Links a secondary wallet address (Requires Bearer token)
  linkWallet: async (data: LinkWalletRequest): Promise<WalletResponse> => {
    return apiClient.post<WalletResponse>('/wallets/link', data);
  },
};
