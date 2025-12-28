"use client";

import { usePathname } from "next/navigation";
import { OfficeSidebar } from "@/components/office-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { QueryProvider } from "@/lib/query-client";

interface OfficeLayoutClientProps {
  children: React.ReactNode;
}

/**
 * Get the section name based on the current pathname.
 */
function getSectionName(pathname: string): string {
  if (pathname === "/office") {
    return "Dashboard";
  }
  if (pathname.startsWith("/office/kunden")) {
    return "Kunden";
  }
  if (pathname.startsWith("/office/datenschutz")) {
    return "Datenschutz";
  }
  if (pathname.startsWith("/office/euer/sync")) {
    return "Synchronisation";
  }
  if (pathname.startsWith("/office/euer")) {
    return "EÜR";
  }
  return "Office";
}

/**
 * Client-side office layout with sidebar navigation.
 *
 * Fullscreen routes (like signature flow) get no sidebar.
 * Regular office routes get sidebar layout.
 */
export function OfficeLayoutClient({ children }: OfficeLayoutClientProps) {
  const pathname = usePathname();

  // Match pattern: /office/kunden/[id]/datenschutz (signature flow)
  const isFullscreenRoute =
    pathname.startsWith("/office/kunden/") && pathname.endsWith("/datenschutz");

  // Fullscreen routes get minimal layout (no sidebar)
  if (isFullscreenRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const sectionName = getSectionName(pathname);

  // Regular office routes get sidebar layout
  return (
    <QueryProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <OfficeSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-sm font-medium text-muted-foreground">
              {sectionName}
            </span>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
