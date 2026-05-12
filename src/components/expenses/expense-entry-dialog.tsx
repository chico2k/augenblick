"use client";

import { useEffect, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { de as rdpDe } from "react-day-picker/locale";
import {
  AlertTriangle,
  CalendarDays,
  CalendarIcon,
  Coins,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import type { ExpenseType } from "@/lib/db/schema";
import { createExpenseEntryAction } from "@/app/actions/expense.actions";
import { useCreateExpenseType } from "@/hooks/use-expenses";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExpenseEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseTypes: ExpenseType[];
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ExpenseEntryDialog({
  open,
  onOpenChange,
  expenseTypes,
}: ExpenseEntryDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState<Date>(() => new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [expenseTypeId, setExpenseTypeId] = useState<string>("");
  const [newTypeName, setNewTypeName] = useState("");
  const createType = useCreateExpenseType();

  useEffect(() => {
    if (open) {
      setAmount("");
      setExpenseDate(new Date());
      setExpenseTypeId(expenseTypes[0]?.id ?? "");
      setNewTypeName("");
    }
  }, [open, expenseTypes]);

  const handleCreateType = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newTypeName.trim();
    if (!name) return;

    createType.mutate(
      { name },
      {
        onSuccess: () => {
          setNewTypeName("");
          toast.success("Ausgabentyp angelegt");
          router.refresh();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Ausgabentyp konnte nicht angelegt werden"
          );
        },
      }
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedAmount = amount.replace(",", ".").trim();

    if (!expenseTypeId) {
      toast.error("Bitte wähle einen Ausgabentyp");
      return;
    }

    startTransition(async () => {
      const result = await createExpenseEntryAction({
        amount: normalizedAmount,
        expenseDate: toDateInputValue(expenseDate),
        expenseTypeId,
      });

      if (!result.success) {
        toast.error(result.error || "Ausgabe konnte nicht gespeichert werden");
        return;
      }

      toast.success("Ausgabe gespeichert");
      onOpenChange(false);
      router.refresh();
    });
  };

  const hasTypes = expenseTypes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 sm:max-w-[560px] sm:p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl tracking-tight">
            Neue Ausgabe
          </DialogTitle>
          {hasTypes && (
            <DialogDescription className="text-sm">
              Erfasse eine Ausgabe mit Datum, Betrag und Typ.
            </DialogDescription>
          )}
        </DialogHeader>

        {hasTypes ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="expenseDate"
                  className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  <CalendarDays className="h-3 w-3" />
                  Datum
                </Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="expenseDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-11 w-full justify-start text-left font-normal tabular-nums",
                        !expenseDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                      {format(expenseDate, "dd.MM.yyyy", { locale: de })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expenseDate}
                      onSelect={(date) => {
                        if (date) {
                          setExpenseDate(date);
                          setDatePickerOpen(false);
                        }
                      }}
                      locale={rdpDe}
                      weekStartsOn={1}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="amount"
                  className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  <Coins className="h-3 w-3" />
                  Betrag
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0,00"
                    className="h-11 pr-9 tabular-nums"
                    autoFocus
                    required
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3 w-3" />
                Typ
              </Label>
              <Select
                value={expenseTypeId}
                onValueChange={setExpenseTypeId}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Typ wählen…" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isPending || !expenseTypeId}>
                {isPending ? "Speichern…" : "Ausgabe speichern"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleCreateType} className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Achtung, Typen anlegen!</p>
                <p className="text-sm text-amber-900/80">
                  Du musst zuerst einen Ausgabentyp anlegen, bevor du Ausgaben
                  erfassen kannst.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="newTypeName"
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                Neuer Ausgabentyp
              </Label>
              <Input
                id="newTypeName"
                value={newTypeName}
                onChange={(event) => setNewTypeName(event.target.value)}
                placeholder="z.B. Material, Werbung, Miete…"
                className="h-11"
                autoFocus
                maxLength={80}
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createType.isPending}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={createType.isPending || !newTypeName.trim()}
              >
                {createType.isPending ? "Anlegen…" : "Ausgabentyp anlegen"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
