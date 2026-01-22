"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/app/frontend/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/frontend/components/ui/select"

/**
 * Prioridad automatica segun el tipo de incidencia
 * null = requiere evaluacion manual
 */
const PRIORITY_BY_TYPE: Record<string, number | null> = {
  "Electricidad/Iluminacion": 5,
  "Internet/Red": 5,
  Proyector: 3,
  Mobiliario: 1,
  Otro: null,
}

export function AddItemDialog() {
  const [aula, setAula] = useState<number | null>(null)
  const [tipo, setTipo] = useState<string | null>(null)
  const [descripcion, setDescripcion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const prioridad = tipo ? PRIORITY_BY_TYPE[tipo] : null
  const isFormValid = aula !== null && Boolean(tipo) && descripcion.trim().length > 0

  const handleSubmit = async () => {
    setError(null)
    setSuccess(false)

    if (!isFormValid) {
      setError("Completa todos los campos.")
      return
    }

    const incidencia = {
      id_aula: aula,
      tipo_incidencia: tipo,
      explicacion: descripcion.trim(),
      prioridad,
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incidencia),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? "Error al enviar incidencia.")
        return
      }

      setSuccess(true)
      setDescripcion("")
    } catch (submitError) {
      console.error(submitError)
      setError("Error al enviar incidencia.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full px-4 py-2 rounded-md bg-[#123d58]/95 text-white hover:bg-[#123d58] text-center font-montserrat tracking-wide border border-[#123d58]/60 shadow-sm hover:shadow-md transition-colors transition-shadow duration-200 ease-out">
          Nueva incidencia
        </button>
      </DialogTrigger>

      <DialogContent className="font-montserrat bg-white text-slate-700 border border-[#123d58] shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="w-full text-left font-montserrat text-2xl font-semibold tracking-normal text-[#123d58] border-b border-[#123d58]/30 pb-3">
            Incidencias
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Aula */}
          <div className="w-full max-w-md">
            <Select onValueChange={(value) => setAula(Number(value))}>
              <SelectTrigger className="justify-center text-center bg-white text-[#123d58] border border-[#123d58]/55 hover:border-[#123d58]/70 data-[state=open]:border-[#123d58]/90 focus:ring-2 focus:ring-[#123d58]/80 focus:ring-offset-0 transition-colors">
                <SelectValue placeholder="Numero del aula" />
              </SelectTrigger>
              <SelectContent className="border border-[#123d58]/35 bg-white text-slate-700 shadow-lg max-h-52 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="1">Aula 1</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="2">Aula 2</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="3">Aula 3</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="4">Aula 4</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="5">Aula 5</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="6">Aula 6</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="7">Aula 7</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="8">Aula 8</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="9">Aula 9</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="10">Aula 10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de incidencia */}
          <div className="w-full max-w-md">
            <Select onValueChange={setTipo}>
              <SelectTrigger className="justify-center text-center bg-white text-[#123d58] border border-[#123d58]/55 hover:border-[#123d58]/70 data-[state=open]:border-[#123d58]/90 focus:ring-2 focus:ring-[#123d58]/80 focus:ring-offset-0 transition-colors">
                <SelectValue placeholder="Tipo de incidencia" />
              </SelectTrigger>
              <SelectContent className="border border-[#123d58]/35 bg-white text-slate-700 shadow-lg max-h-52 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="Internet/Red">Internet/Red</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="Electricidad/Iluminacion">
                  Electricidad / Iluminacion
                </SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="Proyector">Proyector</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="Mobiliario">Mobiliario</SelectItem>
                <SelectItem className="border-b border-[#123d58]/40 last:border-none hover:bg-[#123d58]/15 data-[state=checked]:bg-[#123d58]/25 data-[state=checked]:text-[#123d58] data-[state=checked]:font-medium transition-colors" value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripcion */}
          <div className="w-full max-w-md">
            <textarea
              placeholder="Explica tu incidencia con detalle"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full h-40 p-4 rounded-xl bg-white text-slate-700 placeholder:text-slate-400 border border-[#123d58]/55 hover:border-[#123d58]/70 focus:border-[#123d58]/80 outline-none resize-none focus:ring-2 focus:ring-[#123d58]/80 transition-colors"
            />
          </div>

          {/* Informacion de prioridad (solo informativa) */}
          {tipo && (
            <p className="text-center text-sm text-slate-500">
              Prioridad asignada:{" "}
              <span className="font-semibold text-[#123d58]">
                {prioridad ?? "Sin prioridad"}
              </span>
            </p>
          )}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
          {success && !error && (
            <p className="text-center text-sm text-emerald-600">
              Incidencia enviada.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors duration-200 ease-out">
              Cancelar
            </button>
          </DialogClose>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="px-4 py-2 rounded-md bg-[#D46D95]/90 hover:bg-[#D46D95] text-white shadow-sm hover:shadow-md border border-[#123d58]/40 transition-colors transition-shadow duration-200 ease-out disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}




