/**
 * TypeScript interfaces for database client abstraction.
 * Following SOLID principles - this file only defines interfaces (SRP).
 * Provider-agnostic naming to support Dependency Inversion Principle.
 */

/**
 * Configuration options for database connection
 */
export interface DatabaseConfig {
  connectionString: string;
  ssl?: boolean;
}

/**
 * Generic query result type for database operations
 */
export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
}

/**
 * Database client interface for dependency inversion.
 * Consuming code depends on this abstraction, not concrete implementation.
 */
export interface DatabaseClient {
  /** Execute a query and return typed results */
  query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
}

/**
 * Transaction options for database operations
 */
export interface TransactionOptions {
  isolationLevel?: "read uncommitted" | "read committed" | "repeatable read" | "serializable";
}

/**
 * Schema table metadata for type inference support
 */
export interface TableMetadata {
  name: string;
  schema?: string;
}
