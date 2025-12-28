"use client";

/**
 * Appointment Card Component
 * Shows a pending Outlook appointment with confirm/dismiss actions.
 */

import { useState } from "react";
import { Check, X, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OutlookAppointment } from "@/lib/db/schema";

interface AppointmentCardProps {
  appointment: OutlookAppointment;
  onConfirm: (appointmentId: string) => void;
  onDismiss: (appointmentId: string) => void;
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

export function AppointmentCard({
  appointment,
  onConfirm,
  onDismiss,
}: AppointmentCardProps) {
  const [isLoading, setIsLoading] = useState<"confirm" | "dismiss" | null>(null);

  const handleConfirm = () => {
    setIsLoading("confirm");
    try {
      onConfirm(appointment.id);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDismiss = () => {
    setIsLoading("dismiss");
    try {
      onDismiss(appointment.id);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          {/* Appointment Info */}
          <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-4">
            <h3 className="font-medium truncate lg:flex-shrink-0">{appointment.subject}</h3>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 lg:mt-0 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(appointment.startTime)}</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </span>
              </div>
              {appointment.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{appointment.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDismiss}
              disabled={isLoading !== null}
              title="Privat (nicht anzeigen)"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-11 w-11"
              onClick={handleConfirm}
              disabled={isLoading !== null}
              title="Bestätigen"
            >
              <Check className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
