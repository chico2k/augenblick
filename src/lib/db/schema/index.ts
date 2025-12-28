/**
 * Schema barrel export file.
 * Re-exports all table schemas and types for clean imports.
 * Following SOLID principles - Open/Closed: add new schemas here without modifying client.
 */

export * from "./auth";
export * from "./customers";
export * from "./customer-audit";
export * from "./gdpr-versions";
export * from "./signatures";
export * from "./relations";

// EÜR Module
export * from "./treatment-types";
export * from "./sync-status";
export * from "./sync-logs";
export * from "./outlook-appointments";
export * from "./income-entries";