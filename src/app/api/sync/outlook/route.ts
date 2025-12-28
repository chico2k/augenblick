/**
 * Outlook Sync API Route
 * Called by Vercel Cron job to sync Outlook calendar.
 * Also accessible for manual sync via authenticated POST.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { outlookService } from "@/lib/services/outlook.service";
import { isErrResult } from "@/lib/services/types";

/**
 * Verify the request is from Vercel Cron or an authenticated user.
 * In production, Vercel Cron sends Authorization: Bearer <CRON_SECRET>
 * In development, we allow unauthenticated requests for testing.
 */
async function verifyCronOrAuth(req: NextRequest): Promise<boolean> {
  // Check for Vercel Cron authorization
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    console.log("[Sync] Authorized via CRON_SECRET");
    return true;
  }

  // In development (no CRON_SECRET), allow unauthenticated requests
  if (!cronSecret) {
    console.log("[Sync] No CRON_SECRET set - allowing request (dev mode)");
    return true;
  }

  // Fall back to session auth for manual triggers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    console.log("[Sync] Authorized via session");
    return true;
  }

  console.log("[Sync] Unauthorized - no valid auth found");
  return false;
}

/**
 * POST /api/sync/outlook
 * Trigger Outlook calendar sync.
 * Called by Vercel Cron or manually by authenticated user.
 */
export async function POST(req: NextRequest) {
  console.log("[Sync] POST /api/sync/outlook called");

  try {
    const isAuthorized = await verifyCronOrAuth(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if Outlook is configured
    console.log("[Sync] Checking Outlook configuration...");
    if (!outlookService.isConfigured()) {
      console.log("[Sync] Outlook NOT configured - missing env vars");
      return NextResponse.json(
        { error: "Outlook-Integration ist nicht konfiguriert",
          hint: "Fehlende Umgebungsvariablen: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, OUTLOOK_USER_ID" },
        { status: 503 }
      );
    }

    // Run sync
    console.log("[Sync] Starting Outlook sync...");
    const result = await outlookService.syncFromOutlook();

    if (isErrResult(result)) {
      console.error("[Sync] Failed:", result.error);
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    console.log("[Sync] Completed:", result.value);
    return NextResponse.json({
      success: true,
      ...result.value,
    });
  } catch (error) {
    console.error("[Sync] Unexpected error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync/outlook
 * Get current sync status.
 * Requires authentication.
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await outlookService.getSyncStatus();

    if (isErrResult(result)) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      configured: outlookService.isConfigured(),
      status: result.value,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
