"use client";

import * as React from "react";
import { Command, Folder, Calendar, AlertCircle } from "lucide-react";

import { NavMain } from "@/app/frontend/compartir-proyectos/nav-main";
import { NavSecondary } from "@/app/frontend/compartir-proyectos/nav-secondary";
import { NavUser } from "@/app/frontend/compartir-proyectos/nav-user";
import { AddItemDialog } from "@/app/frontend/components/AddItemDialog"

import {
  BookOpen,
  Bot,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/frontend/components/ui/sidebar";

const data2 = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Home",
      url: "/noticias",
      icon: Folder,
    },
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
    {
      title: "Citas",
      url: "/citas",
      icon: Calendar,
    },
    {
      title: "Quedadas",
      url: "/quedadas",
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
        <AddItemDialog />
        <NavSecondary items={data.navSecondary} className="mt-auto" />

      </SidebarContent>


      {/* FOOTER */}
      <SidebarFooter>
        <NavUser user={data.user} uid={uid} sig={sig} />
      </SidebarFooter>
    </Sidebar>
  );
}
