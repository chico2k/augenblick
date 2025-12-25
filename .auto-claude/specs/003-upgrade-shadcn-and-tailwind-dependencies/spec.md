# Specification: Upgrade Shadcn UI and Tailwind CSS to Latest Versions

## Overview

This task involves upgrading Tailwind CSS from v3.4.18 to v4.x and updating shadcn/ui components to the latest version compatible with Tailwind v4. The upgrade requires migrating from JavaScript-based configuration to CSS-based configuration, replacing the animation plugin, updating PostCSS configuration, and potentially updating shadcn UI components. This is a significant migration that affects the project's styling infrastructure.

## Workflow Type

**Type**: feature

**Rationale**: While technically a dependency upgrade, the migration from Tailwind v3 to v4 constitutes a major architectural change in how styles are configured. The CSS-first configuration approach, plugin changes, and potential breaking changes in utility classes make this more complex than a simple version bump.

## Task Scope

### Services Involved
- **main** (primary) - Next.js frontend application with Tailwind CSS styling and shadcn/ui components

### This Task Will:
- [ ] Upgrade Tailwind CSS from v3.4.18 to v4.x
- [ ] Replace `tailwindcss-animate` with `tw-animate-css` for v4 compatibility
- [ ] Migrate `tailwind.config.js` to CSS-based `@theme` configuration
- [ ] Convert `postcss.config.cjs` to `postcss.config.mjs` with `@tailwindcss/postcss`
- [ ] Update `src/style/global.css` with new Tailwind v4 directives
- [ ] Update `components.json` for Tailwind v4 compatibility
- [ ] Migrate container customizations to CSS `@utility` directives
- [ ] Update shadcn/ui components as needed for v4 compatibility
- [ ] Remove `autoprefixer` (now automatic in v4)

### Out of Scope:
- Adding new shadcn/ui components beyond what's currently installed
- Migrating to React 19 (current: React 18.2.0)
- Converting HSL color variables to OKLCH (optional enhancement, not required)
- Upgrading Radix UI primitives unless required for compatibility

## Service Context

### Main Service

**Tech Stack:**
- Language: TypeScript
- Framework: Next.js 15.5.9
- Styling: Tailwind CSS 3.4.18 (upgrading to v4)
- UI Library: shadcn/ui with Radix UI primitives
- Package Manager: pnpm

**Key Directories:**
- `src/` - Source code
- `src/components/ui/` - shadcn/ui components
- `src/style/` - Global styles
- `src/lib/` - Utilities (including `cn` function)

**Entry Point:** `src/app/` (Next.js App Router)

**How to Run:**
```bash
pnpm dev
```

**Port:** 3000

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `package.json` | main | Remove `tailwindcss-animate`, `autoprefixer`; upgrade `tailwindcss` to v4; add `@tailwindcss/postcss`, `tw-animate-css` |
| `tailwind.config.js` | main | Migrate theme configuration to CSS-based approach (may become minimal or removed) |
| `tailwind.config.cjs` | main | Remove (redundant legacy file) |
| `postcss.config.cjs` | main | Convert to `postcss.config.mjs` with `@tailwindcss/postcss` plugin |
| `src/style/global.css` | main | Replace `@tailwind` directives with `@import "tailwindcss"`; add `@theme` block for custom colors; add `@utility container` for container customization |
| `components.json` | main | Update `tailwind.config` property to empty string for v4 compatibility |
| `src/components/ui/dialog.tsx` | main | Review for utility class updates; update `ring-*` and `outline-none` classes if affected |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `src/lib/utils.ts` | The `cn()` utility function remains unchanged for v4 |
| `src/components/ui/dialog.tsx` | Current shadcn component pattern using Radix UI and forwardRef |
| `src/style/global.css` | Current CSS variable structure for theme colors |

## Patterns to Follow

### cn() Utility Function

From `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Key Points:**
- This pattern remains unchanged in Tailwind v4
- Dependencies `clsx` and `tailwind-merge` are still compatible
- Continue using this for all className merging

### Tailwind v4 CSS Configuration Pattern

For `src/style/global.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --color-border: hsl(214.3 31.8% 91.4%);
  --color-input: hsl(214.3 31.8% 91.4%);
  --color-ring: hsl(222.2 84% 4.9%);
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  /* ... additional theme colors */

  --radius: 0.5rem;
}

