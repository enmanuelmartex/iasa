"use client";

import Link from "next/link";
import { IconShieldLock } from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/navigation/nav-main";
import { NavCollapsible } from "@/components/navigation/nav-collapsible";
import { NavSecondary } from "@/components/navigation/nav-secondary";
import { NavUser } from "@/components/navigation/nav-user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: { name: string; email: string; role: string } | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const isAdmin = user?.role === "ADMIN";

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="IASA"
              className="h-12 group-data-[collapsible=icon]:size-10"
            >
              <Link href="/dashboard">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent">
                  <IconShieldLock className="h-5 w-5 text-sidebar-foreground" />
                </div>
                <span className="text-base font-semibold tracking-[0.18em]">
                  IASA
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavCollapsible isAdmin={isAdmin} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
