/**
 * Centralized error handling with AppError class and ErrorCode enum.
 * All error messages are in German for user-facing content.
 */

/**
 * Enumeration of all application error codes.
 */
export const ErrorCode = {
  /** Entity nicht gefunden - 404 */
  NOT_FOUND: "NOT_FOUND",
  /** Entity existiert bereits - 409 */
  ALREADY_EXISTS: "ALREADY_EXISTS",
  /** Datenbankfehler - 500 */
  DATABASE_ERROR: "DATABASE_ERROR",
  /** Validierungsfehler - 400 */
  VALIDATION_ERROR: "VALIDATION_ERROR",
  /** Nicht autorisiert - 401 */
  UNAUTHORIZED: "UNAUTHORIZED",
  /** Kunde wurde gelöscht - 410 */
  CUSTOMER_DELETED: "CUSTOMER_DELETED",
  /** DSGVO-Version nicht aktiv - 400 */
  GDPR_VERSION_NOT_ACTIVE: "GDPR_VERSION_NOT_ACTIVE",
  /** Unterschrift existiert bereits - 409 */
  SIGNATURE_ALREADY_EXISTS: "SIGNATURE_ALREADY_EXISTS",
  /** PDF-Generierung fehlgeschlagen - 500 */
  PDF_GENERATION_ERROR: "PDF_GENERATION_ERROR",
  /** Unbekannter Fehler - 500 */
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Centralized application error class with typed error codes.
 * Provides static factory methods for creating specific error types.
 */
export class AppError extends Error {
  public readonly code: ErrorCodeType;
  public readonly details?: unknown;

  constructor(code: ErrorCodeType, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Creates a NOT_FOUND error for when an entity cannot be found.
   * @param entityName - Name of the entity type (e.g., "Kunde", "DSGVO-Version")
   * @param id - Optional ID of the entity that was not found
   */
  static notFound(entityName: string, id?: string): AppError {
    const message = id
      ? `${entityName} mit ID ${id} nicht gefunden`
      : `${entityName} nicht gefunden`;
    return new AppError(ErrorCode.NOT_FOUND, message);
  }

  /**
   * Creates an ALREADY_EXISTS error for when an entity already exists.
   * @param entityName - Name of the entity type
   * @param identifier - Optional identifier of the existing entity
   */
  static alreadyExists(entityName: string, identifier?: string): AppError {
    const message = identifier
      ? `${entityName} "${identifier}" existiert bereits`
      : `${entityName} existiert bereits`;
    return new AppError(ErrorCode.ALREADY_EXISTS, message);
  }

  /**
   * Creates a DATABASE_ERROR for database operation failures.
   * @param message - Human-readable error message in German
   * @param cause - The underlying error that caused the failure
   */
  static database(message: string, cause?: unknown): AppError {
    return new AppError(ErrorCode.DATABASE_ERROR, message, cause);
  }

  /**
   * Creates a VALIDATION_ERROR for input validation failures.
   * @param message - Human-readable error message in German
   * @param details - Optional validation error details
   */
  static validation(message: string, details?: unknown): AppError {
    return new AppError(ErrorCode.VALIDATION_ERROR, message, details);
  }

  /**
   * Creates an UNAUTHORIZED error for authentication failures.
   * @param message - Optional custom message (defaults to German)
   */
  static unauthorized(message = "Nicht autorisiert"): AppError {
    return new AppError(ErrorCode.UNAUTHORIZED, message);
  }

  /**
   * Creates a CUSTOMER_DELETED error for operations on soft-deleted customers.
   * @param customerId - ID of the deleted customer
   */
  static customerDeleted(customerId: string): AppError {
    return new AppError(
      ErrorCode.CUSTOMER_DELETED,
      `Kunde mit ID ${customerId} wurde gelöscht`
    );
  }

  /**
   * Creates a GDPR_VERSION_NOT_ACTIVE error for operations requiring an active GDPR version.
   * @param versionId - Optional ID of the inactive version
   */
  static gdprVersionNotActive(versionId?: string): AppError {
    const message = versionId
      ? `DSGVO-Version mit ID ${versionId} ist nicht aktiv`
      : "Keine aktive DSGVO-Version vorhanden";
    return new AppError(ErrorCode.GDPR_VERSION_NOT_ACTIVE, message);
  }

  /**
   * Creates a SIGNATURE_ALREADY_EXISTS error when a customer has already signed.
   * @param customerId - ID of the customer
   * @param versionId - Optional ID of the GDPR version
   */
  static signatureAlreadyExists(
    customerId: string,
    versionId?: string
  ): AppError {
    const message = versionId
      ? `Kunde ${customerId} hat DSGVO-Version ${versionId} bereits unterschrieben`
      : `Kunde ${customerId} hat bereits unterschrieben`;
    return new AppError(ErrorCode.SIGNATURE_ALREADY_EXISTS, message);
  }

  /**
   * Creates a PDF_GENERATION_ERROR for PDF creation failures.
   * @param message - Human-readable error message in German
   * @param cause - The underlying error that caused the failure
   */
  static pdfGeneration(message: string, cause?: unknown): AppError {
    return new AppError(ErrorCode.PDF_GENERATION_ERROR, message, cause);
  }

  /**
   * Creates an UNKNOWN error for unexpected failures.
   * @param message - Human-readable error message
   * @param cause - The underlying error
   */
  static unknown(message = "Ein unbekannter Fehler ist aufgetreten", cause?: unknown): AppError {
    return new AppError(ErrorCode.UNKNOWN, message, cause);
  }

  /**
   * Converts the error to a plain object for serialization.
   */
  toJSON(): { code: ErrorCodeType; message: string; details?: unknown } {
    return {
      code: this.code,
      message: this.message,
      ...(this.details !== undefined && { details: this.details }),
    };
  }

  /**
   * Type guard to check if an error is an AppError.
   */
  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
