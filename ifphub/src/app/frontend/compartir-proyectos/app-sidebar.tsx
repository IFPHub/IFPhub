"use client";

import * as React from "react";
import { Command, Folder, Calendar } from "lucide-react";

import { NavMain } from "@/app/frontend/compartir-proyectos/nav-main";
import { NavSecondary } from "@/app/frontend/compartir-proyectos/nav-secondary";
import { NavUser } from "@/app/frontend/compartir-proyectos/nav-user";
import { AddItemDialog } from "@/app/frontend/components/AddItemDialog";

import { SquareTerminal } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/frontend/components/ui/sidebar";
import { usePathname, useSearchParams } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Home", url: "/noticias", icon: Folder },
    { title: "Proyectos", url: "/proyectos-curso", icon: Folder },
    { title: "Reuniones", url: "/reuniones", icon: Calendar },
    { title: "Citas", url: "/citas", icon: Calendar },
    { title: "Quedadas", url: "/quedadas", icon: Calendar },
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
  if (!uid || !sig) return null;

  const query = `?uid=${uid}&sig=${sig}`;
  const pathname = usePathname();

  const isProyectosCurso = pathname.startsWith("/proyectos-curso");

  const baseNavMain = data.navMain.map((item) => ({
    ...item,
    url: `${item.url}${query}`,
  }));

  const navMainWithQuery = isProyectosCurso
    ? [
        ...baseNavMain,
      ]
    : baseNavMain;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/noticias${query}`}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid text-left text-sm">
                  <span className="font-medium">FProject</span>
                  <span className="text-xs">Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* ✅ PASAMOS uid y sig */}
        <NavMain items={navMainWithQuery} uid={uid} sig={sig} />
        <AddItemDialog />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} uid={uid} sig={sig} />
      </SidebarFooter>
    </Sidebar>
  );
}
