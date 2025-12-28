"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { generateGdprPdfAction } from "@/app/actions/pdf.actions";

interface PdfDownloadButtonProps {
  customerId: string;
  signatureId: string;
  customerName: string;
}

export function PdfDownloadButton({
  customerId,
  signatureId,
  customerName,
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      console.log("PDF Download gestartet:", { customerId, signatureId });

      const result = await generateGdprPdfAction({
        customerId,
        signatureId,
      });

      console.log("PDF Result:", result);

      if (!result.success) {
        console.error("PDF Fehler:", JSON.stringify(result.error, null, 2));
        toast.error(result.error?.message || "Unbekannter Fehler");
        return;
      }

      // Convert base64 to blob and trigger download
      const byteCharacters = atob(result.data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Datenschutz-${customerName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF wurde heruntergeladen");
    } catch (error) {
      toast.error("Fehler beim Herunterladen des PDFs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={() => void handleDownload()}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Wird erstellt...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          PDF herunterladen
        </>
      )}
    </Button>
  );
}
