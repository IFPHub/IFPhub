"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/app/frontend/components/login-form";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import { Button } from "@/app/frontend/components/ui/button";
import { Input } from "@/app/frontend/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/frontend/components/ui/dialog";
import { Hero_ofertas } from "@/app/frontend/components/hero-ofertas";
import { Baskervville, Montserrat } from "next/font/google";
import { LiquidButton } from "@/app/frontend/components/ui/shadecn-io/liquid-button";
import Image from "next/image";

interface Oficio {
  id_oferta: number;
  titulo: string;
  descripcion: string;
  sueldo: number;
  usuario_nombre: string;
  curso_nombre: string;
  curso_grado: number;
}

type NuevaOfertaInput = {
  titulo: string;
  descripcion: string;
  sueldo: number;
  id_curso: number;
};

function getCursoSiglas(nombreCurso: string | null) {
  if (!nombreCurso) return "";

  const curso = nombreCurso.toLowerCase();

  if (curso.includes("multiplataforma")) return "DAM";
  if (curso.includes("web")) return "DAW";
  if (curso.includes("sistemas")) return "ASIX";

  return nombreCurso;
}

const baskervville = Baskervville({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

// Componente hijo
function AceptarDialog({ titulo }: { titulo: string }) {
  const [nombreLocal, setNombreLocal] = useState("");
  const [emailLocal, setEmailLocal] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full bg-[#D46D85] hover:bg-[#D46D85] text-white cursor-pointer border border-[#124d58]/30 font-family: var(--font-montserrat);">
          Solicitar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-title font-bold font-title text-[#124d58]">Aceptar oferta</DialogTitle>
          <DialogDescription>
            Introduce tu nombre y correo para aceptar la oferta de{" "}
            <strong>{titulo}.</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={nombreLocal}
              onChange={(e) => setNombreLocal(e.target.value)}
              placeholder="Samuel García"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              placeholder="usuario@dominio.es"
            />
          </div>

          <DialogDescription>
            En breves recibirás un correo del ofertante.
          </DialogDescription>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className=" bg-[#D46D85] hover:bg-[#D46D85] cursor-pointer">Aceptar oferta</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function NuevaOfertaDialog({ onSubmit }: { onSubmit: (oficio: any) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#D46D85] hover:bg-[#D46D85] text-white cursor-pointer font-family: var(--font-montserrat);">
          Crear oferta
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Puedes descomentar esto si quieres título en el diálogo */}
          {/* <DialogTitle className="font-title">Crear nueva oferta</DialogTitle> */}
          {/* <DialogDescription>
            Rellena los datos de la oferta para publicarla.
          </DialogDescription> */}
        </DialogHeader>

        <div className="py-4">
          <LoginForm
            onSubmit={(oficio) => {
              onSubmit(oficio);
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LoginPage() {

    const [oficios, setOficios] = useState<Oficio[]>([]);
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState<string | null>(null);
    const [sig, setSig] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUid(params.get("uid"));
        setSig(params.get("sig"));

        async function fetchOfertas() {
            try {
            const res = await fetch("/api/oferta");
            if (!res.ok) throw new Error("Error al cargar ofertas");

            const data = await res.json();
            setOficios(data);
            } catch (error) {
            console.error(error);
            } finally {
            setLoading(false);
            }
        }

        fetchOfertas();
    }, []);

    const handleNuevaOferta = async (oficio: NuevaOfertaInput) => {
        try {
            const res = await fetch("/api/oferta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(oficio),
            });

            if (!res.ok) {
            throw new Error("Error al crear la oferta");
            }

            // 🔁 refrescamos desde la API (fuente de verdad)
            await fetchOfertas();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOfertas = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/oferta");
            if (!res.ok) throw new Error("Error al cargar ofertas");

            const data: Oficio[] = await res.json();
            setOficios(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <SidebarProvider>
        <AppSidebar uid={uid} sig={sig} />
        <SidebarInset>

            {/* SidebarTrigger flotante */}
            <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20" />
            </div>

            {/* HERO */}
            <div className="relative flex items-center justify-center p-4 md:p-8 lg:p-16 min-h-[50vh]">
            {/* background */}
            <div className="absolute inset-0 z-0">
                <Image
                src="/imagenes/entrevista.png"
                alt="Entrevista Background"
                fill
                className="object-cover"
                priority
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* contenido hero */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-7xl w-full px-4">
                <div className="max-w-3xl w-full space-y-3 md:space-y-4 text-center lg:text-left">
                <h1
                    className={`${baskervville.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white`}
                >
                    Ofertas de trabajo
                </h1>
                </div>

                <div className="flex-shrink-0">
                <NuevaOfertaDialog onSubmit={handleNuevaOferta} />
                </div>
            </div>
            </div>

            {/* CONTENIDO */}
            <div className="p-8 md:p-16">
            <div className="max-w-7xl mx-auto space-y-8">

                <h2 className="text-2xl font-bold font-title text-[#124d58]">
                Ofertas actuales
                </h2>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
                    {loading && (
                        <p className="col-span-full text-center text-muted-foreground">
                        Cargando ofertas...
                        </p>
                    )}

                    {!loading && oficios.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground">
                        No hay ofertas disponibles
                        </p>
                    )}
                    {oficios.map((oficio) => (
                        <div
                            key={oficio.id_oferta}
                            className="bg-white shadow rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(18,77,88,0.4)]"
                        >
                        <div className="p-4 flex flex-col gap-2">
                            <p className="text-xs text-muted-foreground">
                                {getCursoSiglas(oficio.curso_nombre)}
                                {oficio.curso_grado && ` · ${oficio.curso_grado}º`}
                            </p>
                            <h3 className="font-semibold font-title line-clamp-2">{oficio.titulo}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                            {oficio.descripcion}
                            </p>
                            <p className="text-sm font-bold font-title text-[#124d58]">
                                {oficio.sueldo} €/h
                            </p>
                            <p className="text-xs text-muted-foreground">
                            </p>
                            <AceptarDialog titulo={oficio.titulo} />
                        </div>
                        </div>
                    ))}
                </div>

            </div>
            </div>

        </SidebarInset>
        </SidebarProvider>
  );
}
