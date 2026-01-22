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
import { useSearchParams } from "next/navigation"

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 0, 12))
  const searchParams = useSearchParams()
  const uid = searchParams.get("uid")
  const sig = searchParams.get("sig")

  return (
    <SidebarProvider>
      <AppSidebar uid={uid} sig={sig} />

      <SidebarInset>

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
        <main className="flex-1 p-4 md:p-6">

          {/* CONTENEDOR PRINCIPAL */}
          <div className="bg-white min-h-[calc(100vh-8rem)] rounded-xl shadow-sm p-4 md:p-10">

            {/* CONTENEDOR CON FONDO OSCURO */}
            <div className="bg-[#124d58] rounded-xl p-4 md:p-6 lg:p-10 border border-black shadow-lg w-full min-h-[500px] flex flex-col">

              {/* TÍTULO */}
              <div className="mb-6 md:mb-8 lg:mb-10 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-['Libre_Baskerville'] text-white">
                  Citas de Secretaría
                </h1>
              </div>

              {/* CONTENIDO RESPONSIVE - GRID */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10 items-start">

                {/* CALENDARIO */}
                <div className="order-2 lg:order-1 relative z-30">
                  <div className="flex justify-center lg:justify-start">
                    <div className="origin-center lg:origin-top-left scale-[0.95] sm:scale-100 md:scale-110 lg:scale-125">
                      <Calendar01 date={date} setDate={setDate} />
                    </div>
                  </div>
                </div>

                {/* REGISTRO DE CITAS */}
                <div className="order-1 lg:order-2 relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-black shadow-lg p-4 md:p-6 h-full max-h-[320px] sm:max-h-[380px] md:max-h-[500px] lg:max-h-[500px] overflow-y-auto">
                    <h2 className="text-xl md:text-2xl font-bold font-['Libre_Baskerville'] text-white mb-4 md:mb-6">
                      Registro de Citas
                    </h2>

                    {/* Citas simuladas */}
                    <div className="flex flex-col gap-3 md:gap-4">
                      {[
                        { date: "14/11/2025 - 10:00", status: "Realizada" },
                        { date: "15/11/2025 - 11:00", status: "Pendiente" },
                        { date: "16/11/2025 - 09:30", status: "Realizada" },
                        { date: "17/11/2025 - 12:00", status: "Pendiente" },
                        { date: "18/11/2025 - 10:30", status: "Realizada" },
                        { date: "19/11/2025 - 11:15", status: "Pendiente" },
                        { date: "20/11/2025 - 09:00", status: "Realizada" },
                      ].map((cita, index) => (
                        <div 
                          key={index}
                          className="p-3 md:p-4 bg-white/20 rounded-lg shadow-sm hover:bg-white/30 transition-colors duration-200"
                        >
                          <p className="font-semibold text-white text-sm md:text-base">{cita.date}</p>
                          <p className="text-white/90 text-sm">Estado: {cita.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* ESPACIO ADICIONAL PARA DISPOSITIVOS MÓVILES */}
              <div className="mt-6 lg:hidden"></div>

            </div>

          </div>

        </main>

      </SidebarInset>
    </SidebarProvider>
  )
}
