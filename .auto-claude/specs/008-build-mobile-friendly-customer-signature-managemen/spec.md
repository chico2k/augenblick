# Specification: Mobile-Friendly Customer Signature Management System

## Overview

Build a comprehensive mobile-friendly customer management system for a studio using shadcn/ui components. The primary focus is enabling a quick workflow for collecting GDPR consent signatures during in-studio customer visits. The system includes a responsive customer table with signature status filtering, customer CRUD operations, a fullscreen signature capture flow, and GDPR version management. All UI components prioritize mobile usability with touch-friendly interactions while maintaining full desktop functionality.

## Workflow Type

**Type**: feature

**Rationale**: This is a new feature implementation requiring multiple new pages, components, services, and database schemas. The task involves building an entirely new customer management module with signature workflows from scratch, including frontend routes, UI components, server actions, and service layer integration.

## Task Scope

### Services Involved
- **main** (primary) - Next.js frontend with App Router for all pages, components, and server actions

### This Task Will:
- [ ] Install and configure shadcn/ui components (button, card, input, textarea, checkbox, badge, table, select, scroll-area, sheet, collapsible, form)
- [ ] Install additional dependencies (react-signature-canvas, @tanstack/react-table, react-markdown)
- [ ] Create mobile-first TopNav component with hamburger menu
- [ ] Build office layout wrapper with TopNav
- [ ] Implement customer table with search and signature status filtering
- [ ] Create customer detail page with signature status card
- [ ] Build customer create/edit forms with Zod validation
- [ ] Implement fullscreen signature capture flow (3-step: read → sign → success)
- [ ] Create GDPR version management interface
- [ ] Build customer and GDPR service layer with Drizzle ORM
- [ ] Implement server actions for form submissions
- [ ] Add customer audit logging

### Out of Scope:
- Authentication system (assumed existing `/login` and `/api/auth/logout`)
- Database schema design (assumed existing customers, gdpr_versions, signatures tables)
- Email notifications
- PDF generation for signed documents
- Multi-language support (German UI only)
- User role management

## Service Context

### Main (Next.js Frontend)

**Tech Stack:**
- Language: TypeScript
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- ORM: Drizzle
- Key directories: `src/` (source code), `tests/` (tests)

**Entry Point:** `src/app/page.tsx`

**How to Run:**
```bash
npm run dev
```

**Port:** 3000

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `src/lib/utils.ts` | main | Add `formatDate` utility function |
| `tailwind.config.js` | main | Ensure CSS variables are configured for shadcn/ui |
| `components.json` | main | Create shadcn/ui configuration file |

## Files to Create

| File | Service | Purpose |
|------|---------|---------|
| `src/components/layout/top-nav.tsx` | main | Mobile-first navigation with Sheet menu |
| `src/app/office/layout.tsx` | main | Office section layout wrapper |
| `src/app/office/page.tsx` | main | Redirect to /office/kunden |
| `src/app/office/kunden/page.tsx` | main | Customer list with table |
| `src/app/office/kunden/neu/page.tsx` | main | New customer form page |
| `src/app/office/kunden/[id]/page.tsx` | main | Customer detail page |
| `src/app/office/kunden/[id]/bearbeiten/page.tsx` | main | Edit customer page |
| `src/app/office/kunden/[id]/datenschutz/layout.tsx` | main | Fullscreen layout (no TopNav) |
| `src/app/office/kunden/[id]/datenschutz/page.tsx` | main | Signature flow page |
| `src/app/office/datenschutz/page.tsx` | main | GDPR version management |
| `src/components/customers/customer-table.tsx` | main | TanStack Table with filtering |
| `src/components/customers/customer-table-skeleton.tsx` | main | Loading skeleton for table |
| `src/components/customers/customer-form.tsx` | main | React Hook Form with Zod |
| `src/components/customers/audit-log.tsx` | main | Collapsible audit trail |
| `src/components/signature/signature-flow.tsx` | main | 3-step signature capture |
| `src/components/gdpr/gdpr-version-list.tsx` | main | List of GDPR versions |
| `src/components/gdpr/gdpr-version-form.tsx` | main | Create new GDPR version |
| `src/lib/services/customer.service.ts` | main | Customer data operations |
| `src/lib/services/gdpr.service.ts` | main | GDPR version operations |
| `src/lib/services/audit.service.ts` | main | Audit log operations |
| `src/app/actions/customer.actions.ts` | main | Server actions for customers |
| `src/app/actions/gdpr.actions.ts` | main | Server actions for GDPR |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| Existing Drizzle schema | Table definitions and relationships |
| Existing form components | React Hook Form integration patterns |
| Existing service layer | Result type pattern (isOk/isErr) |

