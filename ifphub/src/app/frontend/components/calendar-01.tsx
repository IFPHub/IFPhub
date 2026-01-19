"use client"

import * as React from "react"
import { Calendar } from "@/app/frontend/components/ui/calendar"

interface Calendar01Props {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export default function Calendar01({ date, setDate }: Calendar01Props) {
  const [isHourPopupOpen, setIsHourPopupOpen] = React.useState(false)
  const [isAppointmentPopupOpen, setIsAppointmentPopupOpen] = React.useState(false)
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = React.useState<string | null>(null)
  const [appointmentTitle, setAppointmentTitle] = React.useState("")
  const [appointmentDesc, setAppointmentDesc] = React.useState("")

  const hours = [
    { time: "08:00 - 09:00", available: false },
    { time: "09:00 - 10:00", available: true },
    { time: "10:00 - 11:00", available: false },
    { time: "11:00 - 12:00", available: true },
    { time: "12:00 - 13:00", available: true },
    { time: "13:00 - 14:00", available: false },
    { time: "14:00 - 15:00", available: true },
  ]

  const handleSelect = (day: Date | undefined) => {
    if (!day) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isWeekend = day.getDay() === 0 || day.getDay() === 6

    if (day < today || isWeekend) return

    setDate(day)
    setSelectedDay(day)
    setIsHourPopupOpen(true)
  }

  const handleSelectHour = (hour: string, available: boolean) => {
    if (!available) return
    setSelectedHour(hour)
    setIsHourPopupOpen(false)
    setIsAppointmentPopupOpen(true)
  }

  const handleSaveAppointment = () => {
    alert(
      `Cita registrada:\nFecha: ${selectedDay?.toLocaleDateString()}\nHora: ${selectedHour}\nTítulo: ${appointmentTitle}\nDescripción: ${appointmentDesc}`
    )
    setIsAppointmentPopupOpen(false)
    setAppointmentTitle("")
    setAppointmentDesc("")
    setSelectedHour(null)
  }

  // solo tamaño del calendario, el fondo lo da el wrapper
  const calendarClass = "w-full h-[21rem]"

  return (
    <div className="relative rounded-lg border shadow-sm bg-white p-4">
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
              ✕
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {hours.map((hour, index) => (
              <li
                key={index}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  hour.available
                    ? "bg-green-200 hover:bg-green-300 text-black"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                onClick={() => handleSelectHour(hour.time, hour.available)}
              >
                {hour.time} {!hour.available && "(Ocupado)"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* POPUP DE REGISTRO DE CITA */}
      {isAppointmentPopupOpen && selectedDay && selectedHour && (
        <div className="absolute top-4 right-[calc(100%+1rem)] w-64 bg-[#124d58] rounded-xl border border-black shadow-xl p-4 z-50">
          <h2 className="font-semibold text-lg mb-2 text-white">
            Nueva cita - {selectedDay.toLocaleDateString()} {selectedHour}
          </h2>
          <input
            type="text"
            placeholder="Título de la cita"
            className="w-full p-2 border rounded mb-2 bg-white text-black"
            value={appointmentTitle}
            onChange={(e) => setAppointmentTitle(e.target.value)}
          />
          <textarea
            placeholder="Descripción"
            className="w-full p-2 border rounded mb-2 bg-white text-black"
            value={appointmentDesc}
            onChange={(e) => setAppointmentDesc(e.target.value)}
          />
          <button
            className="w-full px-4 py-2 bg-[#F7D0D7] text-black rounded hover:bg-[#d46d85] mb-2"
            onClick={handleSaveAppointment}
          >
            Guardar
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
