/**
 * Domain Error System
 * アプリケーション全体で一貫したエラーハンドリングを提供
 */

export enum DomainErrorCode {
  NotFound = 'NotFound',
  Validation = 'Validation',
  Conflict = 'Conflict',
  Forbidden = 'Forbidden',
  Unexpected = 'Unexpected'
}

export interface DomainError {
  code: DomainErrorCode;
  message: string;
  details?: Record<string, unknown>;
  cause?: Error;
}

/**
 * 汎用DomainErrorファクトリ関数
 */
export function createDomainError(
  code: DomainErrorCode,
  message: string,
  details?: Record<string, unknown>,
  cause?: Error
): DomainError {
  return {
    code,
    message,
    details,
    cause
  };
}

/**
 * NotFoundエラー作成関数
 */
export function createNotFoundError(message: string): DomainError {
  return createDomainError(DomainErrorCode.NotFound, message);
}

/**
 * Validationエラー作成関数
 */
export function createValidationError(
  message: string,
  details?: Record<string, unknown>
): DomainError {
  return createDomainError(DomainErrorCode.Validation, message, details);
}

/**
 * Conflictエラー作成関数
 */
export function createConflictError(
  message: string,
  details?: Record<string, unknown>
): DomainError {
  return createDomainError(DomainErrorCode.Conflict, message, details);
}

/**
 * Forbiddenエラー作成関数
 */
export function createForbiddenError(message: string): DomainError {
  return createDomainError(DomainErrorCode.Forbidden, message);
}

/**
 * Unexpectedエラー作成関数
 */
export function createUnexpectedError(
  message: string,
  cause?: Error
): DomainError {
  return createDomainError(DomainErrorCode.Unexpected, message, undefined, cause);
}

/**
 * DomainErrorかどうかを判定するtype guard
 */
export function isDomainError(error: unknown): error is DomainError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    Object.values(DomainErrorCode).includes((error as DomainError).code)
  );
}