"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/frontend/components/ui/breadcrumb";
import { Separator } from "@/app/frontend/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/frontend/components/ui/carousel";

async function getProyectos() {
  const res = await fetch("/api/proyecto", { cache: "no-store" });
  return await res.json();
}

async function getCursos() {
  const res = await fetch("/api/cursos", { cache: "no-store" });
  return await res.json();
}

export default function Page() {
  const [proyectos, setProyectos] = React.useState<any[]>([]);
  const [cursos, setCursos] = React.useState<any[]>([]);

  /* ========= UID y SIG desde la URL (SIN useSearchParams) ========= */
  const [uid, setUid] = React.useState<string | null>(null);
  const [sig, setSig] = React.useState<string | null>(null);

  const cursosFiltrados = React.useMemo(() => {
    const map = new Map<string, any>();

    cursos.forEach((c) => {
      const key = `${c.nombre}-${c.grado}`;
      if (!map.has(key)) {
        map.set(key, c);
      }
    });

    return Array.from(map.values());
  }, [cursos]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUid(params.get("uid"));
    setSig(params.get("sig"));

    getProyectos().then((data) => {
      setProyectos(data);
    });
    getCursos().then(setCursos);
  }, []);

  // Imagen placeholder si no hay imagen real
  const getImg = (img: string | null) =>
    img && img.trim() !== "" ? img : "/imagenes/placeholder.webp";

  return (
    <SidebarProvider>
      <AppSidebar uid={uid} sig={sig} />
      <SidebarInset>

        {/* HEADER */}
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
                  <BreadcrumbLink href="#">Proyectos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Explorar</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* ------------------------------------ */}
        {/*  CONTENIDO PRINCIPAL */}
        {/* ------------------------------------ */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-x-hidden">

          {/* ---------- CARRUSEL DINÁMICO ---------- */}
          <div className="w-full px-4">
            <h2 className="text-xl font-semibold mb-2">
              Cursos de IFP
            </h2>

            <Carousel className="w-full relative">
              <CarouselContent className="-ml-2 md:-ml-4">

                {cursosFiltrados.map((c: any) => (
                  <CarouselItem
                    key={c.id_curso}
                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      href={{
                        pathname: "/proyectos-curso",
                        query: {
                          curso: c.id_curso,
                          grado: c.grado,
                          uid: uid ?? "",
                          sig: sig ?? "",
                        },
                      }}
                    >
                      <div className="p-1">
                        <div className="relative overflow-hidden rounded-xl">
                          <img
                            src="/imagenes/placeholder.webp"
                            alt={c.nombre}
                            className="w-full h-[200px] object-cover"
                          />
                          <span className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md">
                            {c.nombre} · Grado {c.grado}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}

              </CarouselContent>

              <CarouselPrevious className="left-2 z-20" />
              <CarouselNext className="right-2 z-20" />
            </Carousel>
          </div>
        </div>

        {/* ---------- SECCIÓN DESTACADO ---------- */}
        <section className="w-full px-6 py-10">
          <h2 className="text-2xl font-semibold text-red-400 mb-6">
            Destacado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* PROYECTO DESTACADO */}
            {proyectos[0] && (
              <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden h-full flex flex-col">
                <Link
                  href={`/proyecto/${proyectos[0].id_proyecto}?uid=${uid ?? ""}&sig=${sig ?? ""}`}
                >
                  <img
                    src={getImg(proyectos[0].imagen)}
                    alt={proyectos[0].titulo}
                    className="w-full h-64 object-cover"
                  />
                </Link>

                <div className="p-5">
                  <span className="text-sm text-red-400 font-semibold">
                    Alumno {proyectos[0].id_usuario}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {proyectos[0].titulo}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {proyectos[0].descripcion.slice(0, 200)}...
                  </p>
                </div>
              </div>
            )}

            {/* TARJETAS PEQUEÑAS */}
            <div className="flex flex-col justify-between h-full">
              {proyectos.slice(1, 4).map((p: any) => (
                <div
                  key={p.id_proyecto}
                  className="flex bg-white rounded-xl shadow overflow-hidden"
                >
                  <img
                    src={getImg(p.imagen)}
                    alt={p.titulo}
                    className="w-28 h-28 object-cover"
                  />
                  <div className="p-3">
                    <span className="text-sm text-gray-400">
                      Alumno {p.id_usuario}
                    </span>
                    <h4 className="font-semibold">{p.titulo}</h4>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <section className="w-full bg-[#104B57] py-16 px-6">
          <h2 className="text-white text-3xl font-semibold mb-12 text-center">
            Comentarios
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

            {/* Comentarios estáticos */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center text-white space-y-4"
              >
                <img
                  src="/imagenes/placeholder.webp"
                  alt="User"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold">Lorem</h3>
                <p className="text-sm text-gray-200 px-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <Link href="/proyecto/1">
                  <div className="text-gray-300 text-sm hover:text-white underline underline-offset-4">
                    Ver más +
                  </div>
                </Link>
              </div>
            ))}

          </div>
        </section>
        {/* FOOTER */}
        <footer className="w-full mt-8 pt-6 border-t">
          <div className="max-w-6xl mx-auto text-center px-4">

            <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#0E4A54] font-medium mb-3">
              <a href="#" className="hover:underline">Home / News</a>
              <a href="/compartir-proyectos" className="hover:underline">Proyectos</a>
              <a href="/quedadas" className="hover:underline">Quedadas</a>
              <a href="/incidencias" className="hover:underline">Incidencias</a>
            </nav>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              © 2025 Name -- Portal Campus
            </p>
          </div>
        </footer>

      </SidebarInset>
    </SidebarProvider>
  );
}
