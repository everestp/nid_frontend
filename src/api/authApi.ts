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

// ============================================================
// Wallet Login
// ============================================================

export interface WalletLoginRequest {
  handle: string;
  address: string;
  signature: string;
  message: string;
  chain: string;
}

export interface WalletLoginResponse {
  token: string;
  user?: UserProfile;
}

// ============================================================
// NID OAuth / OIDC
// ============================================================

export interface NIDAuthorizeParams {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  nonce?: string;
  codeChallenge: string;
  codeChallengeMethod?: 'S256';
}

export interface NIDTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
  scope: string;
}

export interface NIDUserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
}

// ============================================================
// Auth API
// ============================================================

export const authApi = {
  // ----------------------------------------------------------
  // Current NID user
  // ----------------------------------------------------------

  getMe: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/user/profile');
  },

  // ----------------------------------------------------------
  // Direct wallet authentication
  // ----------------------------------------------------------

  walletLogin: async (
    data: WalletLoginRequest
  ): Promise<WalletLoginResponse> => {
    return apiClient.post<WalletLoginResponse>(
      '/auth/login',
      data
    );
  },

  // ----------------------------------------------------------
  // Start "Sign in with NID"
  //
  // This redirects the user's browser to NID.
  // ----------------------------------------------------------

  startNIDLogin: ({
    clientId,
    redirectUri,
    scope = 'openid',
    state,
    nonce,
    codeChallenge,
    codeChallengeMethod = 'S256',
  }: NIDAuthorizeParams): void => {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    });

    if (state) {
      params.set('state', state);
    }

    if (nonce) {
      params.set('nonce', nonce);
    }

    window.location.href =
      `https://nid.xyz/oauth/authorize?${params.toString()}`;
  },

  // ----------------------------------------------------------
  // Exchange authorization code for tokens
  //
  // IMPORTANT:
  // For a confidential client this should normally happen
  // server-side, not in the browser.
  // ----------------------------------------------------------

  exchangeCode: async (
    code: string,
    clientId: string,
    redirectUri: string,
    codeVerifier: string,
    clientSecret?: string
  ): Promise<NIDTokenResponse> => {
    const body = new URLSearchParams();

    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('client_id', clientId);
    body.set('redirect_uri', redirectUri);
    body.set('code_verifier', codeVerifier);

    if (clientSecret) {
      body.set('client_secret', clientSecret);
    }

    const response = await fetch(
      'https://nid.xyz/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        text || 'Failed to exchange authorization code'
      );
    }

    return response.json();
  },

  // ----------------------------------------------------------
  // Get OIDC user information
  // ----------------------------------------------------------

  getNIDUserInfo: async (
    accessToken: string
  ): Promise<NIDUserInfo> => {
    const response = await fetch(
      'https://nid.xyz/oauth/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch NID user info');
    }

    return response.json();
  },

  // ----------------------------------------------------------
  // Demo login
  // ----------------------------------------------------------

  demoLogin: async (): Promise<WalletLoginResponse> => {
    return {
      token: 'demo_token_12345',
    };
  },
};
