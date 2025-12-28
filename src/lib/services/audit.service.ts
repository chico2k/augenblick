/**
 * Audit Service
 * Provides operations for customer change tracking and audit log management.
 */

import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { customerAudit } from "@/lib/db/schema";
import type { CustomerAudit } from "@/lib/db/schema/customer-audit";
import {
  type Result,
  type PaginationParams,
  type PaginatedResult,
  Ok,
  Err,
} from "./types";

/**
 * Audit action types for customer changes.
 */
export type AuditAction = "create" | "update" | "delete";

/**
 * Input for creating a new audit log entry.
 */
export interface CreateAuditLogInput {
  customerId: string;
  action: AuditAction;
  changes?: Record<string, unknown>;
  actorId?: string | null;
  actorName?: string | null;
}

/**
 * Parsed audit log entry with typed changes.
 */
export interface ParsedAuditLog extends Omit<CustomerAudit, "changes"> {
  changes: Record<string, unknown> | null;
}

/**
 * Audit Service for customer change tracking.
 */
export const auditService = {
  /**
   * Get all audit log entries for a specific customer.
   *
   * @param customerId - The customer's UUID
   * @param params - Pagination parameters
   * @returns Result containing paginated audit logs
   */
  async getForCustomer(
    customerId: string,
    params: PaginationParams = {}
  ): Promise<Result<PaginatedResult<ParsedAuditLog>>> {
    try {
      const page = params.page ?? 1;
      const limit = params.limit ?? 20;
      const offset = (page - 1) * limit;

      // Get total count for the customer
      const allLogs = await db
        .select()
        .from(customerAudit)
        .where(eq(customerAudit.customerId, customerId))
        .orderBy(desc(customerAudit.createdAt));

      const total = allLogs.length;
      const totalPages = Math.ceil(total / limit);

      // Apply pagination
      const paginatedLogs = allLogs.slice(offset, offset + limit);

      // Parse changes JSON for each log
      const parsedLogs: ParsedAuditLog[] = paginatedLogs.map((log) => ({
        ...log,
        changes: log.changes
          ? (JSON.parse(log.changes) as Record<string, unknown>)
          : null,
      }));

      return Ok({
        items: parsedLogs,
        total,
        page,
        limit,
        totalPages,
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Audit-Logs: ${String(error)}`,
      });
    }
  },

  /**
   * Create a new audit log entry for a customer change.
   *
   * @param input - Audit log data to create
   * @returns Result containing the created audit log entry
   */
  async log(input: CreateAuditLogInput): Promise<Result<CustomerAudit>> {
    try {
      const [auditLog] = await db
        .insert(customerAudit)
        .values({
          customerId: input.customerId,
          action: input.action,
          changes: input.changes ? JSON.stringify(input.changes) : null,
          actorId: input.actorId ?? null,
          actorName: input.actorName ?? null,
        })
        .returning();

      if (!auditLog) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen des Audit-Logs: Kein Eintrag erstellt",
        });
      }

      return Ok(auditLog);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen des Audit-Logs: ${String(error)}`,
      });
    }
  },

  /**
   * Log a customer creation event.
   *
   * @param customerId - The ID of the created customer
   * @param actorId - The ID of the user who created the customer
   * @param actorName - The name of the user who created the customer
   * @returns Result containing the created audit log entry
   */
  async logCreate(
    customerId: string,
    actorId?: string | null,
    actorName?: string | null
  ): Promise<Result<CustomerAudit>> {
    return this.log({
      customerId,
      action: "create",
      actorId,
      actorName,
    });
  },

  /**
   * Log a customer update event with field changes.
   *
   * @param customerId - The ID of the updated customer
   * @param changes - Object describing the field changes (before/after values)
   * @param actorId - The ID of the user who made the update
   * @param actorName - The name of the user who made the update
   * @returns Result containing the created audit log entry
   */
  async logUpdate(
    customerId: string,
    changes: Record<string, unknown>,
    actorId?: string | null,
    actorName?: string | null
  ): Promise<Result<CustomerAudit>> {
    return this.log({
      customerId,
      action: "update",
      changes,
      actorId,
      actorName,
    });
  },

  /**
   * Log a customer deletion event.
   *
   * @param customerId - The ID of the deleted customer
   * @param actorId - The ID of the user who deleted the customer
   * @param actorName - The name of the user who deleted the customer
   * @returns Result containing the created audit log entry
   */
  async logDelete(
    customerId: string,
    actorId?: string | null,
    actorName?: string | null
  ): Promise<Result<CustomerAudit>> {
    return this.log({
      customerId,
      action: "delete",
      actorId,
      actorName,
    });
  },

  /**
   * Get recent audit log entries across all customers.
   *
   * @param limit - Maximum number of entries to return (default: 50)
   * @returns Result containing recent audit logs
   */
  async getRecent(limit = 50): Promise<Result<ParsedAuditLog[]>> {
    try {
      const recentLogs = await db
        .select()
        .from(customerAudit)
        .orderBy(desc(customerAudit.createdAt))
        .limit(limit);

      // Parse changes JSON for each log
      const parsedLogs: ParsedAuditLog[] = recentLogs.map((log) => ({
        ...log,
        changes: log.changes
          ? (JSON.parse(log.changes) as Record<string, unknown>)
          : null,
      }));

      return Ok(parsedLogs);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Audit-Logs: ${String(error)}`,
      });
    }
  },

  /**
   * Get the count of audit log entries for a customer.
   *
   * @param customerId - The customer's UUID
   * @returns Result containing the count of audit logs
   */
  async getCountForCustomer(customerId: string): Promise<Result<number>> {
    try {
      const logs = await db
        .select()
        .from(customerAudit)
        .where(eq(customerAudit.customerId, customerId));

      return Ok(logs.length);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Zählen der Audit-Logs: ${String(error)}`,
      });
    }
  },
};

export type AuditService = typeof auditService;
