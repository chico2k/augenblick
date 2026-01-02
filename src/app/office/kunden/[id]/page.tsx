"use client";

/**
 * Customer Detail Page
 * Client component that displays customer information, signature status, and audit log.
 * Uses React Query for client-side caching and optimized data fetching.
 */

import { useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, FileSignature, Mail, Phone, FileText, ArrowLeft, CheckCircle, AlertCircle, Users, Activity, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useCustomerDetail, useDeleteCustomer } from "@/hooks/use-customers";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuditLog } from "@/components/customers/audit-log";
import { PdfDownloadButton } from "@/components/customers/pdf-download-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/**
 * Customer Detail Page
 *
 * Displays comprehensive customer information including:
 * - Basic details (name, email, phone, notes)
 * - Signature status card with action button
 * - Edit functionality
 * - Audit log for change history
 */
export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useCustomerDetail(id);
  const deleteMutation = useDeleteCustomer();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    if (error?.message?.includes('nicht gefunden')) {
      notFound();
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler</AlertTitle>
        <AlertDescription>
          {error?.message || "Fehler beim Laden der Kundendaten"}
        </AlertDescription>
      </Alert>
    );
  }

  const { customer, auditEntries } = data;
  const fullName = `${customer.firstName} ${customer.lastName}`;

  const handleDelete = () => {
    deleteMutation.mutate(customer.id, {
      onSuccess: () => {
        toast.success(`${fullName} wurde gelöscht`);
        router.push("/office/kunden");
      },
      onError: (err) => {
        toast.error(err.message || "Fehler beim Löschen");
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Back link and header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/office/kunden">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Zurück zur Kundenliste</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
            <p className="text-sm text-muted-foreground">
              Erstellt am {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/office/kunden/${customer.id}/bearbeiten`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </Button>
          </Link>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kunden löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie <strong>{fullName}</strong> wirklich löschen?
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Löschen...
                    </>
                  ) : (
                    "Ja, löschen"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Kontaktdaten</CardTitle>
            <CardDescription>Kontaktinformationen des Kunden</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">E-Mail</p>
                <p className="text-sm text-muted-foreground">
                  {customer.email || "Nicht angegeben"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">
                  {customer.phone || "Nicht angegeben"}
                </p>
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Notizen</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {customer.notes}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Status Information */}
            <Separator />
            <div className="space-y-3">
              {/* Customer Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Kundenstatus</span>
                </div>
                <Badge
                  variant={customer.status === "active" ? "default" : "secondary"}
                  className={cn(
                    customer.status === "active"
                      ? "bg-green-600 hover:bg-green-600/80"
                      : "bg-gray-500 hover:bg-gray-500/80 text-white"
                  )}
                >
                  {customer.status === "active" ? "Aktiv" : "Inaktiv"}
                </Badge>
              </div>

              {/* Regular Customer Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Stammkundin</span>
                </div>
                {customer.isRegularCustomer ? (
                  <Badge variant="outline" className="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200">
                    Ja
                  </Badge>
                ) : (
                  <Badge variant="outline">Nein</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              Datenschutz-Status
            </CardTitle>
            <CardDescription>DSGVO-Einwilligungsstatus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Display */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                {customer.hasSignedCurrentVersion ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                )}
                <div>
                  <p className="font-medium">
                    {customer.hasSignedCurrentVersion
                      ? "Unterschrift vorhanden"
                      : "Unterschrift fehlt"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.hasSignedCurrentVersion && customer.lastSignedAt
                      ? `Unterschrieben am ${formatDate(customer.lastSignedAt)}`
                      : "Aktuelle DSGVO-Version nicht unterschrieben"}
                  </p>
                </div>
              </div>
              <Badge
                variant={customer.hasSignedCurrentVersion ? "default" : "secondary"}
                className={cn(
                  customer.hasSignedCurrentVersion
                    ? "bg-green-500 hover:bg-green-500/80"
                    : "bg-orange-500 hover:bg-orange-500/80 text-white"
                )}
              >
                {customer.hasSignedCurrentVersion ? "OK" : "Fehlt"}
              </Badge>
            </div>

            {/* Signature Action Button */}
            {!customer.hasSignedCurrentVersion && (
              <Link href={`/office/kunden/${customer.id}/datenschutz`} className="block">
                <Button className="w-full">
                  <FileSignature className="mr-2 h-4 w-4" />
                  Jetzt unterschreiben
                </Button>
              </Link>
            )}

            {customer.hasSignedCurrentVersion && customer.lastSignatureId && (
              <div className="space-y-2">
                <PdfDownloadButton
                  customerId={customer.id}
                  signatureId={customer.lastSignatureId}
                  customerName={fullName}
                />
                <Link href={`/office/kunden/${customer.id}/datenschutz`} className="block">
                  <Button variant="outline" className="w-full">
                    <FileSignature className="mr-2 h-4 w-4" />
                    Erneut unterschreiben
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <AuditLog entries={auditEntries} />
    </div>
  );
}
