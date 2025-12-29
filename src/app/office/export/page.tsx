"use client";

/**
 * Export Page
 * Allows exporting income entries to CSV for EÜR/tax purposes.
 */

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportIncomeAction } from "@/app/actions/income.actions";

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);

  // Default to current year
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Bitte wählen Sie Start- und Enddatum");
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportIncomeAction({ startDate, endDate });

      if (result.success && result.data) {
        // Create and download CSV file
        const blob = new Blob([result.data.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Export erfolgreich heruntergeladen");
      } else {
        toast.error(result.error || "Export fehlgeschlagen");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Quick select buttons
  const setQuarter = (quarter: 1 | 2 | 3 | 4) => {
    const start = new Date(currentYear, (quarter - 1) * 3, 1);
    const end = new Date(currentYear, quarter * 3, 0);
    const startDateStr = start.toISOString().split("T")[0];
    const endDateStr = end.toISOString().split("T")[0];
    if (startDateStr && endDateStr) {
      setStartDate(startDateStr);
      setEndDate(endDateStr);
    }
  };

  const setYear = (year: number) => {
    setStartDate(`${year}-01-01`);
    setEndDate(`${year}-12-31`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zeitraum wählen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
          {/* Quick Select */}
          <div className="space-y-2">
            <Label>Schnellauswahl</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setQuarter(1)}>
                Q1 {currentYear}
              </Button>
              <Button variant="outline" onClick={() => setQuarter(2)}>
                Q2 {currentYear}
              </Button>
              <Button variant="outline" onClick={() => setQuarter(3)}>
                Q3 {currentYear}
              </Button>
              <Button variant="outline" onClick={() => setQuarter(4)}>
                Q4 {currentYear}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setYear(currentYear)}>
                Jahr {currentYear}
              </Button>
              <Button variant="outline" onClick={() => setYear(currentYear - 1)}>
                Jahr {currentYear - 1}
              </Button>
            </div>
          </div>

          {/* Custom Range */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Von</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Bis</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="min-h-11"
              />
            </div>
          </div>

          {/* Export Button */}
          <Button
            className="w-full min-h-12"
            onClick={() => void handleExport()}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Wird exportiert...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                CSV herunterladen
              </>
            )}
          </Button>

          {/* Format Info */}
          <p className="text-sm text-muted-foreground">
            Die CSV-Datei enthält: Datum, Betrag, Zahlungsart, Behandlung, Kunde, Notizen.
            Format ist kompatibel mit Excel und ELSTER.
          </p>
        </CardContent>
    </Card>
  );
}
