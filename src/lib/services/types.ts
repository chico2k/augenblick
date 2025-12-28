/**
 * Service Layer Type Definitions
 * Implements a Result pattern for type-safe error handling in service operations.
 */

/**
 * Service error codes for categorizing different types of errors.
 */
export type ServiceErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR";

/**
 * Represents a service-level error with structured information.
 */
export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Represents a successful result containing a value.
 */
interface OkResult<T> {
  isOk: () => true;
  isErr: () => false;
  value: T;
  error?: never;
}

/**
 * Represents an error result containing an error.
 */
interface ErrResult {
  isOk: () => false;
  isErr: () => true;
  value?: never;
  error: ServiceError;
}

/**
 * Result type for service operations.
 * Either contains a successful value (Ok) or an error (Err).
 *
 * @example
 * ```typescript
 * async function getById(id: string): Promise<Result<Customer>> {
 *   try {
 *     const customer = await db.query.customers.findFirst({
 *       where: eq(customers.id, id),
 *     });
 *     if (!customer) {
 *       return Err({ code: "NOT_FOUND", message: "Kunde nicht gefunden" });
 *     }
 *     return Ok(customer);
 *   } catch (error) {
 *     return Err({ code: "DATABASE_ERROR", message: String(error) });
 *   }
 * }
 * ```
 */
export type Result<T> = OkResult<T> | ErrResult;

/**
 * Creates a successful Result containing the given value.
 *
 * @param value - The success value to wrap
 * @returns An Ok result containing the value
 */
export function Ok<T>(value: T): OkResult<T> {
  return {
    isOk: () => true,
    isErr: () => false,
    value,
  };
}

/**
 * Creates an error Result containing the given error.
 *
 * @param error - The error to wrap (can be a ServiceError or a simple string)
 * @returns An Err result containing the error
 */
export function Err(error: ServiceError | string): ErrResult {
  const serviceError: ServiceError =
    typeof error === "string"
      ? { code: "INTERNAL_ERROR", message: error }
      : error;

  return {
    isOk: () => false,
    isErr: () => true,
    error: serviceError,
  };
}

/**
 * Type guard to check if a Result is Ok.
 */
export function isOkResult<T>(result: Result<T>): result is OkResult<T> {
  return result.isOk();
}

/**
 * Type guard to check if a Result is Err.
 */
export function isErrResult<T>(result: Result<T>): result is ErrResult {
  return result.isErr();
}

/**
 * Unwraps a Result, returning the value if Ok or throwing if Err.
 * Use with caution - prefer checking isOk()/isErr() first.
 *
 * @param result - The result to unwrap
 * @returns The contained value
 * @throws Error if the result is Err
 */
export function unwrap<T>(result: Result<T>): T {
  if (isOkResult(result)) {
    return result.value;
  }
  throw new Error(result.error.message);
}

/**
 * Unwraps a Result, returning the value if Ok or a default value if Err.
 *
 * @param result - The result to unwrap
 * @param defaultValue - The default value to return if Err
 * @returns The contained value or the default
 */
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  if (isOkResult(result)) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Pagination parameters for list operations.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated result containing items and pagination metadata.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
