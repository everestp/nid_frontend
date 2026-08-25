// src/api/walletListApi.ts

import { apiClient } from './apiClient';

// ============================================================
// TYPES
// ============================================================

export type Chain =
  | 'ethereum'
  | 'solana'
  | 'bitcoin'
  | 'polygon'
  | 'bsc'
  | 'arbitrum'
  | 'base'
  | 'optimism'
  | 'avalanche'
  | 'tron'
  | 'other';

export type WalletStatus =
  | 'verified'
  | 'pending';

export interface Wallet {
  id: string;
  chain: Chain;
  network: string;
  address: string;
  status: WalletStatus;
  linkedAt: string;
}

// ============================================================
// REQUEST TYPES
// ============================================================

export interface CreateWalletRequest {
  chain: Chain;
  network: string;
  address: string;
}

export interface UpdateWalletRequest {
  chain?: Chain;
  network?: string;
  address?: string;
  status?: WalletStatus;
}

// ============================================================
// RESPONSE TYPES
// ============================================================

export interface WalletListResponse {
  success: boolean;
  wallets: Wallet[];
  count: number;
}

export interface WalletResponse {
  success: boolean;
  wallet: Wallet;
}

export interface WalletActionResponse {
  success: boolean;
  message: string;
}

// ============================================================
// WALLET LIST API
// ============================================================

export const walletListApi = {

  // ----------------------------------------------------------
  // List all wallets of current user
  //
  // GET /api/v1/wallet-list
  //
  // user_id comes from JWT on backend
  // ----------------------------------------------------------

  list: async (): Promise<WalletListResponse> => {
    return apiClient.get<WalletListResponse>(
      '/wallet-list',
    );
  },

  // ----------------------------------------------------------
  // Get single wallet
  //
  // GET /api/v1/wallet-list/:id
  //
  // ----------------------------------------------------------

  get: async (
    walletId: string,
  ): Promise<WalletResponse> => {
    return apiClient.get<WalletResponse>(
      `/wallet-list/${encodeURIComponent(walletId)}`,
    );
  },

  // ----------------------------------------------------------
  // Add wallet
  //
  // POST /api/v1/wallet-list
  //
  // user_id comes from JWT on backend
  // ----------------------------------------------------------

  create: async (
    data: CreateWalletRequest,
  ): Promise<WalletResponse> => {
    return apiClient.post<WalletResponse>(
      '/wallet-list',
      data,
    );
  },

  // ----------------------------------------------------------
  // Update wallet
  //
  // PUT /api/v1/wallet-list/:id
  //
  // ----------------------------------------------------------

  update: async (
    walletId: string,
    data: UpdateWalletRequest,
  ): Promise<WalletResponse> => {
    return apiClient.put<WalletResponse>(
      `/wallet-list/${encodeURIComponent(walletId)}`,
      data,
    );
  },

  // ----------------------------------------------------------
  // Delete wallet
  //
  // DELETE /api/v1/wallet-list/:id
  //
  // ----------------------------------------------------------

  delete: async (
    walletId: string,
  ): Promise<WalletActionResponse> => {
    return apiClient.delete<WalletActionResponse>(
      `/wallet-list/${encodeURIComponent(walletId)}`,
    );
  },
};
