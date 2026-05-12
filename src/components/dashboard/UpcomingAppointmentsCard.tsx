"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ConfirmationSheet } from "@/components/euer/ConfirmationSheet";
import type {
  OutlookAppointment,
  TreatmentType,
  Customer,
} from "@/lib/db/schema";

interface UpcomingAppointmentsCardProps {
  appointments: OutlookAppointment[];
  treatmentTypes: TreatmentType[];
  customers: Customer[];
  appointmentsNeedingGdpr?: Set<string>;
}

/**
 * Format date in German.
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Format time in German.
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpcomingAppointmentsCard({
  appointments,
  treatmentTypes,
  customers,
  appointmentsNeedingGdpr,
}: UpcomingAppointmentsCardProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<OutlookAppointment | null>(null);

  const handleAppointmentClick = (appointment: OutlookAppointment) => {
    setSelectedAppointment(appointment);
  };

  const handleClose = () => {
    setSelectedAppointment(null);
  };

  const handleConfirmed = () => {
    setSelectedAppointment(null);
    // Refresh the page to update the list
    window.location.reload();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg">Nächste Termine</CardTitle>
          {appointments.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/office/termine">
                Alle anzeigen
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              Keine anstehenden Termine
            </p>
          ) : (
            <div className="space-y-2">
              {appointments.map((appointment) => {
                const needsAction = appointment.status === "pending";
                const needsGdpr =
                  appointmentsNeedingGdpr?.has(appointment.id) ?? false;

                return (
                  <button
                    key={appointment.id}
                    onClick={() => handleAppointmentClick(appointment)}
                    className="bg-muted/50 hover:bg-muted w-full cursor-pointer rounded-lg px-3 py-2 text-left transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="truncate font-medium">
                        {appointment.subject}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted-foreground whitespace-nowrap text-xs">
                          {formatDate(appointment.startTime)}
                        </span>
                        <span className="text-muted-foreground whitespace-nowrap text-xs">
                          {formatTime(appointment.startTime)}
                        </span>
                        {needsAction && (
                          <span className="whitespace-nowrap text-xs text-amber-600 dark:text-amber-500">
                            • Noch nicht erfasst
                          </span>
                        )}
                        {needsGdpr && (
                          <span className="whitespace-nowrap text-xs text-red-600 dark:text-red-500">
                            • Datenschutzerklärung fehlt
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationSheet
        appointment={selectedAppointment}
        treatmentTypes={treatmentTypes}
        customers={customers}
        onClose={handleClose}
        onConfirmed={handleConfirmed}
      />
    </>
  );
}
