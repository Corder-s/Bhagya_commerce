/**
 * Bhagya Commerce — Centralized API Client & Service Gateway
 * Handles communication between Next.js frontend and Spring Boot backend.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
  requestId?: string;
}

export class ApiClientError extends Error {
  code: string;
  details?: Record<string, string>;
  requestId?: string;

  constructor(error: ApiError) {
    super(error.message || 'API request failed');
    this.name = 'ApiClientError';
    this.code = error.code || 'UNKNOWN_ERROR';
    this.details = error.details;
    this.requestId = error.requestId;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('bhagya_auth_token');
      if (stored) return stored;
      const session = localStorage.getItem('bhagya_user_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.token || null;
      }
    } catch {
      // Ignore storage errors
    }
    return null;
  }

  private generateRequestId(): string {
    return 'req_' + Math.random().toString(36).substring(2, 10);
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getAuthToken();
    const requestId = this.generateRequestId();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-Id': requestId,
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new ApiClientError({
          success: false,
          code: json.code || `HTTP_${response.status}`,
          message: json.message || 'An error occurred while processing your request',
          details: json.details,
          timestamp: json.timestamp || new Date().toISOString(),
          requestId: json.requestId || requestId,
        });
      }

      return json as ApiResponse<T>;
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError({
        success: false,
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network error or backend unreachable',
        timestamp: new Date().toISOString(),
        requestId,
      });
    }
  }

  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
