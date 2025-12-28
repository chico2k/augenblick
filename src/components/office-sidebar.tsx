"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Euro,
  FileText,
  Sparkles,
  LogOut,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/office",
    icon: LayoutDashboard,
  },
  {
    title: "Termine",
    url: "/office/euer",
    icon: Euro,
  },
  {
    title: "Kunden",
    url: "/office/kunden",
    icon: Users,
  },
  {
    title: "Behandlungen",
    url: "/office/euer/behandlungen",
    icon: Sparkles,
  },
  {
    title: "Datenschutz",
    url: "/office/datenschutz",
    icon: FileText,
  },
  {
    title: "Synchronisation",
    url: "/office/euer/sync",
    icon: RefreshCw,
  },
  {
    title: "Export",
    url: "/office/euer/export",
    icon: FileText,
  },
];

export function OfficeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/office">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-fuchsia-500 text-white">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Augenblick</span>
                  <span className="text-xs text-muted-foreground">Office</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => void handleLogout()}>
              <LogOut className="size-4" />
              <span>Abmelden</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
