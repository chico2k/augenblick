/**
 * Script to push database schema to Neon using Drizzle Kit.
 * Loads environment variables from .env file before executing.
 */
import "dotenv/config";
import { execSync } from "child_process";

console.log("Pushing database schema to Neon...");
execSync("npx drizzle-kit push", { stdio: "inherit" });
console.log("Schema push complete.");
