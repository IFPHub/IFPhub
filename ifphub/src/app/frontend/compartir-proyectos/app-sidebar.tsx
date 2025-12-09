"use client";

import * as React from "react";
import { Command, Folder, Calendar, AlertCircle } from "lucide-react";

import { NavMain } from "@/app/frontend/compartir-proyectos/nav-main";
import { NavSecondary } from "@/app/frontend/compartir-proyectos/nav-secondary";
import { NavUser } from "@/app/frontend/compartir-proyectos/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/frontend/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Proyectos",
      url: "/compartir-proyectos",
      icon: Folder,
    },
    {
      title: "Reuniones",
      url: "/reuniones",
      icon: Calendar,
    },
  ],

  navSecondary: [],
};

export function AppSidebar({
  uid,
  sig,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  uid: string | null;
  sig: string | null;
}) {
  // ✅ CLAVE: no renderizar hasta que EXISTAN
  if (!uid || !sig) {
    return null;
  }

  // ✅ ahora sí, seguro al 100%
  const query = `?uid=${uid}&sig=${sig}`;

  const navMainWithQuery = data.navMain.map((item) => ({
    ...item,
    url: `${item.url}${query}`,
  }));

  return (
    <Sidebar variant="inset" {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/${query}`}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FProject</span>
                  <span className="truncate text-xs">Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <NavMain items={navMainWithQuery} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <NavUser user={data.user} uid={uid} sig={sig} />
      </SidebarFooter>
    </Sidebar>
  );
}
