// src/api/apiClient.ts

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.nid.xyz/api/v1";

// ============================================================
// Request
// ============================================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,

      // IMPORTANT:
      // Send NID session cookie
      credentials: "include",
    },
  );

  // ============================================================
  // Handle errors
  // ============================================================

  if (!response.ok) {
    const errorText = await response.text();

    let errorMessage =
      "An error occurred";

    try {
      const errorJson = JSON.parse(
        errorText,
      );

      errorMessage =
        errorJson.message ||
        errorJson.error ||
        errorText ||
        response.statusText;
    } catch {
      errorMessage =
        errorText ||
        response.statusText;
    }

    throw new Error(errorMessage);
  }

  // ============================================================
  // Empty response
  // ============================================================

  const text =
    await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      "Invalid JSON response from server",
    );
  }
}

// ============================================================
// API CLIENT
// ============================================================

export const apiClient = {
  // ----------------------------------------------------------
  // GET
  // ----------------------------------------------------------

  get: <T>(
    endpoint: string,
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: "GET",
      },
    );
  },

  // ----------------------------------------------------------
  // POST
  // ----------------------------------------------------------

  post: <T>(
endpoint: string, body: unknown, p0: { credentials: string; },
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },

  // ----------------------------------------------------------
  // PUT
  // ----------------------------------------------------------

  put: <T>(
    endpoint: string,
    body: unknown,
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
    );
  },

  // ----------------------------------------------------------
  // PATCH
  // ----------------------------------------------------------

  patch: <T>(
    endpoint: string,
    body: unknown,
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
  },

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  delete: <T>(
    endpoint: string,
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: "DELETE",
      },
    );
  },
};
