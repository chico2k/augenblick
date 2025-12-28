"use client";

/**
 * Weekly Total Component
 * Displays "Diese Woche: €X" prominently on the dashboard.
 */

import { Card, CardContent } from "@/components/ui/card";

interface WeeklyTotalProps {
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

export function WeeklyTotal({ amount, count }: WeeklyTotalProps) {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm font-medium opacity-90">Diese Woche</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(amount)}</p>
          <p className="text-sm opacity-75 mt-1">
            {count} {count === 1 ? "Einnahme" : "Einnahmen"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
