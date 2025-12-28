# Specification: Configure Neon Database for Serverless Deployment

## Overview

This task sets up Neon PostgreSQL as the database solution for the augenblick Next.js application, configured specifically for serverless deployment. The implementation will use Drizzle ORM for type-safe database operations with the neon-http adapter (optimized for serverless), following SOLID principles in the database client architecture. Importantly, all naming conventions will avoid using "neon" to maintain provider-agnostic code.

## Workflow Type

**Type**: feature

**Rationale**: This is a new feature implementation that adds database infrastructure to an existing Next.js application. It requires creating new files for database client, schema definitions, and configuration - fundamentally adding new functionality rather than modifying existing behavior.

## Task Scope

### Services Involved
- **main** (primary) - Next.js application that will consume the database client

### This Task Will:
- [ ] Install required dependencies (`drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`, `ws`)
- [ ] Create database client abstraction following SOLID principles
- [ ] Set up Drizzle schema structure
- [ ] Configure drizzle-kit for migrations
- [ ] Update environment variable configuration to include DATABASE_URL
- [ ] Create example schema to verify setup

### Out of Scope:
- Actual application data models (beyond example schema)
- API endpoints that use the database
- Database seeding or initial data migration
- Authentication/authorization on database operations
- Connection pooling optimization beyond basic serverless setup

## Service Context

### Main Service (Next.js Application)

**Tech Stack:**
- Language: TypeScript
- Framework: Next.js 13.1.6
- Package Manager: pnpm
- Key directories: `src/lib`, `src/pages`, `src/components`

**Entry Point:** `src/pages/_app.tsx`

**How to Run:**
```bash
pnpm dev
```

**Port:** 3000

**Node.js Version:** v20.19.6 (requires `ws` package for WebSocket support)

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `package.json` | main | Add drizzle-orm, @neondatabase/serverless, ws dependencies and drizzle-kit devDependency |
| `src/env.mjs` | main | Add DATABASE_URL to server schema and processEnv |
| `.env.example` | main | Add DATABASE_URL template |
| `.env` | main | Add actual DATABASE_URL (user must configure) |

## Files to Create

| File | Service | Purpose |
|------|---------|---------|
| `src/lib/db/index.ts` | main | Database client export (provider-agnostic naming) |
| `src/lib/db/client.ts` | main | Low-level database connection with SOLID abstraction |
| `src/lib/db/schema/index.ts` | main | Schema barrel export |
| `src/lib/db/schema/example.ts` | main | Example schema to verify setup |
| `src/lib/db/types.ts` | main | TypeScript types and interfaces |
| `drizzle.config.ts` | main | Drizzle-kit configuration for migrations |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `src/lib/logger/index.ts` | Module structure with default export pattern |
| `src/env.mjs` | Environment variable validation with zod |
| `src/lib/email/template-renderer.ts` | TypeScript interface definitions and typed exports |

## Patterns to Follow

### Environment Variable Pattern

From `src/env.mjs`:

```typescript
const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().url(),
  // ... other vars
});
```

**Key Points:**
- Use zod for validation
- Add to both schema and processEnv object
- URL validation for connection strings

### Module Export Pattern

From `src/lib/logger/index.ts`:

```typescript
import winston from "winston";

const Logger = winston.createLogger({
  // config
});

export default Logger;
```

**Key Points:**
- Single responsibility - one module, one purpose
- Clean default export for primary interface
- Environment-aware configuration

### Interface Definition Pattern

From `src/lib/email/template-renderer.ts`:

```typescript
export interface BookingEmailData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}
```

**Key Points:**
- Export interfaces for type sharing
- Use optional properties where appropriate
- Descriptive naming without provider specifics

## Requirements

### Functional Requirements

1. **Database Client Initialization**
   - Description: Create a type-safe database client using Drizzle ORM with neon-http adapter for serverless
   - Acceptance: `import { db } from '@/lib/db'` works and can execute queries

2. **Schema Definition Structure**
   - Description: Set up schema organization pattern with example table
   - Acceptance: Example schema compiles and can be used for type inference

3. **Migration Configuration**
   - Description: Configure drizzle-kit for schema migrations
   - Acceptance: `pnpm drizzle-kit generate` and `pnpm drizzle-kit migrate` work correctly

4. **Environment Variable Integration**
   - Description: Integrate DATABASE_URL into existing env validation
   - Acceptance: App fails fast with clear error if DATABASE_URL is missing/invalid

5. **SOLID Principles Compliance**
   - Description: Database client follows SOLID principles
   - Acceptance:
     - Single Responsibility: db client only handles connection
     - Open/Closed: Easy to extend with new schemas without modifying client
     - Dependency Inversion: Uses interfaces, not concrete implementations in consuming code

### Edge Cases

1. **Missing DATABASE_URL** - Application should fail fast with descriptive error during startup via env.mjs validation
2. **Invalid Connection String** - Zod validation should catch malformed URLs before connection attempt
3. **Connection Timeout** - HTTP-based driver handles this gracefully (no persistent connections)
4. **Cold Start Performance** - HTTP driver minimizes cold start impact (no WebSocket overhead)

## Implementation Notes