@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
  @media (width >= 1400px) {
    max-width: 1400px;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Key Points:**
- Replace `@tailwind base/components/utilities` with single `@import "tailwindcss"`
- Use `@theme` block for custom theme values instead of JS config
- Container customization moves to `@utility container` directive
- Color values can remain as HSL (OKLCH migration optional)

### PostCSS v4 Configuration Pattern

For `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Key Points:**
- Use `.mjs` extension for ES module format
- Only need `@tailwindcss/postcss` plugin
- Autoprefixer is no longer needed (included automatically)

## Requirements

### Functional Requirements

1. **Tailwind CSS v4 Upgrade**
   - Description: Upgrade from Tailwind CSS v3.4.18 to latest v4.x
   - Acceptance: Build completes successfully; all styles render correctly

2. **Animation Plugin Migration**
   - Description: Replace `tailwindcss-animate` with `tw-animate-css`
   - Acceptance: All animations (accordion, dialog transitions) work as before

3. **Configuration Migration**
   - Description: Migrate from JS-based to CSS-based Tailwind configuration
   - Acceptance: All theme colors, border radius, and custom utilities function correctly

4. **PostCSS Update**
   - Description: Update PostCSS configuration for Tailwind v4
   - Acceptance: Build pipeline processes CSS correctly

5. **shadcn/ui Compatibility**
   - Description: Ensure shadcn/ui components work with Tailwind v4
   - Acceptance: Dialog component and any other UI components render and function correctly

### Edge Cases

1. **Utility Class Changes** - Classes like `ring` (now 1px default), `outline-none` (now `outline-hidden`), `shadow-sm` (now `shadow-xs`) may need updating in components
2. **Dark Mode** - Ensure `darkMode: ["class"]` behavior is preserved in v4 configuration
3. **Content Paths** - Verify v4 auto-detection works or configure content sources explicitly
4. **Custom Keyframes** - Accordion animations defined in config need migration to CSS

## Implementation Notes

### DO
- Run the official upgrade tool first: `npx @tailwindcss/upgrade`
- Create a new git branch before starting the upgrade
- Review all changes made by the upgrade tool carefully
- Test each component after migration
- Keep HSL color format (OKLCH migration is optional)
- Verify dark mode toggles correctly after migration

### DON'T
- Don't blindly accept all upgrade tool changes without review
- Don't remove the `cn()` utility function - it's still needed
- Don't upgrade to React 19 as part of this task
- Don't overwrite customized shadcn components without backing them up
- Don't remove `class-variance-authority`, `clsx`, or `tailwind-merge` dependencies

## Development Environment

### Start Services

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Service URLs
- Main Application: http://localhost:3000

### Required Environment Variables
- `SENDGRID_API_KEY`: Email service API key
- `AXIOM_DATASET`: Logging dataset name
- `AXIOM_TOKEN`: Logging service token
- `DATABASE_URL`: PostgreSQL connection string

### Node.js Requirement
- **Current Version:** v20.19.6 ✓
- **Required:** Node.js 20+

## Success Criteria

The task is complete when:

1. [ ] Tailwind CSS v4.x is installed and configured
2. [ ] `tailwindcss-animate` replaced with `tw-animate-css`
3. [ ] `postcss.config.mjs` uses `@tailwindcss/postcss`
4. [ ] `src/style/global.css` uses new `@import` and `@theme` syntax
5. [ ] `components.json` updated for v4 compatibility
6. [ ] Container customization works via CSS `@utility`
7. [ ] All shadcn/ui components render correctly
8. [ ] Dark mode works correctly
9. [ ] No console errors in browser
10. [ ] `pnpm build` completes successfully
11. [ ] Development server starts without errors

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests
| Test | File | What to Verify |
|------|------|----------------|
| cn() utility | `src/lib/utils.ts` | Function correctly merges class names |
| Component exports | `src/components/ui/dialog.tsx` | All exports available and TypeScript compiles |

### Integration Tests
| Test | Services | What to Verify |
|------|----------|----------------|
| Tailwind CSS Build | main | CSS builds without errors |
| Next.js Build | main | Full production build succeeds |

### End-to-End Tests
| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Page Load | 1. Start dev server 2. Navigate to homepage | Page loads with correct styling |
| Dark Mode Toggle | 1. Toggle dark mode (if available) 2. Observe color changes | Theme colors switch correctly |
| Dialog Component | 1. Open a dialog 2. Observe animations 3. Close dialog | Animations work, styling correct |

### Browser Verification
| Page/Component | URL | Checks |
|----------------|-----|--------|
| Homepage | `http://localhost:3000/` | All Tailwind classes render correctly |
| Dialog Component | Any page with dialog | Overlay, transitions, and close button work |
| Responsive Design | `http://localhost:3000/` | Container and responsive utilities work |

### Build Verification
| Check | Command | Expected |
|-------|---------|----------|
| Production build | `pnpm build` | Build completes without errors |
| Dev server | `pnpm dev` | Server starts, no CSS errors |
| Type check | `pnpm lint` | No TypeScript errors |

### Dependency Verification
| Check | Command | Expected |
|-------|---------|----------|
| Tailwind version | `pnpm list tailwindcss` | v4.x installed |
| Animation plugin | `pnpm list tw-animate-css` | Package installed |
| Removed packages | `pnpm list tailwindcss-animate` | Package not found |

### QA Sign-off Requirements
- [ ] Production build passes
- [ ] Development server starts without errors
- [ ] All pages render with correct styling
- [ ] Dark mode functions correctly
- [ ] Dialog and other UI components work
- [ ] Animations (accordion, transitions) work
- [ ] No console errors in browser
- [ ] No regressions in existing functionality
- [ ] Container layout works correctly
- [ ] Responsive design unaffected

## Upgrade Command Reference

```bash
# Step 1: Create branch
git checkout -b upgrade/tailwind-v4

# Step 2: Run official upgrade tool
npx @tailwindcss/upgrade

# Step 3: Install new animation plugin
pnpm remove tailwindcss-animate
pnpm add -D tw-animate-css

# Step 4: Verify installation
pnpm install
pnpm build

# Step 5: Test development
pnpm dev
```

## Rollback Plan

If the upgrade causes critical issues:

```bash
# Discard all changes
git checkout -- .
git clean -fd

# Or revert to previous commit
git reset --hard HEAD~1

# Reinstall dependencies
pnpm install
```