## Patterns to Follow

### React Hook Form with Zod Validation

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const customerSchema = z.object({
  firstName: z.string().min(1, "Vorname erforderlich"),
  lastName: z.string().min(1, "Nachname erforderlich"),
  email: z.string().email("Ungültige E-Mail").or(z.literal("")).optional(),
  phone: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const form = useForm<CustomerFormData>({
  resolver: zodResolver(customerSchema),
  defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
});
```

**Key Points:**
- Use Zod for all form validation
- Optional email fields should use `.email().or(z.literal(""))` pattern
- Always provide defaultValues to avoid controlled/uncontrolled warnings

### TanStack Table with Filtering

```typescript
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

const table = useReactTable({
  data: filteredData,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: "includesString",
  state: { globalFilter },
  onGlobalFilterChange: setGlobalFilter,
});
```

**Key Points:**
- Headless library - provide UI via shadcn/ui Table components
- Use `flexRender()` for cell rendering
- Implement custom filter for signature status outside of table

### Signature Canvas Integration

```typescript
import SignatureCanvas from "react-signature-canvas";

const sigCanvas = useRef<SignatureCanvas>(null);

// Get signature as base64 PNG
const signatureData = sigCanvas.current?.toDataURL("image/png");

// Check if empty
const isEmpty = sigCanvas.current?.isEmpty();

// Clear canvas
sigCanvas.current?.clear();
```

**Key Points:**
- Always set `backgroundColor="white"` on canvas
- Validate canvas is not empty before submission
- Store signature as base64 PNG string

### Mobile-First Navigation

```typescript
<Sheet>
  <SheetTrigger asChild className="md:hidden">
    <Button variant="ghost" size="icon">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64">
    <nav className="flex flex-col gap-2 mt-8">
      {/* Navigation items */}
    </nav>
  </SheetContent>
</Sheet>
```

**Key Points:**
- Sheet component for mobile slide-out menu
- Hidden on desktop (`md:hidden` on trigger)
- Desktop nav items use inline layout (`hidden md:flex`)

### Service Layer Result Pattern

```typescript
import type { Result } from "@/lib/types";

async function getById(id: string): Promise<Result<Customer>> {
  try {
    const customer = await db.query.customers.findFirst({
      where: eq(customers.id, id),
    });
    if (!customer) {
      return { isErr: () => true, isOk: () => false, error: "Not found" };
    }
    return { isOk: () => true, isErr: () => false, value: customer };
  } catch (error) {
    return { isErr: () => true, isOk: () => false, error: String(error) };
  }
}
```

**Key Points:**
- Use Result type for error handling
- Check `result.isOk()` or `result.isErr()` before accessing values
- Access value with `result.value` when ok

## Requirements

### Functional Requirements

1. **Mobile-First Navigation**
   - Description: Sticky top navigation with hamburger menu on mobile, inline nav on desktop
   - Acceptance: Navigation accessible on all screen sizes, Sheet menu works on touch devices

2. **Customer List with Filtering**
   - Description: Table displaying customers with global search and signature status filter
   - Acceptance: Can search by name/phone, filter by signed/unsigned/all, click row to navigate

3. **Customer CRUD Operations**
   - Description: Create, read, update customers with validated forms
   - Acceptance: Forms validate on submit, success redirects to list, errors display as toast

4. **Signature Status Display**
   - Description: Visual indicators showing GDPR signature status
   - Acceptance: Green badge (OK) for signed, orange badge (Fehlt) for unsigned

5. **Fullscreen Signature Flow**
   - Description: 3-step process: read GDPR text → checkbox agree → capture signature
   - Acceptance: Cannot proceed without agreement, signature canvas validates non-empty

6. **GDPR Version Management**
   - Description: Create and activate GDPR versions with markdown content
   - Acceptance: Can create versions, set active version, content renders as markdown

7. **Customer Audit Log**
   - Description: Collapsible log showing customer change history
   - Acceptance: Shows create/update/delete actions with timestamps and user

### Edge Cases

1. **Empty signature canvas** - Show error toast "Bitte unterschreiben Sie im Feld" and prevent submission
2. **No customers found** - Display "Keine Kunden gefunden" in table
3. **Customer not found** - Trigger Next.js `notFound()` for 404 page
4. **No active GDPR version** - Block signature flow, show error
5. **Form validation errors** - Display inline error messages under fields
6. **Server action failure** - Show error toast with message
7. **Long GDPR text** - Scrollable area with fixed footer containing agree checkbox

## Implementation Notes

### DO
- Follow the shadcn/ui patterns for all UI components
- Use `cn()` utility from `@/lib/utils` for className merging
- Mark components with "use client" when using hooks (forms, tables, navigation)
- Use Suspense with skeleton fallbacks for async data loading
- Keep the signature flow fullscreen by using a separate layout without TopNav
- Use German labels for all UI text (Kunden, Datenschutz, Speichern, etc.)
- Store signatures as base64 PNG strings in the database
- Use toast notifications (sonner) for action feedback

### DON'T
- Don't create new utility functions when existing ones work
- Don't use client components where server components suffice
- Don't hard-code colors - use Tailwind CSS variables
- Don't skip form validation - all forms must use Zod schemas
- Don't forget loading states during async operations
- Don't block navigation - use `router.push()` for programmatic navigation

## Development Environment

### Start Services

```bash
npm run dev
```

### Service URLs
- Main Application: http://localhost:3000
- Customer List: http://localhost:3000/office/kunden
- GDPR Management: http://localhost:3000/office/datenschutz

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (existing)

### Package Installation

```bash
# Install shadcn/ui CLI components
npx shadcn@latest init
npx shadcn@latest add button card input textarea checkbox badge table select scroll-area sheet collapsible form

# Install additional dependencies
pnpm add react-signature-canvas react-markdown @tanstack/react-table
pnpm add -D @types/react-signature-canvas
```

## Success Criteria

The task is complete when:

1. [ ] All shadcn/ui components installed and configured
2. [ ] TopNav component works on mobile (Sheet menu) and desktop (inline)
3. [ ] Customer table displays with search and signature filter
4. [ ] Customer create/edit forms validate and submit correctly
5. [ ] Customer detail page shows signature status with action button
6. [ ] Signature flow captures and saves signatures successfully
7. [ ] GDPR version management allows creating and activating versions
8. [ ] No console errors during navigation
9. [ ] Existing tests still pass
10. [ ] All routes accessible and functional via browser

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests
| Test | File | What to Verify |
|------|------|----------------|
| Customer Form Validation | `tests/components/customer-form.test.tsx` | Zod schema validates required fields, email format |
| Signature Canvas Empty Check | `tests/components/signature-flow.test.tsx` | Prevents submission with empty canvas |
| Filter Logic | `tests/components/customer-table.test.tsx` | Signature filter correctly filters data |

### Integration Tests
| Test | Services | What to Verify |
|------|----------|----------------|
| Create Customer Flow | Form → Server Action → Database | Customer created in DB with correct data |
| Signature Submission | Canvas → Server Action → Database | Signature saved with customer and version IDs |
| GDPR Version Activation | Button → Server Action → Database | Only one version active at a time |

### End-to-End Tests
| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Customer Creation | 1. Navigate to /office/kunden/neu 2. Fill form 3. Submit | Redirect to customer list, customer visible in table |
| Signature Collection | 1. Open customer detail 2. Click "Jetzt unterschreiben" 3. Read GDPR 4. Agree 5. Sign 6. Confirm | Success screen, badge changes to green |
| Filter Customers | 1. Go to customer list 2. Select "Ohne Unterschrift" filter | Only customers without signatures shown |

### Browser Verification (if frontend)
| Page/Component | URL | Checks |
|----------------|-----|--------|
| Customer List | `http://localhost:3000/office/kunden` | Table renders, search works, rows clickable |
| Customer Detail | `http://localhost:3000/office/kunden/[id]` | Data displays, signature status correct |
| Signature Flow | `http://localhost:3000/office/kunden/[id]/datenschutz` | Fullscreen, canvas works, submit saves |
| Mobile Navigation | `http://localhost:3000/office` | Sheet menu opens on mobile width |

### Database Verification (if applicable)
| Check | Query/Command | Expected |
|-------|---------------|----------|
| Customer created | `SELECT * FROM customers WHERE id = 'xxx'` | Customer row exists with correct data |
| Signature saved | `SELECT * FROM signatures WHERE customer_id = 'xxx'` | Signature blob saved with version reference |
| GDPR version active | `SELECT * FROM gdpr_versions WHERE is_active = true` | Exactly one active version |

### QA Sign-off Requirements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Browser verification complete
- [ ] Mobile responsiveness verified (320px, 768px, 1024px widths)
- [ ] Database state verified
- [ ] No regressions in existing functionality
- [ ] Code follows established patterns
- [ ] No security vulnerabilities introduced
- [ ] Form validation prevents invalid submissions
- [ ] Toast notifications display correctly
- [ ] Loading states show during async operations
