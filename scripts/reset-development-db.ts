import "dotenv/config";

import { spawnSync } from "node:child_process";

const targetBranch = process.env.NEON_DEV_BRANCH ?? "development";
const projectId = process.env.NEON_PROJECT_ID;
const apiKey = process.env.NEON_API_KEY;

const protectedBranchNames = new Set(["main", "master", "prod", "production"]);

if (protectedBranchNames.has(targetBranch.toLowerCase())) {
  console.error(
    `Refusing to reset protected branch "${targetBranch}". Set NEON_DEV_BRANCH to your development branch.`,
  );
  process.exit(1);
}

if (!projectId) {
  console.error("NEON_PROJECT_ID is required. Set it in .env so this command never relies on Neon CLI context.");
  process.exit(1);
}

const args = [
  "--yes",
  "neonctl@2",
  "branches",
  "reset",
  targetBranch,
  "--parent",
  "--project-id",
  projectId,
];

console.log(
  `Resetting Neon branch "${targetBranch}" from its parent branch. Current data and schema on "${targetBranch}" will be replaced.`,
);

if (!apiKey) {
  console.log("NEON_API_KEY is not set; Neon CLI auth context will be used.");
}

const result = spawnSync("npx", args, {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
