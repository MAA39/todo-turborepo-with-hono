// neverthrow のResult型をre-export
export { Result, ok, err } from 'neverthrow';

// HttpError type definition
export interface HttpError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Domain errorとの統合  
import type { DomainError } from '@repo/domain';
import type { Result } from 'neverthrow';
import { ok, err } from 'neverthrow';

// API専用Result型
export type ApiResult<T> = Result<T, DomainError>;

// DomainError → HttpError 変換
export function domainErrorToHttp(domainError: DomainError): HttpError {
  const statusMap: Record<string, number> = {
    'NotFound': 404,
    'Validation': 400,
    'Conflict': 409,
    'Forbidden': 403,
    'Unexpected': 500
  };

  return {
    status: statusMap[domainError.code] || 500,
    message: domainError.message,
    code: domainError.code,
    details: domainError.details
  };
}

// API Success response helper
export function apiSuccess<T>(data: T) {
  return ok(data);
}

// API Error response helper  
export function apiError(domainError: DomainError) {
  return err(domainError);
}