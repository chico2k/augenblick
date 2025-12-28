# Production Deployment Guide - Vercel + Neon

This guide covers deploying Augenblick to production using Vercel and Neon PostgreSQL with automated database migrations.

## Prerequisites

- [Vercel Account](https://vercel.com) with CLI installed (`npm i -g vercel`)
- [Neon Account](https://neon.tech) for PostgreSQL database
- GitHub repository connected to Vercel

## 🗄️ 1. Neon Database Setup

### Create Production Database

1. **Go to [Neon Console](https://console.neon.tech)**
2. **Create a new project**:
   - Name: `augenblick-production`
   - Region: Choose closest to your users (e.g., `eu-central-1` for Germany)
   - PostgreSQL Version: Latest (15+)

3. **Get your connection string**:
   - Navigate to your project dashboard
   - Copy the connection string (starts with `postgresql://`)
   - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### Optional: Create Preview Database for Branch Deployments

For automated preview deployments with separate databases:

1. Enable **Neon Branching** in your project
2. Each Vercel preview deployment can get its own database branch
3. See [Vercel + Neon Integration](https://vercel.com/integrations/neon)

## 🚀 2. Vercel Deployment Setup

### Initial Setup

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (run from project root)
vercel link
```

### Configure Environment Variables

Add all environment variables to Vercel:

```bash
# Database (required)
vercel env add DATABASE_URL

# Better Auth (required)
vercel env add BETTER_AUTH_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Email/SMTP (required for contact forms)
vercel env add SMTP2GO_USERNAME
vercel env add SMTP2GO_PASSWORD

# Axiom Logging (optional but recommended)
vercel env add AXIOM_DATASET
vercel env add AXIOM_TOKEN
vercel env add NEXT_PUBLIC_AXIOM_DATASET
vercel env add NEXT_PUBLIC_AXIOM_TOKEN

# Microsoft Graph/Outlook (for EÜR module)
vercel env add AZURE_TENANT_ID
vercel env add AZURE_CLIENT_ID
vercel env add AZURE_CLIENT_SECRET
vercel env add OUTLOOK_USER_ID

# Cron Secret (for scheduled jobs)
vercel env add CRON_SECRET

# Admin Seeding (only for initial setup)
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add ADMIN_NAME
```

**Important:** When prompted, select:
- **Production**: Yes
- **Preview**: Yes (optional)
- **Development**: No (use local `.env` file)

## 🔄 3. Database Migrations Workflow

### ✅ Automatic Migrations (Configured)

Migrations run **automatically on every Vercel deployment**. The build command is configured as:

```json
{
  "scripts": {
    "build": "npm run db:migrate && next build && next-sitemap"
  }
}
```

This means:
1. ✅ Vercel runs `npm run db:migrate` during build
2. ✅ Drizzle applies only new migrations (tracks what's already applied)
3. ✅ Build continues only if migrations succeed
4. ✅ Safe to run multiple times (idempotent)

### Local Development Workflow

When you make schema changes:

```bash
# 1. Update your schema in src/lib/db/schema/
# (edit files in src/lib/db/schema/)

# 2. Generate migration files
npm run db:generate

# 3. Review the generated SQL in drizzle/ folder

# 4. Apply migrations to your local database
npm run db:migrate

# 5. Commit migration files to git
git add drizzle/
git commit -m "Add migration for [feature name]"

# 6. Push to deploy (migrations run automatically on Vercel)
git push
```

### How It Works on Vercel

```
Deploy triggered (git push)
  ↓
Vercel starts build
  ↓
npm run build
  ↓
npm run db:migrate (connects to production DATABASE_URL)
  ↓
Drizzle checks migration status
  ↓
Applies only new migrations
  ↓
next build (if migrations succeeded)
  ↓
next-sitemap
  ↓
Deployment complete ✅
```

## 📊 4. Initial Database Setup

After first deployment (migrations already ran automatically):

```bash
# Pull production environment variables
vercel env pull .env.production

# Seed admin user (only needed once)
npm run db:seed
```

**Note:** Migrations run automatically during Vercel build, so you only need to seed the admin user manually.

## 🔐 5. Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.aws.neon.tech/neondb` |
| `BETTER_AUTH_SECRET` | ✅ | Auth encryption key (32+ chars) | Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Production URL | `https://augenblick-chiemgau.com` |
| `SMTP2GO_USERNAME` | ✅ | SMTP username | From SMTP2GO dashboard |
| `SMTP2GO_PASSWORD` | ✅ | SMTP password | From SMTP2GO dashboard |
| `AZURE_TENANT_ID` | For EÜR | Azure tenant ID | From Azure Portal |
| `AZURE_CLIENT_ID` | For EÜR | Azure app client ID | From Azure Portal |
| `AZURE_CLIENT_SECRET` | For EÜR | Azure app secret | From Azure Portal |
| `OUTLOOK_USER_ID` | For EÜR | Email to sync calendar from | `sandra@example.com` |
| `CRON_SECRET` | For cron | Secret for cron endpoints | Generate: `openssl rand -base64 32` |
| `AXIOM_DATASET` | Optional | Axiom dataset name | Your dataset name |
| `AXIOM_TOKEN` | Optional | Axiom API token | From Axiom dashboard |

## 🎯 6. Deployment Checklist

### Pre-Deployment

- [ ] All environment variables added to Vercel
- [ ] Production Neon database created
- [ ] Migration files generated and committed to git
- [ ] Build tested locally: `npm run build`
- [ ] `.env.example` updated with new variables

### First Deployment

- [ ] Deploy to Vercel: `git push` (migrations run automatically)
- [ ] Seed admin user: `npm run db:seed`
- [ ] Test login at `/login` with admin credentials
- [ ] Verify database connection works

### Subsequent Deployments

- [ ] Generate migrations if schema changed: `npm run db:generate`
- [ ] Review generated SQL in `drizzle/` folder
- [ ] Commit migration files to git: `git add drizzle/ && git commit -m "migration"`
- [ ] Deploy: `git push` (migrations run automatically during build)

## 🔍 7. Verifying Deployment

After deployment, verify:

1. **Application accessible**: Visit your production URL
2. **Database connected**: Check `/login` page loads
3. **Authentication works**: Try logging in
4. **Check Vercel logs**: `vercel logs` for any errors

## 🛠️ 8. Troubleshooting

### Build Fails on Vercel

```bash
# Check build logs
vercel logs

# Common issues:
# - Missing environment variables → Add via vercel env add
# - TypeScript errors → Run npm run build locally first
# - Migration conflicts → Reset and regenerate migrations
```

### Database Connection Fails

```bash
# Verify DATABASE_URL is correct
vercel env ls

# Test connection locally
npm run db:studio

# Check Neon database is active (not paused)
# Free tier pauses after inactivity
```

### Migrations Not Applied

Migrations run automatically during build. If they fail:

```bash
# Check Vercel build logs
vercel logs

# Look for migration errors in the build output
# Common issues:
# - DATABASE_URL not set → Add via vercel env add DATABASE_URL
# - Migration SQL error → Review migration file in drizzle/
# - Database connection timeout → Check Neon database status

# To verify migration status locally:
vercel env pull .env.production
npm run db:studio
# (opens Drizzle Studio to inspect database)
```

**Important:** If a deployment fails due to migration errors, Vercel will NOT deploy the new version. This is a safety feature.

## 📚 9. Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Migrations](https://orm.drizzle.team/kit-docs/overview)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel + Neon Integration](https://vercel.com/integrations/neon)

## 🔄 10. Development Commands Reference

```bash
# Database
npm run db:generate    # Generate migration files from schema changes
npm run db:migrate     # Apply migrations to database
npm run db:push        # Push schema directly (dev only, no migrations)
npm run db:studio      # Open Drizzle Studio (database GUI)
npm run db:seed        # Seed admin user

# Development
npm run dev            # Start dev server
npm run build          # Build for production
npm run start          # Start production server locally
npm run lint           # Run ESLint

# Vercel
vercel                 # Deploy to preview
vercel --prod          # Deploy to production
vercel env ls          # List environment variables
vercel logs            # View production logs
```
