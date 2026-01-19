"use client"

import * as React from "react"
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/frontend/components/ui/breadcrumb"
import { Separator } from "@/app/frontend/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar"
import Calendar01 from "@/app/frontend/components/calendar-01"
import { useEffect, useState } from "react";


export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  const [uid, setUid] = useState<string | null>(null);
    const [sig, setSig] = useState<string | null>(null);
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setUid(params.get("uid"));
      setSig(params.get("sig"));
    }, []);
  
    if (!uid || !sig) return null;

  return (
    <SidebarProvider>
      <AppSidebar uid={uid} sig={sig}/>

      <SidebarInset>º

        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Citas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="flex flex-1 flex-col gap-4 p-6">

          {/* CONTENEDOR GRANDE */}
       
            <div className="bg-white min-h-[90vh] rounded-xl shadow-sm p-10 flex justify-center items-start">

            {/* CONTENEDOR COMPACTO */}
            <div
              className="
                bg-[#124d58]
                rounded-xl 
                p-10 
                border 
                border-black 
                shadow-[0_0_25px_rgba(0,0,0,0.8)]
                w-full
                h-full
                flex
                gap-10
                "
            >

              {/* CALENDARIO A LA IZQUIERDA */}
              <div className=" scale-130 origin-top-left absolute right-60 top-70">
                <Calendar01 date={date} setDate={setDate} />
              </div>

              {/* TÍTULO A LA DERECHA */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold font-['Libre_Baskerville'] text-[#fff] absolute top-50 left-40">
                  Citas de Secretaria
                </h1>
              </div>

              {/* DIV DE REGISTRO DE CITAS */}
              <div className="flex flex-col justify-start w-[40rem] h-[26rem] rounded-xl border border-black shadow-[0_0_25px_rgba(0,0,0,0.8)] p-4 absolute top-72 left-40 scrollbar-hide overflow-y-auto">
                <h2 className="text-2xl font-bold font-['Libre_Baskerville'] text-[#fff] mb-4">Registro de Citas</h2>

                {/* Citas simuladas */}
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">14/11/2025 - 10:00</p>
                    <p>Estado: Realizada</p>
                  </div>

                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">15/11/2025 - 11:00</p>
                    <p>Estado: Pendiente</p>
                  </div>

                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">16/11/2025 - 09:30</p>
                    <p>Estado: Realizada</p>
                  </div>

                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">17/11/2025 - 12:00</p>
                    <p>Estado: Pendiente</p>
                  </div>

                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">18/11/2025 - 10:30</p>
                    <p>Estado: Realizada</p>
                  </div>

                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">19/11/2025 - 11:15</p>
                    <p>Estado: Pendiente</p>
                  </div>

                  <div className="p-3 bg-gray-100 rounded shadow-sm">
                    <p className="font-semibold">20/11/2025 - 09:00</p>
                    <p>Estado: Realizada</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>

      </SidebarInset>
    </SidebarProvider>
  )
}
