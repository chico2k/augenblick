# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Augenblick Chiemgau is a Next.js website for a lash extension and lift service based in Traunreut, Germany. The site is built with Next.js 13.1.6 (Pages Router), TypeScript, Tailwind CSS, and includes features like newsletter subscription, contact forms, and Google Analytics integration.

## Development Commands

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production and generate sitemap
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture & Structure

### Pages Router Structure
This project uses Next.js Pages Router (not App Router). All pages are in `src/pages/`:
- `src/pages/_app.tsx` - App wrapper with Navigation, Footer, Toast, Cookie Consent, and Google Tag Manager
- `src/pages/index.tsx` - Main landing page composed of multiple section components
- `src/pages/api/` - API routes for newsletter and email functionality

### Component Architecture
Components are located in `src/components/` and fall into these categories:
- **Section Components**: Large page sections like `Hero`, `Sandra`, `Angebot`, `Impressionen`, `Testimonials`, `Newsletter`, `Buchung`, `Anfahrt`
- **Service Pages**: `LastLift`, `LastExtension-1zu1`, `LastExtension-Volumen`
- **Layout Components**: `Navigation`, `Footer`, `CookieConsent`
- **UI Components**: Radix UI components in `src/components/ui/` (from shadcn/ui)

Most components use `react-scroll` with `<Element name="...">` for anchor-based navigation.

### API Routes
- `/api/newsletter` - Adds email to SendGrid marketing contacts (list ID: be1bdc02-c8d0-4bf6-b3a4-b53055256db9)
- `/api/email` - Sends templated booking/contact emails via SMTP2GO using nodemailer and Handlebars templates

### Form Handling
Forms use `react-hook-form` with `zod` for validation:
- Newsletter form: `src/components/Newsletter.tsx` with `schemaNewsLetter`
- Booking/Contact form: `src/components/Buchung.tsx` with `validationSchemaBuchung`
- Both use custom hooks in `src/lib/hooks/` for submission logic
- Contact form includes Google reCAPTCHA v2

### Environment Variables
Environment variables are validated using Zod in `src/env.mjs`. Required variables:
- `NODE_ENV` - environment (development/test/production)
- `SMTP2GO_API_KEY` - for contact form emails via SMTP2GO
- `SENDGRID_API_KEY` - for newsletter functionality (optional until migrated)
- `AXIOM_DATASET` - for production logging
- `AXIOM_TOKEN` - for production logging

Set `SKIP_ENV_VALIDATION=true` to bypass validation (e.g., for Docker builds).

### Email System
Contact form emails use **nodemailer** with **SMTP2GO**:
- Templates: Handlebars templates in `src/templates/` (`.hbs` files)
- Template renderer: `src/lib/email/template-renderer.ts`
- SMTP configuration: `mail.smtp2go.com:2525` with API key authentication
- Email sent to customer with BCC to `info@augenblick-chiemgau.com`

Newsletter still uses SendGrid API (to be migrated later).

### Logging
Logger is configured in `src/lib/logger/index.ts`:
- **Production**: Uses Axiom transport for centralized logging
- **Development**: Logs to console with simple format

### Styling
- Tailwind CSS with custom configuration
- Global styles in `src/styles/globals.css`
- Uses `keen-slider` for image galleries
- Toast notifications via `react-toastify`
- Fuchsia color scheme as primary brand color

### Analytics & Tracking
- Google Tag Manager (GTM-53QMDPJ) and Google Analytics (G-53QMDPJ) integrated
- Cookie consent system with `useConsent` hook
- Consent state controls analytics_storage and ad_storage
- Dynamic consent updates via gtag

### SEO
- Sitemap generation via `next-sitemap` (configured in `next-sitemap.config.js`)
- Runs automatically after build (`postbuild` script)
- Site URL: https://www.augenblick-chiemgau.com

### TypeScript Configuration
Strict mode enabled with:
- `noUncheckedIndexedAccess: true`
- `checkJs: true` - JavaScript files are also type-checked

## Common Patterns

### Adding a New Section to Homepage
1. Create component in `src/components/`
2. Wrap content in `<Element name="section-id">` from `react-scroll`
3. Import in `src/pages/index.tsx` (use dynamic import if not critical)
4. Add to `navigationLinks` in `src/lib/links.ts` if navigation item needed

### Creating a New Service Page
1. Create page file in `src/pages/` (e.g., `src/pages/new-service.tsx`)
2. Create component in `src/components/` (e.g., `src/components/NewService.tsx`)
3. Follow existing pattern from `lashlift.tsx` or `lashextension-*.tsx`
4. Add to sitemap config if needed
