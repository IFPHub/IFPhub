// proyectos.tsx
// ✅ CHANGE: Este archivo ahora SOLO contiene la página (antes estaba mezclado con FileUpload03).
"use client";

import * as React from "react";
import { useState } from "react";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import { Baskervville, Montserrat } from "next/font/google";
import { LiquidButton } from "@/app/frontend/components/ui/shadecn-io/liquid-button";
import Image from "next/image";
import { ProjectCard } from "@/app/frontend/components/ui/projectCard";
import Link from "next/link";

// ✅ CHANGE: En vez de renderizar el Dialog aquí, lo movemos a un componente dedicado (upload.tsx)
// para que el tamaño/scroll esté centralizado y sea reutilizable.
import UploadDialog from "@/app/frontend/components/upload";

const baskervville = Baskervville({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

type Proyecto = {
  id_proyecto: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string | null;
  autor_nombre: string | null;
  autor_avatar: string | null;
  curso_nombre: string | null;
  curso_grado: number | null;
};

type Curso = {
  id_curso: number;
  nombre: string;
  grado: number | null;
};

function getCursoSiglas(nombreCurso: string | null) {
  if (!nombreCurso) return "";

  const curso = nombreCurso.toLowerCase();

  if (curso.includes("multiplataforma")) return "dam";
  if (curso.includes("web")) return "daw";
  if (curso.includes("sistemas")) return "asix";

  return nombreCurso.toLowerCase();
}

function getCursoLabel(curso: Curso) {
  return curso.grado
    ? `${curso.nombre} (${curso.grado})`
    : curso.nombre;
}

export default function Page() {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [uid, setUid] = React.useState<string | null>(null);
    const [sig, setSig] = React.useState<string | null>(null);
    const [cursoId, setCursoId] = React.useState<string | null>(null);
    const [proyectos, setProyectos] = React.useState<Proyecto[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [categoryFilter, setCategoryFilter] = React.useState("");
    const [cursos, setCursos] = React.useState<Curso[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setUid(params.get("uid"));
      setSig(params.get("sig"));
      setCursoId(params.get("curso"));

      async function fetchProyectos() {
        try {
          const res = await fetch("/api/proyecto");
          if (!res.ok) throw new Error("Error al cargar proyectos");

          const data: Proyecto[] = await res.json();
          setProyectos(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      async function fetchCursos() {
        try {
          const res = await fetch("/api/cursos");
          if (!res.ok) throw new Error("Error al cargar cursos");
          const data: Curso[] = await res.json();
          setCursos(data);
          console.log(cursos);
        } catch (error) {
          console.error(error);
        }
      }

      fetchProyectos();
      fetchCursos();
    }, []);

    const normalizedFilter = categoryFilter
      .replace(/\(\d+\)/g, "") // quita (1), (2), etc
      .trim()
      .toLowerCase();
      
    const proyectosFiltrados = proyectos.filter((proyecto) => {
      if (!normalizedFilter) return true;
      const cursoNombre = proyecto.curso_nombre ?? "";
      const cursoGrado = proyecto.curso_grado !== null ? String(proyecto.curso_grado) : "";
      const cursoSiglas = getCursoSiglas(cursoNombre);
      const etiqueta = `${cursoGrado} ${cursoSiglas}`.trim();
      const categoria = cursoNombre.toLowerCase();
      return (
        categoria.includes(normalizedFilter) ||
        etiqueta.includes(normalizedFilter) ||
        cursoSiglas.includes(normalizedFilter)
      );
    });

    const cursosUnicos = React.useMemo(() => {
      const map = new Map<string, Curso>();

      cursos.forEach((curso) => {
        const key = `${curso.nombre}-${curso.grado}`;
        if (!map.has(key)) {
          map.set(key, curso);
        }
      });

      return Array.from(map.values());
    }, [cursos]);

    const sugerencias = React.useMemo(() => {
      const filtro = categoryFilter.toLowerCase();

      return cursosUnicos
        .filter((curso) =>
          !filtro ||
          getCursoLabel(curso).toLowerCase().includes(filtro)
        )
        .slice(0, 4);
    }, [categoryFilter, cursosUnicos]);

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}
      <SidebarInset>
        <div className="absolute top-4 left-4 z-50">
          <SidebarTrigger className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20" />
        </div>

        <div className="relative flex items-center justify-center p-4 md:p-8 lg:p-16 min-h-[50vh]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/imagenes/sistema operativo.jpg"
              alt="Sistema Operativo Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 lg:gap-12 max-w-7xl w-full px-4">
            <div className="max-w-3xl w-full space-y-4 text-center lg:text-left">
              <h1
                className={`${baskervville.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white`}
              >
                Proyectos Estudiantiles
              </h1>
            </div>

            <div className="flex-shrink-0 self-center lg:self-end">
              <LiquidButton
                className={`${montserrat.className}
                    px-8 py-5 md:px-10 md:py-6
                    text-sm md:text-base
                    [--liquid-button-color:#d46d85]
                    text-black
                    !bg-white
                `}
                variant="default"
                type="button"
                // ✅ CHANGE: abre el modal
                onClick={() => setUploadOpen(true)}
              >
                Añadir archivo
              </LiquidButton>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 lg:px-16 mt-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={categoryFilter}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="Filtrar por categoria"
                className={`${montserrat.className} w-full rounded-full bg-white/90 px-5 py-3 text-sm text-black shadow-md outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white`}
              />

              {isFocused && sugerencias.length > 0 && (
                <ul className="absolute left-0 top-full mt-2 w-full rounded-xl bg-[#0E4A54] shadow-xl overflow-hidden z-50">
                  {sugerencias.map((curso) => (
                    <li
                      key={`${curso.id_curso}-${curso.grado}`}
                      onMouseDown={() => {
                        setCategoryFilter(getCursoLabel(curso));
                        setIsFocused(false);
                      }}
                      className="px-4 py-3 text-sm text-white cursor-pointer hover:bg-[#D65A7E]"
                    >
                      {getCursoLabel(curso)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {loading && (
                <p className="text-white/80">Cargando proyectos...</p>
              )}

              {!loading && proyectos.length === 0 && (
                <p className="text-white/80">No hay proyectos todavia</p>
              )}

              {!loading && proyectos.length > 0 && proyectosFiltrados.length === 0 && (
                <p className="text-white/80">No hay proyectos para esa categoria</p>
              )}

              {!loading &&
                proyectosFiltrados.map((proyecto) => (
                  <Link
                    key={proyecto.id_proyecto}
                    href={{
                      pathname: `/proyecto/${proyecto.id_proyecto}`,
                      query: {
                        uid: uid ?? "",
                        sig: sig ?? "",
                      },
                    }}
                  >
                    <ProjectCard
                      title={proyecto.titulo}
                      description={proyecto.descripcion}
                      authorName={proyecto.autor_nombre ?? "Usuario"}
                      authorAvatar={proyecto.autor_avatar ?? undefined}
                      date={new Date(proyecto.fecha).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      coverImage={
                        proyecto.imagen
                          ? proyecto.imagen
                          : "/imagenes/sistema operativo.jpg"
                      }
                      cursoNombre={proyecto.curso_nombre}
                      cursoGrado={
                        proyecto.curso_grado !== null
                          ? String(proyecto.curso_grado)
                          : null
                      }
                    />
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* ✅ CHANGE: Dialog extraído a componente dedicado */}
        <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} title="Subir archivo" />
      </SidebarInset>
    </SidebarProvider>
  );
}
