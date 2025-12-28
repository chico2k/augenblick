import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date in German locale format
 * @param date - Date object, string, or timestamp to format
 * @param options - Optional Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string (e.g., "25.12.2024, 14:30")
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Ungültiges Datum";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return dateObj.toLocaleString("de-DE", options ?? defaultOptions);
}
