"use client"

import * as React from "react"
import { Montserrat } from "next/font/google"
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
import Calendar01, { type TimeSlot } from "@/app/frontend/components/calendar-01"
import { useSearchParams } from "next/navigation"

const montserrat = Montserrat({ subsets: ["latin"] })

type Cita = {
  id_cita: number
  dia_cita: string | null
  dia_creacion: string | null
  hora: string | null
  descripcion: string | null
  id_usuario: number | null
}

const TIME_SLOTS: TimeSlot[] = [
  { label: "08:00 - 09:00", start: "08:00", end: "09:00" },
  { label: "09:00 - 10:00", start: "09:00", end: "10:00" },
  { label: "10:00 - 11:00", start: "10:00", end: "11:00" },
  { label: "11:00 - 12:00", start: "11:00", end: "12:00" },
  { label: "12:00 - 13:00", start: "12:00", end: "13:00" },
  { label: "13:00 - 14:00", start: "13:00", end: "14:00" },
  { label: "14:00 - 15:00", start: "14:00", end: "15:00" },
]

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-")
  if (!year || !month || !day) return dateKey
  return `${day}/${month}/${year}`
}

const normalizeTime = (time: string | null) => (time ? time.slice(0, 5) : null)

const toDateTime = (dateKey: string, time: string | null) => {
  if (!dateKey || !time) return null
  const [year, month, day] = dateKey.split("-").map(Number)
  const [hours, minutes] = time.split(":").map(Number)
  if (!year || !month || !day || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [citas, setCitas] = React.useState<Cita[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [now, setNow] = React.useState(() => new Date())
  const searchParams = useSearchParams()
  const uid = searchParams.get("uid")
  const sig = searchParams.get("sig")
  const idUsuario = React.useMemo(() => {
    if (!uid) return null
    const parsed = Number(uid)
    return Number.isFinite(parsed) ? parsed : null
  }, [uid])

  const loadCitas = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/cita")
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? "Error al cargar citas.")
        setIsLoading(false)
        return
      }
      const data = await response.json()
      setCitas(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError("Error al cargar citas.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCitas()
  }, [loadCitas])

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const selectedDate = date ?? new Date()
  const selectedDateKey = React.useMemo(
    () => toDateKey(selectedDate),
    [selectedDate]
  )

  const citasForDay = React.useMemo(() => {
    return citas
      .filter((cita) => cita.dia_cita === selectedDateKey)
      .sort((a, b) => {
        const timeA = normalizeTime(a.hora) ?? ""
        const timeB = normalizeTime(b.hora) ?? ""
        return timeA.localeCompare(timeB)
      })
  }, [citas, selectedDateKey])

  const occupiedSlots = React.useMemo(() => {
    return citasForDay
      .map((cita) => normalizeTime(cita.hora))
      .filter((time): time is string => Boolean(time))
  }, [citasForDay])

  const handleCreateAppointment = React.useCallback(
    async (payload: { date: Date; time: string; description: string }) => {
      const hora = payload.time.length === 5 ? `${payload.time}:00` : payload.time
      const response = await fetch("/api/cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dia_cita: toDateKey(payload.date),
          hora,
          descripcion: payload.description,
          id_usuario: idUsuario,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        return { ok: false, error: data?.error ?? "Error al guardar la cita." }
      }

      await loadCitas()
      return { ok: true }
    },
    [idUsuario, loadCitas]
  )

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}

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
        <main className="h-[calc(100vh-5rem)] p-4 md:p-6 overflow-auto lg:overflow-hidden">
          {/* CONTENEDOR PRINCIPAL */}
          <div className="bg-white rounded-xl shadow-sm px-4 pb-4 pt-1 md:px-10 md:pb-10 md:pt-3 flex flex-col h-auto lg:h-full lg:overflow-hidden">
            {/* CONTENEDOR CON FONDO OSCURO */}
            <div className="rounded-xl p-4 md:p-6 lg:p-10 w-full flex flex-col h-full">
              {/* TITULO */}
              <div className="mb-6 md:mb-8 lg:mb-10 mt-2">
                <h1 className="px-4 md:px-6 lg:px-10 text-center md:text-left text-2xl md:text-3xl lg:text-4xl font-bold font-['Libre_Baskerville'] text-[#123d58]">
                  Citas de Secretaria
                </h1>
                <div className="mt-3 h-px w-[calc(100%+4rem)] bg-[#123d58]/40 -ml-8 md:w-[calc(100%+8rem)] md:-ml-16 lg:w-[calc(100%+10rem)] lg:-ml-20" />
              </div>

              {/* CONTENIDO RESPONSIVE - GRID */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start lg:items-stretch">
                {/* CALENDARIO */}
                <div className="order-2 lg:order-1 relative z-30 lg:flex lg:h-full lg:items-stretch lg:justify-start lg:pl-11">
                  <div className="flex justify-center lg:justify-start w-full h-full">
                    <div className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[420px] h-[320px] sm:h-[380px] md:h-[500px] lg:h-[500px]">
                      <Calendar01
                        date={date}
                        setDate={setDate}
                        timeSlots={TIME_SLOTS}
                        occupiedSlots={occupiedSlots}
                        onCreateAppointment={handleCreateAppointment}
                      />
                    </div>
                  </div>
                </div>

                {/* REGISTRO DE CITAS */}
                <div className="order-1 lg:order-2 relative z-10 h-[260px] sm:h-[320px] md:h-[420px] lg:h-[420px]">
                  <div className="bg-white rounded-xl border border-[#123d58]/40 shadow-sm px-4 md:px-6 pb-4 md:pb-6 pt-0 h-full overflow-y-auto">
                    <h2
                      className={`${montserrat.className} sticky top-0 z-10 -mx-4 md:-mx-6 mb-4 md:mb-6 px-4 md:px-6 py-3 text-lg md:text-xl font-semibold text-[#123d58] bg-white border-b border-[#123d58]/40`}
                    >
                      Registro de citas
                    </h2>

                    <div className="flex flex-col gap-3 md:gap-4">
                      {isLoading && (
                        <p className="text-[#123d58]/70 text-sm">
                          Cargando citas...
                        </p>
                      )}
                      {!isLoading && error && (
                        <p className="text-red-600 text-sm">{error}</p>
                      )}
                      {!isLoading && !error && citasForDay.length === 0 && (
                        <p className="text-[#123d58]/70 text-sm">
                          No hay citas para este dia.
                        </p>
                      )}
                      {!isLoading &&
                        !error &&
                        citasForDay.map((cita) => {
                          const timeValue = normalizeTime(cita.hora)
                          const dateKey = cita.dia_cita ?? selectedDateKey
                          const formattedDate = formatDateKey(dateKey)
                          const dateTime = toDateTime(dateKey, timeValue)
                          const isPast =
                            dateTime && dateTime.getTime() < now.getTime()
                          const status = isPast ? "Realizada" : "Pendiente"

                          return (
                            <div
                              key={cita.id_cita}
                              className="p-3 md:p-4 bg-white rounded-lg border border-black/10 shadow-sm hover:bg-black/5 transition-colors duration-200"
                            >
                              <p className="font-semibold text-[#123d58] text-sm md:text-base">
                                {formattedDate}
                                {timeValue ? ` - ${timeValue}` : ""}
                              </p>
                              <p className="text-sm text-[#123d58]/70">
                                Estado:{" "}
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    isPast
                                      ? "bg-[#123d58]/10 text-[#123d58]"
                                      : "bg-[#F7D0D7] text-[#7A2E43]"
                                  }`}
                                >
                                  {status}
                                </span>
                              </p>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ESPACIO ADICIONAL PARA DISPOSITIVOS MOVILES */}
              <div className="mt-6 lg:hidden"></div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
