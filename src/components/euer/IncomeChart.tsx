"use client";

/**
 * Income Chart Component
 * Interactive area chart showing daily income totals.
 */

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

interface IncomeChartProps {
  data: Array<{ date: string; total: number }>;
}

const chartConfig = {
  total: {
    label: "Einnahmen",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function IncomeChart({ data: initialData }: IncomeChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d");

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (!initialData || initialData.length === 0) return [];

    const now = new Date();
    let daysToSubtract = 30;

    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "90d") {
      daysToSubtract = 90;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    startDate.setHours(0, 0, 0, 0);

    return initialData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [initialData, timeRange]);

  // Calculate total for the time range
  const totalForPeriod = React.useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.total, 0);
  }, [filteredData]);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Einnahmen-Verlauf</CardTitle>
          <CardDescription>
            Gesamteinnahmen:{" "}
            {new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(totalForPeriod)}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Zeitraum auswählen"
          >
            <SelectValue placeholder="Letzte 30 Tage" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Letzte 7 Tage
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Letzte 30 Tage
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Letzte 90 Tage
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            Keine Daten für den ausgewählten Zeitraum
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.1}
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
                tickFormatter={(value) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  const date = new Date(value);
                  return date.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  return `€${value}`;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      return new Date(value).toLocaleDateString("de-DE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      });
                    }}
                    formatter={(value) => {
                      return new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(value as number);
                    }}
                  />
                }
              />
              <Area
                dataKey="total"
                type="monotone"
                fill="url(#fillTotal)"
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
