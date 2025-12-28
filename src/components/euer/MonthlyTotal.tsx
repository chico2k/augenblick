"use client";

/**
 * Monthly Total Component
 * Displays "Dieser Monat: €X" on the dashboard.
 */

import { Card, CardContent } from "@/components/ui/card";

interface MonthlyTotalProps {
  amount: number;
  count: number;
}

/**
 * Format currency in German format.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function MonthlyTotal({ amount, count }: MonthlyTotalProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Dieser Monat</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(amount)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {count} {count === 1 ? "Einnahme" : "Einnahmen"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
