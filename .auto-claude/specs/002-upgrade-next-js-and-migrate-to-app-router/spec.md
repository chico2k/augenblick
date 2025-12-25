# Specification: Upgrade Next.js and Migrate to App Router

## Overview

This task involves upgrading the Augenblick Chiemgau website from Next.js 13.1.6 to the latest stable version (15.x) and performing a complete architectural migration from the Pages Router to the App Router. The project is a German-language beauty/aesthetics business website with cookie consent management, Google Analytics integration, newsletter signup, and booking forms. The migration requires updating several dependencies with breaking changes (next-axiom, cookies-next) and converting all existing pages and API routes to the new App Router conventions.

## Workflow Type

**Type**: feature

**Rationale**: This is a comprehensive upgrade involving major version changes, architectural refactoring of the entire routing system, and updates to multiple dependencies with breaking changes. It requires careful planning, incremental implementation, and thorough testing across all pages and API endpoints.

## Task Scope

### Services Involved
- **main** (primary) - Next.js frontend application with API routes

### This Task Will:
- [ ] Upgrade Next.js from 13.1.6 to latest stable (15.x)
- [ ] Upgrade next-axiom from 0.17.0 to 1.x with pattern changes
- [ ] Upgrade cookies-next from 2.1.1 to 6.x with client/server split
- [ ] Migrate `src/pages/_app.tsx` to `src/app/layout.tsx`
- [ ] Migrate all page routes from `src/pages/*.tsx` to `src/app/*/page.tsx`
- [ ] Migrate API routes from `src/pages/api/*` to `src/app/api/*/route.ts`
- [ ] Convert `next/head` usage to Metadata API exports
- [ ] Update cookie handling for client/server component boundaries
- [ ] Remove i18n config from next.config.mjs (incompatible with App Router)
- [ ] Update all related dev dependencies (eslint-config-next, @next/bundle-analyzer)

### Out of Scope:
- Feature additions or UI changes
- Database schema changes
- New functionality beyond what exists today
- React version upgrade to 19 (staying on 18.x for compatibility)

## Service Context

### Main Service

**Tech Stack:**
- Language: TypeScript
- Framework: Next.js (13.1.6 → 15.x)
- Styling: Tailwind CSS
- ORM: Drizzle
- Package Manager: pnpm

**Key directories:**
- `src/pages` - Current Pages Router (to be migrated)
- `src/app` - New App Router (to be created)
- `src/components` - React components (22 components)
- `src/lib` - Utilities, hooks, database client
- `src/styles` - Global CSS

**Entry Point:** `src/pages/_app.tsx` → `src/app/layout.tsx`

**How to Run:**
```bash
pnpm dev
```

**Port:** 3000

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `package.json` | main | Upgrade next, next-axiom, cookies-next, react types, eslint-config-next |
| `next.config.mjs` | main | Remove i18n config, keep withAxiom wrapper |
| `src/env.mjs` | main | Add NEXT_PUBLIC_ prefixed vars for next-axiom |
| `src/pages/_app.tsx` | main | DELETE - migrate to `src/app/layout.tsx` |
| `src/pages/index.tsx` | main | DELETE - migrate to `src/app/page.tsx` |
| `src/pages/lashlift.tsx` | main | DELETE - migrate to `src/app/lashlift/page.tsx` |
| `src/pages/lashextension-1-zu-1-technik.tsx` | main | DELETE - migrate to `src/app/lashextension-1-zu-1-technik/page.tsx` |
| `src/pages/lashextension-volumentechnik.tsx` | main | DELETE - migrate to `src/app/lashextension-volumentechnik/page.tsx` |
| `src/pages/impressum.tsx` | main | DELETE - migrate to `src/app/impressum/page.tsx` |
| `src/pages/datenschutz.tsx` | main | DELETE - migrate to `src/app/datenschutz/page.tsx` |
| `src/pages/404.tsx` | main | DELETE - migrate to `src/app/not-found.tsx` |
| `src/pages/api/newsletter/index.ts` | main | DELETE - migrate to `src/app/api/newsletter/route.ts` |
| `src/pages/api/email/index.ts` | main | DELETE - migrate to `src/app/api/email/route.ts` |
| `src/lib/hooks/useConsent.ts` | main | Update cookies-next imports for client usage |
| `src/components/CookieConsent.tsx` | main | Add 'use client' directive |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `src/pages/_app.tsx` | Layout structure with Navigation, Footer, ToastContainer, CookieConsent |
| `src/pages/index.tsx` | Page component structure with dynamic imports and Head metadata |
| `src/pages/api/email/index.ts` | API route pattern with next-axiom withAxiom wrapper |
| `src/lib/hooks/useConsent.ts` | Cookie handling pattern (needs update for v6) |
| `src/lib/logger/index.ts` | Winston + Axiom logging pattern |
| `src/components/CookieConsent.tsx` | Client-side component using hooks |

## Patterns to Follow

