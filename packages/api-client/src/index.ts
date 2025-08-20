// Re-export all types for convenient access
export * from './types.js';

// Result型定義 (Error as Value pattern)
export type Result<T, E = Error> = 
  | { isOk: true; value: T }
  | { isOk: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ isOk: true, value });
export const err = <E>(error: E): Result<never, E> => ({ isOk: false, error });

// HTTP Error型
export interface HttpError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// DetailedError type guard
export function isDetailedError(error: unknown): error is HttpError {
  return (
    !!error &&
    typeof error === 'object' &&
    'status' in error &&
    'message' in error
  );
}

// parseResponse wrapper - Hono client用
export async function safeParseResponse<T>(
  responsePromise: Promise<Response>
): Promise<Result<T, HttpError>> {
  try {
    const response = await responsePromise;
    
    if (!response.ok) {
      const errorData = await response.json();
      return err({
        status: response.status,
        message: errorData.error?.message || 'HTTP Error',
        code: errorData.error?.code,
        details: errorData.error?.details
      });
    }
    
    const data = await response.json();
    return ok(data as T);
  } catch (error) {
    return err({
      status: 500,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// API Client factory
export function createApiClient(baseUrl: string) {
  return {
    baseUrl,
    // 基本的なfetch wrapper
    async fetch<T>(endpoint: string, options?: RequestInit): Promise<Result<T, HttpError>> {
      const url = `${baseUrl}${endpoint}`;
      return safeParseResponse(fetch(url, options));
    }
  };
}