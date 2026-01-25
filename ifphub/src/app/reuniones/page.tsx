"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import { Board } from "@/app/frontend/reuniones/board";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/frontend/components/ui/breadcrumb";

import { Separator } from "@/app/frontend/components/ui/separator";

import { useRouter, usePathname } from "next/navigation";

export default function Page() {
  const [uid, setUid] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUid(params.get("uid"));
    setSig(params.get("sig"));
  }, [pathname, router]);

  useEffect(() => {
    const storedUid = sessionStorage.getItem("uid");
    const storedSig = sessionStorage.getItem("sig");

    if (!storedUid || !storedSig) return;

    setUid(storedUid);
    setSig(storedSig);

    const params = new URLSearchParams(window.location.search);
    const urlUid = params.get("uid");
    const urlSig = params.get("sig");

    // 🔁 Si no están en la URL, los añadimos
    if (!urlUid || !urlSig) {
      params.set("uid", storedUid);
      params.set("sig", storedSig);

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  if (!uid || !sig) return null;

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reuniones</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          <Board />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
