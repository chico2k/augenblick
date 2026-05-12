"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ConfirmationSheet } from "@/components/euer/ConfirmationSheet";
import type {
  OutlookAppointment,
  TreatmentType,
  Customer,
} from "@/lib/db/schema";

const APPOINTMENTS_PER_PAGE = 5;

interface PendingAppointmentsCardProps {
  appointments: OutlookAppointment[];
  treatmentTypes: TreatmentType[];
  customers: Customer[];
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

export function PendingAppointmentsCard({
  appointments,
  treatmentTypes,
  customers,
}: PendingAppointmentsCardProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<OutlookAppointment | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.ceil(appointments.length / APPOINTMENTS_PER_PAGE);
  const currentPage = pageCount === 0 ? 0 : Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPage * APPOINTMENTS_PER_PAGE;
  const visibleAppointments = appointments.slice(
    pageStart,
    pageStart + APPOINTMENTS_PER_PAGE
  );

  useEffect(() => {
    if (pageIndex > 0 && pageIndex >= pageCount) {
      setPageIndex(Math.max(pageCount - 1, 0));
    }
  }, [pageCount, pageIndex]);

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
          <CardTitle className="text-lg">Zu bestätigen</CardTitle>
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
              Keine offenen Termine
            </p>
          ) : (
            <div className="space-y-2">
              {visibleAppointments.map((appointment) => (
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
                      <span className="whitespace-nowrap text-xs text-amber-600 dark:text-amber-500">
                        • Noch nicht erfasst
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {pageCount > 1 && (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-muted-foreground text-sm">
                    Zeige {pageStart + 1} bis{" "}
                    {Math.min(
                      pageStart + APPOINTMENTS_PER_PAGE,
                      appointments.length
                    )}{" "}
                    von {appointments.length} Terminen
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPageIndex((page) => Math.max(page - 1, 0))
                      }
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Zurück
                    </Button>
                    <div className="min-w-20 text-muted-foreground text-center text-sm">
                      Seite {currentPage + 1} von {pageCount}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPageIndex((page) =>
                          Math.min(page + 1, pageCount - 1)
                        )
                      }
                      disabled={currentPage >= pageCount - 1}
                    >
                      Weiter
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
