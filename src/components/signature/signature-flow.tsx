"use client";

/**
 * Signature Flow Component
 * 3-step signature capture flow: read GDPR text → agree & sign → success
 * Mobile-first fullscreen design for in-studio use.
 */

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { toast } from "sonner";
import {
  Loader2,
  Check,
  X,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { createSignatureAction } from "../../app/actions/gdpr.actions";
import type { Customer } from "../../lib/db/schema";

/**
 * Flow steps for the signature process.
 */
type FlowStep = "sign" | "success";

/**
 * Props for the SignatureFlow component.
 */
interface SignatureFlowProps {
  /** Customer ID for the signature */
  customerId: string;
  /** Customer name for display */
  customerName: string;
  /** Full customer data for display */
  customer: Customer;
  /** Active GDPR version ID */
  gdprVersionId: string;
  /** GDPR content in markdown format */
  gdprContent: string;
  /** Optional callback on successful signature */
  onSuccess?: () => void;
  /** Optional callback on cancel */
  onCancel?: () => void;
}

/**
 * SignatureFlow component for capturing GDPR consent signatures.
 *
 * Features:
 * - Step 1 (Read): Display GDPR text with scrollable area and agreement checkbox
 * - Step 2 (Sign): Full-width signature canvas with clear button
 * - Step 3 (Success): Confirmation screen with navigation option
 * - Mobile-first fullscreen design
 * - Error handling with toast notifications
 */
export function SignatureFlow({
  customerId,
  customerName,
  customer,
  gdprVersionId,
  gdprContent,
  onSuccess,
  onCancel,
}: SignatureFlowProps) {
  const router = useRouter();
  const sigCanvas = useRef<SignatureCanvas>(null);

  // State
  const [currentStep, setCurrentStep] = useState<FlowStep>("sign");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Three separate consents (default: checked)
  const [dataProcessingConsent, setDataProcessingConsent] = useState(true);
  const [healthDataConsent, setHealthDataConsent] = useState(true);
  const [photoConsent, setPhotoConsent] = useState<boolean | null>(true);

  /**
   * Handle cancel button click.
   */
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push(`/office/kunden/${customerId}`);
    }
  }, [onCancel, router, customerId]);


  /**
   * Submit the signature.
   */
  const handleSubmit = useCallback(async () => {
    // Check required consents
    if (!dataProcessingConsent) {
      toast.error("Bitte stimmen Sie der Datenverarbeitung zu");
      return;
    }
    if (!healthDataConsent) {
      toast.error("Bitte stimmen Sie der Verarbeitung von Gesundheitsdaten zu");
      return;
    }

    // Check if canvas is empty
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Bitte unterschreiben Sie im Feld");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get signature as base64 PNG
      const signatureData = sigCanvas.current?.toDataURL("image/png");

      if (!signatureData) {
        toast.error("Fehler beim Erfassen der Unterschrift");
        return;
      }

      // Submit signature via server action
      const result = await createSignatureAction({
        customerId,
        gdprVersionId,
        signatureData,
        dataProcessingConsent,
        healthDataConsent,
        photoConsent,
      });

      if (result.success) {
        setCurrentStep("success");
        toast.success("Unterschrift erfolgreich gespeichert");
      } else {
        toast.error(result.error || "Fehler beim Speichern der Unterschrift");
      }
    } catch (error) {
      toast.error(`Ein Fehler ist aufgetreten: ${String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [customerId, gdprVersionId, dataProcessingConsent, healthDataConsent, photoConsent]);

  /**
   * Handle completion (after success screen).
   */
  const handleComplete = useCallback(() => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/office/kunden/${customerId}`);
    }
  }, [onSuccess, router, customerId]);

  // Render success step
  if (currentStep === "success") {
    return (
      <div className="fixed inset-0 flex flex-col bg-background">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="text-center">
            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            {/* Success message */}
            <h1 className="mb-2 text-2xl font-bold">Vielen Dank!</h1>
            <p className="mb-2 text-muted-foreground">
              Ihre Unterschrift wurde erfolgreich gespeichert.
            </p>
            <p className="mb-8 text-sm text-muted-foreground">{customerName}</p>

            {/* Complete button */}
            <Button onClick={handleComplete} size="lg" className="min-w-[200px]">
              Fertig
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render sign step (default)
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="relative flex items-center justify-center">
            <h1 className="text-base font-medium">
              Kundendatenschutz: {customerName}
            </h1>
            <button
              type="button"
              onClick={handleCancel}
              className="absolute right-0 flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Abbrechen"
            >
              <X className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:ml-1">Abbrechen</span>
            </button>
          </div>
        </div>

        {/* Content: GDPR Text, Checkbox, and Signature */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Customer Data Overview */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Erfasste Kundendaten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{customer.firstName} {customer.lastName}</span>
                </div>
                {customer.email && (
                  <div className="flex justify-between">
                    <span className="font-medium">E-Mail:</span>
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex justify-between">
                    <span className="font-medium">Telefon:</span>
                    <span>{customer.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GDPR Text */}
            <div className="prose prose-sm dark:prose-invert prose-p:my-4 prose-headings:my-5 prose-ul:my-4 prose-ol:my-4 prose-li:my-1">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {gdprContent}
              </ReactMarkdown>
            </div>

            {/* Consent Checkboxes */}
            <Card className="border-0 shadow-none p-0">
              <CardHeader className="px-0">
                <CardTitle className="text-base">Einwilligungen</CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                {/* 1. Data Processing Consent (Required) */}
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    id="data-processing-consent"
                    checked={dataProcessingConsent}
                    onCheckedChange={(checked) => setDataProcessingConsent(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <strong>Datenverarbeitung (erforderlich):</strong> Ich willige in die Verarbeitung meiner personenbezogenen Daten zu den oben genannten Zwecken ein.
                  </span>
                </label>

                {/* 2. Health Data Consent (Required) */}
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    id="health-data-consent"
                    checked={healthDataConsent}
                    onCheckedChange={(checked) => setHealthDataConsent(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <strong>Gesundheitsdaten (erforderlich):</strong> Ich willige in die Verarbeitung meiner Gesundheitsdaten zur sicheren Durchführung der Behandlung ein.
                  </span>
                </label>

                {/* 3. Photo Consent (Optional) */}
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    id="photo-consent"
                    checked={photoConsent === true}
                    onCheckedChange={(checked) => setPhotoConsent(checked === true ? true : false)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <strong>Fotonutzung (freiwillig):</strong> Ich willige ein, dass Fotos meiner Behandlung zu Dokumentations- und Marketingzwecken verwendet werden dürfen.
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Signature Field */}
            <Card className="border-0 shadow-none p-0">
              <CardHeader className="px-0">
                <CardTitle className="text-base">Unterschrift</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div
                  className={cn(
                    "h-48 rounded-lg border-2 border-dashed border-gray-300",
                    "bg-white touch-none",
                    "flex items-center justify-center"
                  )}
                >
                  <SignatureCanvas
                    ref={sigCanvas}
                    backgroundColor="#ffffff"
                    penColor="black"
                    canvasProps={{
                      className: "w-full h-full rounded-lg",
                      style: { touchAction: "none" },
                    }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-sm text-muted-foreground">
                  <span>Ort: Traunreut, {new Date().toLocaleDateString("de-DE")}</span>
                  <span>{customerName}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer with submit button */}
        <div className="border-t bg-background p-4">
          <div className="mx-auto max-w-3xl">
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  Bestätigen
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignatureFlow;