### App Router Layout Pattern (NEW)

From `src/pages/_app.tsx`, convert to:

```tsx
// src/app/layout.tsx
import "../styles/globals.css";
import "keen-slider/keen-slider.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { AxiomWebVitals } from "next-axiom";
import type { Metadata } from "next";

// Dynamic imports for client components
import dynamic from "next/dynamic";
const DynamicConsent = dynamic(() => import("../components/CookieConsent"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Augenblick Chiemgau",
  description: "Augenblick Chiemgau - Wimperverlängerung Lashlift Traunreut",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <AxiomWebVitals />
        <Navigation />
        {children}
        <ToastContainer />
        <DynamicConsent />
        <Footer />
      </body>
    </html>
  );
}
```

**Key Points:**
- Metadata API replaces `next/head` in layouts
- `AxiomWebVitals` component replaces `reportWebVitals` export
- Layout receives `children` prop, not `Component/pageProps`
- Google Analytics scripts move to separate client component

### Page Component Pattern (NEW)

From `src/pages/index.tsx`, convert to:

```tsx
// src/app/page.tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
// ... component imports

export const metadata: Metadata = {
  title: "Augenblick Chiemgau",
  description: "Augenblick Chiemgau - Wimperverlängerung Lashlift Traunreut",
};

// Client components with dynamic import
const Newsletter = dynamic(() => import("../components/Newsletter"), {
  ssr: false,
});
// ... other dynamic imports

export default function HomePage() {
  return (
    <section className="relative font-sans">
      {/* page content */}
    </section>
  );
}
```

**Key Points:**
- Export `metadata` object instead of using `<Head>`
- No `NextPage` type needed - just regular function component
- Dynamic imports remain the same

### API Route Pattern (NEW)

From `src/pages/api/email/index.ts`, convert to:

```tsx
// src/app/api/email/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAxiom, AxiomRequest } from "next-axiom";
import nodemailer from "nodemailer";
// ... other imports

const transporter = nodemailer.createTransport({
  // ... config
});

async function handler(req: AxiomRequest) {
  try {
    const formValues = await req.json();
    // ... process request

    await req.log.flush(); // REQUIRED in App Router
    return NextResponse.json({ error: "" });
  } catch (error) {
    await req.log.flush();
    return NextResponse.json({ error: "Mail Delivery failed" }, { status: 500 });
  }
}

export const POST = withAxiom(handler);
```

**Key Points:**
- Named exports (GET, POST, etc.) instead of default export
- `NextRequest`/`NextResponse` instead of `NextApiRequest`/`NextApiResponse`
- Must call `await req.log.flush()` before returning in next-axiom 1.x
- Use `await req.json()` instead of `req.body`

### cookies-next Client Pattern (NEW)

From `src/lib/hooks/useConsent.ts`, update to:

```tsx
// src/lib/hooks/useConsent.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { setCookie, hasCookie, getCookie } from "cookies-next/client";

export const useConsent = () => {
  // ... same logic, just import from 'cookies-next/client'
};
```

**Key Points:**
- Import from `cookies-next/client` for client components
- Add `"use client"` directive at top of file
- Cookie operations in client components work the same

### Client Component Directive Pattern

Components using hooks, event handlers, or browser APIs need `'use client'`:

```tsx
// src/components/CookieConsent.tsx
"use client";

import Link from "next/link";
import { useConsent } from "../lib/hooks/useConsent";

function Consent() {
  // ... component with hooks and event handlers
}

export default Consent;
```

**Key Points:**
- Add `"use client"` as first line
- All components using useState, useEffect, onClick, etc. need this
- Components imported by client components are automatically client

## Requirements

### Functional Requirements

1. **Next.js Version Upgrade**
   - Description: Upgrade Next.js from 13.1.6 to latest stable 15.x
   - Acceptance: `pnpm build` succeeds, `pnpm dev` starts without errors

2. **Pages Router to App Router Migration**
   - Description: Move all routes from `src/pages/` to `src/app/` directory
   - Acceptance: All 7 pages render correctly at same URLs

3. **API Routes Migration**
   - Description: Convert API routes to App Router format with route.ts files
   - Acceptance: Newsletter signup and booking form submissions work

4. **next-axiom Upgrade**
   - Description: Update to v1.x with new patterns for logging
   - Acceptance: Logs appear in Axiom dashboard, web vitals recorded

5. **cookies-next Upgrade**
   - Description: Update to v6.x with client/server split imports
   - Acceptance: Cookie consent banner works, consent persists across sessions

6. **Metadata Migration**
   - Description: Replace `next/head` with Metadata API exports
   - Acceptance: Page titles and descriptions appear correctly

7. **Configuration Updates**
   - Description: Update next.config.mjs for App Router compatibility
   - Acceptance: Build completes without i18n/App Router conflicts

### Edge Cases

