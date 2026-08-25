import { apiClient } from './apiClient';

// ============================================================
// TYPES
// ============================================================

export type ClientType =
  | 'confidential'
  | 'public';

export interface RegisterClientRequest {
  name: string;
  redirect_uri: string;
  client_type: ClientType;
  client_logo?: string;
  client_uri?: string;
  policy_uri?: string;
}

export interface RegisterClientResponse {
  id?: string;
  client_id: string;
  client_secret?: string;
  name: string;
  redirect_uri: string;
  client_type: ClientType;
  client_logo: string;
  client_uri: string;
  policy_uri: string;
  created_at?: string;
  updated_at?: string;
}

export interface OAuthClient {
  id: string;
  client_id: string;
  name: string;
  redirect_uri: string;
  client_type: ClientType;
  client_logo: string;
  client_uri: string;
  policy_uri: string;
  created_at: string;
  updated_at: string;
}

export interface RotateSecretResponse {
  client_secret: string;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ListClientsResponse {
  clients: OAuthClient[];
}

// ============================================================
// CLIENT REGISTER API
// ============================================================

export const clientRegisterApi = {

  // ==========================================================
  // Register OAuth Client
  // ==========================================================

  register: async (
    data: RegisterClientRequest,
  ): Promise<RegisterClientResponse> => {
    return apiClient.post<RegisterClientResponse>(
      '/oauth/register',
      data,
    );
  },

  // ==========================================================
  // List Current User's OAuth Clients
  // ==========================================================

  listAllByUser: async (): Promise<OAuthClient[]> => {
    const response =
      await apiClient.get<ListClientsResponse>(
        '/oauth/clients',
      );

    return response.clients;
  },

  // ==========================================================
  // Get OAuth Client
  // ==========================================================

  getByClientId: async (
    clientId: string,
  ): Promise<OAuthClient> => {
    return apiClient.get<OAuthClient>(
      `/oauth/clients/${encodeURIComponent(clientId)}`,
    );
  },

  // ==========================================================
  // Delete OAuth Client (using internal database ID)
  // ==========================================================

  delete: async (
    id: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/oauth/clients/${encodeURIComponent(id)}`,
    );
  },

  // ==========================================================
  // Rotate OAuth Client Secret (using internal database ID)
  // ==========================================================

  rotateSecret: async (
    id: string,
  ): Promise<RotateSecretResponse> => {
    return apiClient.post<RotateSecretResponse>(
      `/oauth/clients/${encodeURIComponent(id)}/rotate-secret`,
    );
  },
};
