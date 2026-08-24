// src/api/index.ts
export { apiClient } from './apiClient';
export { handleApi } from './handleApi';
export { walletApi } from './walletApi';
export { authApi } from './authApi';

export type { ClaimHandleRequest, ClaimHandleResponse } from './handleApi';
export type { LinkWalletRequest, WalletResponse } from './walletApi';
export type { UserProfile } from './authApi';