1. **Google Analytics Script Loading** - Move GA/GTM scripts to a client component with 'use client' since they use window object
2. **Cookie Consent State Hydration** - Ensure consent state doesn't flash on page load by using dynamic import with ssr: false
3. **API Route Body Parsing** - Use `await request.json()` instead of direct body access
4. **Logger Flush in API Routes** - Always call `await log.flush()` before returning response
5. **Dynamic Imports in Server Components** - Can only dynamically import client components from server components

## Implementation Notes

### DO
- Follow the pattern in `src/pages/_app.tsx` for root layout structure
- Reuse existing components from `src/components/` - most need only 'use client' directive
- Keep the same URL structure (no route changes)
- Test each page individually after migration
- Run `pnpm build` frequently to catch type errors early
- Update one page at a time, verifying functionality
- Import from `cookies-next/client` in client components

### DON'T
- Don't use `next/router` - use `next/navigation` instead (useRouter, usePathname, useSearchParams)
- Don't mix Pages Router and App Router for the same routes
- Don't forget to flush logger in API routes
- Don't use hooks in Server Components (no 'use client' directive)
- Don't access cookies in Server Components using cookies-next client methods
- Don't leave i18n config enabled in next.config.mjs

## Development Environment

### Start Services

```bash
pnpm dev
```

### Service URLs
- Main Application: http://localhost:3000

### Required Environment Variables
- `DATABASE_URL`: Neon database connection string
- `SENDGRID_API_KEY`: SendGrid API key for newsletter
- `SMTP2GO_USERNAME`: SMTP2GO username for email
- `SMTP2GO_PASSWORD`: SMTP2GO password for email
- `AXIOM_DATASET`: Axiom dataset name (winston)
- `AXIOM_TOKEN`: Axiom API token
- `NEXT_PUBLIC_AXIOM_DATASET`: (NEW) Client-side Axiom dataset
- `NEXT_PUBLIC_AXIOM_TOKEN`: (NEW) Client-side Axiom token

## Success Criteria

The task is complete when:

1. [ ] Next.js upgraded to 15.x and builds successfully
2. [ ] All pages render at their original URLs
3. [ ] Cookie consent banner appears and saves preferences
4. [ ] Newsletter signup form works (SendGrid integration)
5. [ ] Booking form works (SMTP2GO/nodemailer integration)
6. [ ] Google Analytics tracking works with consent
7. [ ] No console errors in browser
8. [ ] All TypeScript compilation passes
9. [ ] `pnpm lint` passes
10. [ ] Pages directory is removed (all migrated)

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests
| Test | File | What to Verify |
|------|------|----------------|
| Cookie consent hook | `tests/useConsent.test.ts` | Cookie read/write works with new library |
| API route handlers | `tests/api/email.test.ts` | Request parsing and response format |

### Integration Tests
| Test | Services | What to Verify |
|------|----------|----------------|
| Newsletter signup | Frontend ↔ API ↔ SendGrid | Form submission triggers API, SendGrid called |
| Booking form | Frontend ↔ API ↔ SMTP2GO | Form submission sends email via nodemailer |

### End-to-End Tests
| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Homepage load | 1. Visit / 2. Wait for hydration | All sections render, no console errors |
| Cookie consent | 1. Visit / 2. Click accept 3. Reload | Consent saved, banner hidden |
| Page navigation | 1. Visit / 2. Click each nav link | All pages load correctly |
| Newsletter signup | 1. Enter email 2. Submit | Success toast, email added to SendGrid |
| Booking form | 1. Fill form 2. Submit | Success toast, email received |

### Browser Verification (if frontend)
| Page/Component | URL | Checks |
|----------------|-----|--------|
| Home | `http://localhost:3000/` | Hero, sections, navigation visible |
| Lashlift | `http://localhost:3000/lashlift` | Content renders, metadata correct |
| Lashextension 1:1 | `http://localhost:3000/lashextension-1-zu-1-technik` | Content renders |
| Lashextension Volumen | `http://localhost:3000/lashextension-volumentechnik` | Content renders |
| Impressum | `http://localhost:3000/impressum` | Legal content visible |
| Datenschutz | `http://localhost:3000/datenschutz` | Privacy policy visible |
| 404 | `http://localhost:3000/nonexistent` | Custom 404 page shows |

### Build Verification
| Check | Command | Expected |
|-------|---------|----------|
| Build succeeds | `pnpm build` | Exit code 0, no errors |
| Lint passes | `pnpm lint` | Exit code 0, no errors |
| Type check | `pnpm tsc --noEmit` | Exit code 0 |
| Dev server starts | `pnpm dev` | Server running on port 3000 |

### QA Sign-off Requirements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Browser verification complete for all 7 pages + 404
- [ ] Build and lint pass
- [ ] No regressions in existing functionality
- [ ] Code follows established patterns (client/server split)
- [ ] No security vulnerabilities introduced
- [ ] Cookie consent persists across sessions
- [ ] Google Analytics fires only after consent
