"use client"

import * as React from "react"
import { Calendar } from "@/app/frontend/components/ui/calendar"

export interface TimeSlot {
  label: string
  start: string
  end: string
}

interface Calendar01Props {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  timeSlots: TimeSlot[]
  occupiedSlots: string[]
  onCreateAppointment: (payload: {
    date: Date
    time: string
    description: string
  }) => Promise<{ ok: boolean; error?: string }>
}

export default function Calendar01({
  date,
  setDate,
  timeSlots,
  occupiedSlots,
  onCreateAppointment,
}: Calendar01Props) {
  const [isHourPopupOpen, setIsHourPopupOpen] = React.useState(false)
  const [isAppointmentPopupOpen, setIsAppointmentPopupOpen] =
    React.useState(false)
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [appointmentTitle, setAppointmentTitle] = React.useState("")
  const [appointmentDesc, setAppointmentDesc] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  const occupiedSet = React.useMemo(
    () => new Set(occupiedSlots),
    [occupiedSlots]
  )

  const isSlotInPast = React.useCallback((day: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const slotDate = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      hours,
      minutes,
      0,
      0
    )
    return slotDate.getTime() < Date.now()
  }, [])

  const handleSelect = (day: Date | undefined) => {
    if (!day) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isWeekend = day.getDay() === 0 || day.getDay() === 6

    if (day < today || isWeekend) return

    setDate(day)
    setSelectedDay(day)
    setSelectedTime(null)
    setError(null)
    setIsHourPopupOpen(true)
  }

  const handleSelectHour = (time: string, available: boolean) => {
    if (!available) return
    setSelectedTime(time)
    setIsHourPopupOpen(false)
    setIsAppointmentPopupOpen(true)
  }

  const handleSaveAppointment = async () => {
    if (!selectedDay || !selectedTime) return

    const trimmedTitle = appointmentTitle.trim()
    const trimmedDesc = appointmentDesc.trim()

    if (!trimmedTitle && !trimmedDesc) {
      setError("Introduce un titulo o una descripcion.")
      return
    }

    const description =
      trimmedTitle && trimmedDesc
        ? `${trimmedTitle} - ${trimmedDesc}`
        : trimmedTitle || trimmedDesc

    setIsSaving(true)
    setError(null)
    const result = await onCreateAppointment({
      date: selectedDay,
      time: selectedTime,
      description,
    })
    setIsSaving(false)

    if (!result.ok) {
      setError(result.error ?? "Error al guardar la cita.")
      return
    }

    setIsAppointmentPopupOpen(false)
    setAppointmentTitle("")
    setAppointmentDesc("")
    setSelectedTime(null)
  }

  const calendarClass = "w-full h-full"

  return (
    <div className="relative rounded-lg border shadow-sm bg-white p-4 h-full min-h-[21rem] flex flex-col">
      <Calendar
        mode="single"
        required={false}
        defaultMonth={date}
        selected={date}
        onSelect={handleSelect}
        className={calendarClass}
        disabled={(day) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6
          return day < today || isWeekend
        }}
      />

      {/* POPUP DE HORAS */}
      {isHourPopupOpen && selectedDay && (
        <div className="absolute top-0 left-0 md:left-auto md:right-0 lg:top-0 lg:left-full lg:ml-4 w-72 max-h-80 bg-[#124d58] text-white rounded-xl border border-black shadow-xl p-4 overflow-y-auto scrollbar-hide z-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">
              Horas para {selectedDay.toLocaleDateString()}
            </h2>
            <button
              onClick={() => setIsHourPopupOpen(false)}
              className="text-white hover:text-gray-300"
            >
              x
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {timeSlots.map((slot, index) => {
              const isOccupied = occupiedSet.has(slot.start)
              const isPast = isSlotInPast(selectedDay, slot.start)
              const isAvailable = !isOccupied && !isPast
              const statusLabel = isOccupied
                ? " (Ocupado)"
                : isPast
                  ? " (No disponible)"
                  : ""

              return (
                <li
                  key={index}
                  className={`p-2 rounded transition-colors ${
                    isAvailable
                      ? "bg-green-200 hover:bg-green-300 text-black cursor-pointer"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => handleSelectHour(slot.start, isAvailable)}
                >
                  {slot.label}
                  {statusLabel}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* POPUP DE REGISTRO DE CITA */}
      {isAppointmentPopupOpen && selectedDay && selectedTime && (
        <div className="absolute top-4 right-[calc(100%+1rem)] w-64 bg-[#124d58] rounded-xl border border-black shadow-xl p-4 z-50">
          <h2 className="font-semibold text-lg mb-2 text-white">
            Nueva cita - {selectedDay.toLocaleDateString()} {selectedTime}
          </h2>
          <input
            type="text"
            placeholder="Titulo de la cita"
            className="w-full p-2 border rounded mb-2 bg-white text-black"
            value={appointmentTitle}
            onChange={(e) => setAppointmentTitle(e.target.value)}
          />
          <textarea
            placeholder="Descripcion"
            className="w-full p-2 border rounded mb-2 bg-white text-black"
            value={appointmentDesc}
            onChange={(e) => setAppointmentDesc(e.target.value)}
          />
          {error && <p className="text-sm text-red-200 mb-2">{error}</p>}
          <button
            className="w-full px-4 py-2 bg-[#F7D0D7] text-black rounded hover:bg-[#d46d85] mb-2 disabled:opacity-70"
            onClick={handleSaveAppointment}
            disabled={isSaving}
          >
            {isSaving ? "Enviando..." : "Enviar"}
          </button>
          <button
            className="w-full px-4 py-2 bg-[#F7D0D7] text-black rounded hover:bg-[#d46d85]"
            onClick={() => setIsAppointmentPopupOpen(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
