"use client";

import { IconSearch } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCommandMenu } from "@/components/layout/command-menu";

export function NavSecondary({ className }: { className?: string }) {
  const { setOpen } = useCommandMenu();

  return (
    <SidebarGroup className={className ?? "p-0"}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Search"
              aria-label="Search"
              onClick={() => setOpen(true)}
            >
              <IconSearch />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
