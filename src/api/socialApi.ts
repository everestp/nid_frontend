// src/api/socialApi.ts

import { apiClient } from './apiClient';

// ============================================================================
// TYPES
// ============================================================================

export interface SocialIdentity {
  id: string;
  platform: string;
  handle: string;
  verified: boolean;
  publicly_visible: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateSocialRequest {
  platform: string;
  handle: string;
  publicly_visible: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateSocialRequest {
  handle?: string;
  publicly_visible?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ToggleVisibilityRequest {
  publicly_visible: boolean;
}

export interface SocialListResponse {
  success?: boolean;
  socials: SocialIdentity[];
  count: number;
}

export interface SocialResponse {
  success: boolean;
  social: SocialIdentity;
}

export interface DeleteSocialResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// API
// ============================================================================

export const socialApi = {
  // --------------------------------------------------------------------------
  // GET /api/v1/social
  // --------------------------------------------------------------------------

  getMySocials: async (): Promise<SocialListResponse> => {
    const response = await apiClient.get<SocialListResponse>(
      '/social'
    );

    return {
      ...response,
      socials: Array.isArray(response.socials)
        ? response.socials
        : [],
      count: response.count ?? 0,
    };
  },

  // --------------------------------------------------------------------------
  // GET /api/v1/social/{id}
  // --------------------------------------------------------------------------

  getSocial: async (
    id: string
  ): Promise<SocialResponse> => {
    return apiClient.get<SocialResponse>(
      `/social/${id}`
    );
  },

  // --------------------------------------------------------------------------
  // POST /api/v1/social
  // --------------------------------------------------------------------------

  addSocial: async (
    data: CreateSocialRequest
  ): Promise<SocialIdentity> => {
    const response = await apiClient.post<SocialResponse>(
      '/social',
      data
    );

    return response.social;
  },

  // --------------------------------------------------------------------------
  // PUT /api/v1/social/{id}
  // --------------------------------------------------------------------------

  updateSocial: async (
    id: string,
    data: UpdateSocialRequest
  ): Promise<SocialIdentity> => {
    const response = await apiClient.put<SocialResponse>(
      `/social/${id}`,
      data
    );

    return response.social;
  },

  // --------------------------------------------------------------------------
  // PATCH /api/v1/social/{id}/visibility
  // --------------------------------------------------------------------------

  toggleVisibility: async (
    id: string,
    publiclyVisible: boolean
  ): Promise<SocialIdentity> => {
    const data: ToggleVisibilityRequest = {
      publicly_visible: publiclyVisible,
    };

    const response = await apiClient.patch<SocialResponse>(
      `/social/${id}/visibility`,
      data
    );

    return response.social;
  },

  // --------------------------------------------------------------------------
  // DELETE /api/v1/social/{id}
  // --------------------------------------------------------------------------

  deleteSocial: async (
    id: string
  ): Promise<DeleteSocialResponse> => {
    return apiClient.delete<DeleteSocialResponse>(
      `/social/${id}`
    );
  },

  // --------------------------------------------------------------------------
  // GET /api/v1/social/public
  // --------------------------------------------------------------------------

  getPublicSocials: async (): Promise<SocialListResponse> => {
    const response = await apiClient.get<SocialListResponse>(
      '/social/public'
    );

    return {
      ...response,
      socials: Array.isArray(response.socials)
        ? response.socials
        : [],
      count: response.count ?? 0,
    };
  },
};
