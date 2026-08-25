import { apiClient } from './apiClient';

// ============================================================
// User
// ============================================================

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
// IN-HOUSE AUTHENTICATION
// ============================================================
//
// Wallet signature
//      |
//      v
// POST /api/v1/auth/login
//      |
//      v
// NID internal session
//      |
//      v
// HttpOnly cookie: nid_token
//
// This is ONLY for NID itself.
// It is NOT OAuth/OIDC.
//

export interface WalletLoginRequest {
  handle: string;
  address: string;
  signature: string;
  message: string;
  chain: string;
}

export interface WalletLoginResponse {
  token?: string;
  user?: UserProfile;
  user_id?: string;
  handle?: string;
}

// ============================================================
// OAUTH / OIDC
// ============================================================

export interface NIDAuthorizeParams {
  clientId: string;
  redirectUri: string;

  scope?: string;
  state?: string;
  nonce?: string;

  codeChallenge?: string;
  codeChallengeMethod?: 'S256';
}

export interface NIDTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;

  id_token?: string;

  refresh_token?: string;

  scope?: string;
}

export interface NIDUserInfo {
  sub: string;

  name?: string;

  preferred_username?: string;

  handle?: string;
}

// ============================================================
// AUTH API
// ============================================================

export const authApi = {
  // ==========================================================
  // IN-HOUSE
  // ==========================================================

  /**
   * Login directly to NID.
   *
   * This is NOT OAuth.
   *
   * Flow:
   *
   * wallet
   *   ↓
   * sign message
   *   ↓
   * /api/v1/auth/login
   *   ↓
   * nid_token cookie
   */
walletLogin: async (
  data: WalletLoginRequest
): Promise<WalletLoginResponse> => {
  return apiClient.post<WalletLoginResponse>(
    "/auth/login",
    data,
    {
      credentials: "include",
    }
  );
},

  /**
   * Get currently authenticated NID user.
   *
   * The browser automatically sends:
   *
   * Cookie: nid_token=...
   */
  getMe: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(
      '/user/profile'
    );
  },

  /**
   * Logout from NID itself.
   *
   * This should destroy/revoke the internal NID session.
   */
  logout: async (): Promise<void> => {
    await apiClient.post(
      '/auth/logout',
      {}
    );
  },

  // ==========================================================
  // OAUTH / OIDC
  // ==========================================================

  /**
   * Start "Sign in with NID".
   *
   * IMPORTANT:
   *
   * This does NOT perform wallet authentication here.
   *
   * Browser goes to:
   *
   * NID
   *   ↓
   * /oauth/authorize
   *   ↓
   * NID checks its own login session
   *   ↓
   * authorization
   *   ↓
   * redirect_uri?code=...
   */
  startNIDLogin: ({
    clientId,
    redirectUri,
    scope = 'openid',
    state,
    nonce,
    codeChallenge,
    codeChallengeMethod = 'S256',
  }: NIDAuthorizeParams): void => {
    const params = new URLSearchParams();

    params.set(
      'client_id',
      clientId
    );

    params.set(
      'redirect_uri',
      redirectUri
    );

    params.set(
      'response_type',
      'code'
    );

    params.set(
      'scope',
      scope
    );

    if (state) {
      params.set(
        'state',
        state
      );
    }

    if (nonce) {
      params.set(
        'nonce',
        nonce
      );
    }

    if (codeChallenge) {
      params.set(
        'code_challenge',
        codeChallenge
      );

      params.set(
        'code_challenge_method',
        codeChallengeMethod
      );
    }

    window.location.href =
      `https://nid.xyz/oauth/authorize?${params.toString()}`;
  },

  /**
   * Exchange OAuth authorization code for tokens.
   *
   * This is normally done by the external application's
   * backend for a confidential client.
   *
   * For a public SPA, PKCE is required and client_secret
   * should NOT be exposed.
   */
  exchangeCode: async (
    code: string,
    clientId: string,
    redirectUri: string,
    codeVerifier: string,
    clientSecret?: string
  ): Promise<NIDTokenResponse> => {
    const body =
      new URLSearchParams();

    body.set(
      'grant_type',
      'authorization_code'
    );

    body.set(
      'code',
      code
    );

    body.set(
      'client_id',
      clientId
    );

    body.set(
      'redirect_uri',
      redirectUri
    );

    body.set(
      'code_verifier',
      codeVerifier
    );

    if (clientSecret) {
      body.set(
        'client_secret',
        clientSecret
      );
    }

    const response =
      await fetch(
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
      const text =
        await response.text();

      throw new Error(
        text ||
        'Failed to exchange authorization code'
      );
    }

    return response.json();
  },

  /**
   * Get user information from NID.
   *
   * Uses OAuth access_token.
   *
   * This is completely separate from:
   *
   * nid_token
   */
  getNIDUserInfo: async (
    accessToken: string
  ): Promise<NIDUserInfo> => {
    const response =
      await fetch(
        'https://nid.xyz/oauth/userinfo',
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    if (!response.ok) {
      const text =
        await response.text();

      throw new Error(
        text ||
        'Failed to fetch NID user info'
      );
    }

    return response.json();
  },

  // ==========================================================
  // OIDC DISCOVERY
  // ==========================================================

  getOIDCConfiguration:
    async () => {
      const response =
        await fetch(
          'https://nid.xyz/.well-known/openid-configuration'
        );

      if (!response.ok) {
        throw new Error(
          'Failed to fetch OIDC configuration'
        );
      }

      return response.json();
    },

  // ==========================================================
  // DEMO
  // ==========================================================

  demoLogin:
    async (): Promise<WalletLoginResponse> => {
      return {
        token: 'demo_token_12345',
      };
    },
};
