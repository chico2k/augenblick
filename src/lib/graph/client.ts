/**
 * Microsoft Graph API client for Outlook calendar access.
 * Uses Client Credentials Flow (application permissions).
 * Admin-setup by Mario, no OAuth dialog for Sandra.
 */

import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

/**
 * Environment variables required for Graph API access.
 * These are set in Vercel environment variables.
 */
const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const OUTLOOK_USER_ID = process.env.OUTLOOK_USER_ID; // Sandra's mailbox ID or email

/**
 * Validates that all required environment variables are present.
 * @throws Error if any required variable is missing
 */
function validateEnvVars(): void {
  const missing: string[] = [];

  if (!AZURE_TENANT_ID) missing.push("AZURE_TENANT_ID");
  if (!AZURE_CLIENT_ID) missing.push("AZURE_CLIENT_ID");
  if (!AZURE_CLIENT_SECRET) missing.push("AZURE_CLIENT_SECRET");
  if (!OUTLOOK_USER_ID) missing.push("OUTLOOK_USER_ID");

  if (missing.length > 0) {
    throw new Error(`Fehlende Umgebungsvariablen: ${missing.join(", ")}`);
  }
}

/**
 * Creates and returns a configured Microsoft Graph client.
 * Uses Client Credentials Flow for server-to-server authentication.
 */
export function getGraphClient(): Client {
  validateEnvVars();

  const credential = new ClientSecretCredential(
    AZURE_TENANT_ID!,
    AZURE_CLIENT_ID!,
    AZURE_CLIENT_SECRET!
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  return Client.initWithMiddleware({
    authProvider,
  });
}

/**
 * Gets the configured Outlook user ID (Sandra's mailbox).
 */
export function getOutlookUserId(): string {
  if (!OUTLOOK_USER_ID) {
    throw new Error("OUTLOOK_USER_ID ist nicht konfiguriert");
  }
  return OUTLOOK_USER_ID;
}

/**
 * Calendar event from Microsoft Graph API.
 */
export interface GraphCalendarEvent {
  id: string;
  changeKey?: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName?: string;
  };
  bodyPreview?: string;
}

/**
 * Response from calendar events endpoint.
 */
export interface GraphCalendarEventsResponse {
  value: GraphCalendarEvent[];
  "@odata.nextLink"?: string;
}

/**
 * Validates that the response is a valid calendar events response.
 * @throws Error if the response is not valid
 */
function validateCalendarResponse(response: unknown): GraphCalendarEventsResponse {
  if (!response || typeof response !== "object") {
    throw new Error("Ungültige Antwort von Graph API");
  }

  const resp = response as Record<string, unknown>;

  if (!Array.isArray(resp.value)) {
    throw new Error("Ungültiges Antwortformat von Graph API: value ist kein Array");
  }

  // Validate each event has required fields
  for (const event of resp.value) {
    if (!event || typeof event !== "object") {
      throw new Error("Ungültiges Event-Objekt in Antwort");
    }

    const e = event as Record<string, unknown>;

    if (typeof e.id !== "string") {
      throw new Error("Event fehlt id");
    }
    if (typeof e.subject !== "string") {
      throw new Error("Event fehlt subject");
    }
    if (!e.start || typeof e.start !== "object") {
      throw new Error("Event fehlt start");
    }
    if (!e.end || typeof e.end !== "object") {
      throw new Error("Event fehlt end");
    }
  }

  return response as GraphCalendarEventsResponse;
}

/**
 * Fetches calendar events from the configured Outlook account.
 * Handles pagination to fetch ALL events in the date range.
 *
 * @param startDate - Start of date range
 * @param endDate - End of date range
 * @returns Array of calendar events
 */
export async function fetchCalendarEvents(
  startDate: Date,
  endDate: Date
): Promise<GraphCalendarEvent[]> {
  const client = getGraphClient();
  const userId = getOutlookUserId();

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  const allEvents: GraphCalendarEvent[] = [];
  let nextLink: string | undefined;

  // Initial request
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let response = await client
    .api(`/users/${userId}/calendar/calendarView`)
    .query({
      startDateTime: startIso,
      endDateTime: endIso,
    })
    .select("id,changeKey,subject,start,end,location,bodyPreview")
    .orderby("start/dateTime")
    .top(100)
    .get();

  // Validate and add first page
  let validated = validateCalendarResponse(response);
  allEvents.push(...validated.value);
  nextLink = validated["@odata.nextLink"];

  // Fetch all subsequent pages
  while (nextLink) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    response = await client.api(nextLink).get();
    validated = validateCalendarResponse(response);
    allEvents.push(...validated.value);
    nextLink = validated["@odata.nextLink"];
  }

  return allEvents;
}

/**
 * Checks if Graph API credentials are configured.
 * Does not validate if they are correct, just if they exist.
 */
export function isGraphConfigured(): boolean {
  return !!(
    AZURE_TENANT_ID &&
    AZURE_CLIENT_ID &&
    AZURE_CLIENT_SECRET &&
    OUTLOOK_USER_ID
  );
}
