/**
 * Signature Page
 * Server component that loads customer and GDPR version,
 * then renders the fullscreen SignatureFlow component.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { customerService } from "@/lib/services/customer.service";
import { gdprService } from "@/lib/services/gdpr.service";
import { isOkResult, isErrResult } from "@/lib/services/types";
import { SignatureFlow } from "@/components/signature/signature-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Datenschutz unterschreiben",
  description: "DSGVO-Einwilligung unterschreiben",
};

interface SignaturePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Fetches customer and active GDPR version data.
 */
async function getSignatureData(customerId: string) {
  const [customerResult, gdprResult] = await Promise.all([
    customerService.getById(customerId),
    gdprService.getActiveVersion(),
  ]);

  return {
    customer: isOkResult(customerResult) ? customerResult.value : null,
    gdprVersion: isOkResult(gdprResult) ? gdprResult.value : null,
    gdprError: isErrResult(gdprResult) ? gdprResult.error.message : null,
  };
}

/**
 * Error display component when no active GDPR version is available.
 */
function NoActiveVersionError({
  customerId,
  errorMessage,
}: {
  customerId: string;
  errorMessage: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            Datenschutz nicht verfügbar
          </CardTitle>
          <CardDescription>
            Die Unterschrift kann derzeit nicht erfasst werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            Bitte kontaktieren Sie einen Administrator, um eine aktive
            Datenschutzversion zu erstellen.
          </p>
          <div className="flex gap-2">
            <Link href={`/office/kunden/${customerId}`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
            </Link>
            <Link href="/office/datenschutz">
              <Button>
                Datenschutz verwalten
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Signature Page
 *
 * Loads customer and GDPR version data, then renders the SignatureFlow component
 * for capturing the customer's GDPR consent signature.
 *
 * Handles edge cases:
 * - Customer not found: triggers 404 page
 * - No active GDPR version: shows error with link to management
 */
export default async function SignaturePage({ params }: SignaturePageProps) {
  const { id } = await params;

  const { customer, gdprVersion, gdprError } = await getSignatureData(id);

  // Customer not found - trigger 404
  if (!customer) {
    notFound();
  }

  // No active GDPR version - show error
  if (!gdprVersion) {
    return (
      <NoActiveVersionError
        customerId={id}
        errorMessage={gdprError || "Keine aktive Datenschutzerklärung gefunden"}
      />
    );
  }

  const fullName = `${customer.firstName} ${customer.lastName}`;

  return (
    <SignatureFlow
      customerId={customer.id}
      customerName={fullName}
      customer={customer}
      gdprVersionId={gdprVersion.id}
      gdprContent={gdprVersion.content}
    />
  );
}
