"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ExpenseType } from "@/lib/db/schema";
import type { ExpenseEntryWithType } from "@/lib/services/expense.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseChartProps {
  entries: ExpenseEntryWithType[];
  expenseTypes: ExpenseType[];
}

type PeriodKey = "7d" | "30d" | "90d" | "365d";

const PERIODS: Record<PeriodKey, { label: string; days: number }> = {
  "7d": { label: "Letzte 7 Tage", days: 7 },
  "30d": { label: "Letzte 30 Tage", days: 30 },
  "90d": { label: "Letzte 90 Tage", days: 90 },
  "365d": { label: "Letztes Jahr", days: 365 },
};

const PERIOD_KEYS = Object.keys(PERIODS) as PeriodKey[];

const chartConfig = {
  total: {
    label: "Ausgaben",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function ExpenseChart({ entries, expenseTypes }: ExpenseChartProps) {
  const [periodKey, setPeriodKey] = React.useState<PeriodKey>("30d");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  const period = PERIODS[periodKey];

  const { chartData, total, count } = React.useMemo(() => {
    const now = startOfDay(new Date());
    const start = new Date(now);
    start.setDate(start.getDate() - (period.days - 1));

    const filtered = entries.filter((entry) => {
      const entryDate = startOfDay(new Date(entry.expenseDate));
      if (entryDate < start || entryDate > now) return false;
      if (typeFilter !== "all" && entry.expenseType?.id !== typeFilter)
        return false;
      return true;
    });

    const dailyTotals = new Map<string, number>();
    const cursor = new Date(start);
    while (cursor <= now) {
      dailyTotals.set(toDayKey(cursor), 0);
      cursor.setDate(cursor.getDate() + 1);
    }

    let runningTotal = 0;
    for (const entry of filtered) {
      const key = toDayKey(new Date(entry.expenseDate));
      const amount = parseFloat(entry.amount);
      dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + amount);
      runningTotal += amount;
    }

    const data = Array.from(dailyTotals.entries()).map(([date, value]) => ({
      date,
      total: value,
    }));

    return { chartData: data, total: runningTotal, count: filtered.length };
  }, [entries, period, typeFilter]);

  const hasData = entries.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base tracking-tight">
            Ausgaben-Verlauf
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-foreground text-base font-semibold tabular-nums">
              {formatCurrency(total)}
            </span>
            <span className="text-muted-foreground">
              · {count} {count === 1 ? "Buchung" : "Buchungen"} ·{" "}
              {period.label.toLowerCase()}
            </span>
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
            disabled={expenseTypes.length === 0}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Typ filtern"
            >
              <SelectValue placeholder="Alle Typen" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                Alle Typen
              </SelectItem>
              {expenseTypes.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id}
                  className="rounded-lg"
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={periodKey}
            onValueChange={(value) => setPeriodKey(value as PeriodKey)}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Zeitraum auswählen"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {PERIOD_KEYS.map((key) => (
                <SelectItem key={key} value={key} className="rounded-lg">
                  {PERIODS[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!hasData ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Noch keine Ausgaben für eine Auswertung
          </div>
        ) : count === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Keine Ausgaben für den ausgewählten Filter
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                tickFormatter={(value: number) => `€${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value as string).toLocaleDateString("de-DE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })
                    }
                    formatter={(value) => formatCurrency(value as number)}
                  />
                }
              />
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#expenseGradient)"
                stroke="var(--color-total)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
