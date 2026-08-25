// src/api/sessionApi.ts

import { apiClient } from './apiClient';

// ============================================================
// Types
// ============================================================

export interface Session {
  id: string;
  user_id: string;
  client_id?: string;
  app_name?: string;
  status: string;
  created_at: string;
}

export interface SessionListResponse {
  success: boolean;
  sessions: Session[];
  count: number;
}

export interface SessionResponse {
  success: boolean;
  message: string;
}

// ============================================================
// Session API
// ============================================================

export const sessionApi = {
  // ----------------------------------------------------------
  // List all sessions of current user
  // GET /api/v1/sessions
  // ----------------------------------------------------------
  list: async (): Promise<SessionListResponse> => {
    return apiClient.get<SessionListResponse>(
      '/sessions',
    );
  },

  // ----------------------------------------------------------
  // Get a single session
  // GET /api/v1/sessions/:id
  // ----------------------------------------------------------
  get: async (
    sessionId: string,
  ): Promise<Session> => {
    return apiClient.get<Session>(
      `/sessions/${sessionId}`,
    );
  },

  // ----------------------------------------------------------
  // Revoke one session
  // POST /api/v1/sessions/revoke?id=:id
  // ----------------------------------------------------------
  revoke: async (
    sessionId: string,
  ): Promise<SessionResponse> => {
    return apiClient.post<SessionResponse>(
      `/sessions/revoke?id=${encodeURIComponent(sessionId)}`,
    );
  },

  // ----------------------------------------------------------
  // Revoke all sessions
  // POST /api/v1/sessions/revoke-all
  // ----------------------------------------------------------
  revokeAll: async (): Promise<SessionResponse> => {
    return apiClient.post<SessionResponse>(
      '/sessions/revoke-all',
    );
  },
};