### DO
- Follow the pattern in `src/lib/logger/index.ts` for module structure
- Reuse the zod validation pattern from `src/env.mjs` for DATABASE_URL
- Use neon-http adapter (not neon-serverless) for simple queries
- Name files generically (e.g., `db`, `client`, `schema`) - avoid "neon" in names
- Create barrel exports (`index.ts`) for clean imports
- Use `$inferSelect` and `$inferInsert` for type generation
- Install `ws` package (required for Node.js v20)

### DON'T
- Create WebSocket connections at module level in serverless
- Use "neon" in any file names, variable names, or type names
- Mix HTTP and WebSocket drivers without understanding trade-offs
- Initialize database connections at module scope (for serverless safety)
- Create separate pool management (HTTP driver is stateless)
- Add complex abstractions when simple functions suffice

## Architecture: SOLID Implementation

### Single Responsibility Principle (SRP)
- `client.ts` - Only handles database connection
- `schema/*.ts` - Only defines table structures
- `types.ts` - Only defines TypeScript interfaces
- `index.ts` - Only exports public API

### Open/Closed Principle (OCP)
- Schema folder allows adding new schemas without modifying client
- Client accepts any valid Drizzle schema

### Liskov Substitution Principle (LSP)
- DB client interface allows potential mock/test substitution

### Interface Segregation Principle (ISP)
- Export only what's needed: `db`, schema types, query helpers

### Dependency Inversion Principle (DIP)
- Consuming code depends on abstract `db` export, not concrete Neon implementation
- Environment configuration abstracted through env.mjs

## Development Environment

### Start Services

```bash
# Install dependencies first
pnpm install

# Start development server
pnpm dev
```

### Service URLs
- Main Application: http://localhost:3000

### Required Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string (format: `postgres://user:pass@ep-xxx.region.aws.neon.tech/dbname`)

### Database Migration Commands
```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate

# Push schema directly (development only)
pnpm drizzle-kit push

# Open Drizzle Studio (database GUI)
pnpm drizzle-kit studio
```

## Success Criteria

The task is complete when:

1. [ ] All dependencies installed (`drizzle-orm`, `@neondatabase/serverless`, `ws`, `drizzle-kit`)
2. [ ] Database client exports from `src/lib/db/index.ts` without errors
3. [ ] Environment validation includes DATABASE_URL with proper error messages
4. [ ] drizzle.config.ts properly configured for migrations
5. [ ] Example schema compiles and exports types correctly
6. [ ] `pnpm drizzle-kit generate` runs without errors
7. [ ] No "neon" terminology in any created file names or exports
8. [ ] Code follows SOLID principles as outlined
9. [ ] Existing tests still pass
10. [ ] Application starts without console errors (with valid DATABASE_URL)

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests
| Test | File | What to Verify |
|------|------|----------------|
| Database client export | `tests/db/client.test.ts` | Client initializes and exports correctly |
| Schema type inference | `tests/db/schema.test.ts` | Types are correctly inferred from schema |
| Environment validation | `tests/env.test.ts` | DATABASE_URL validation works correctly |

### Integration Tests
| Test | Services | What to Verify |
|------|----------|----------------|
| Database connection | db client -> Neon | Can connect and execute simple query |
| Schema migration | drizzle-kit -> Neon | Migrations generate and apply correctly |

### End-to-End Tests
| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Connection verify | 1. Start app 2. Import db 3. Execute query | Query returns result without errors |
| Schema push | 1. Define schema 2. Run drizzle-kit push | Schema appears in Neon dashboard |

### Command-Line Verification
| Command | Expected Output |
|---------|-----------------|
| `pnpm drizzle-kit generate` | Generates SQL migration files in `migrations/` |
| `pnpm drizzle-kit migrate` | Applies migrations, outputs success message |
| `pnpm dev` | Server starts without DATABASE_URL errors |

### Environment Verification
| Check | How to Test | Expected |
|-------|-------------|----------|
| Missing DATABASE_URL | Remove from .env, run `pnpm dev` | Throws descriptive error |
| Invalid DATABASE_URL | Set to "invalid", run `pnpm dev` | Zod validation error |
| Valid DATABASE_URL | Set correctly, run `pnpm dev` | App starts normally |

### Code Quality Checks
| Check | Command/Method | Expected |
|-------|----------------|----------|
| TypeScript compilation | `pnpm build` | No type errors |
| ESLint | `pnpm lint` | No linting errors in new files |
| No "neon" in names | `grep -r "neon" src/lib/db/` | No matches |

### File Structure Verification
| Check | Path | Expected |
|-------|------|----------|
| Client exists | `src/lib/db/client.ts` | File exists with connection logic |
| Index exports | `src/lib/db/index.ts` | Exports db client and types |
| Schema directory | `src/lib/db/schema/` | Directory exists with index.ts |
| Drizzle config | `drizzle.config.ts` | Valid configuration file |

### QA Sign-off Requirements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes on new files
- [ ] Environment variable validation works correctly
- [ ] drizzle-kit commands execute successfully
- [ ] No "neon" terminology in code (provider-agnostic)
- [ ] SOLID principles followed (verified by code review)
- [ ] Application starts with valid DATABASE_URL
- [ ] No regressions in existing functionality
