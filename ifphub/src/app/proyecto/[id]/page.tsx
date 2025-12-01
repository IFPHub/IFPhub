import { createClient } from "@/app/backend/utils/supabase/client";
import Image from "next/image";

import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  // Llamada a la función creada previamente
  const { data, error } = await supabase.rpc("fn_get_proyecto_por_id", {
    p_id: Number(id),
  });

  if (error) {
    console.error(error);
    return <div>Error al cargar el proyecto</div>;
  }

  if (!data || data.length === 0) {
    return <div>No se ha encontrado el proyecto</div>;
  }

  const proyecto = data[0];
  const imagen = "/imagenes/placeholder.webp";

  return (
    <SidebarProvider>
      <AppSidebar />

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
                  <BreadcrumbLink href="/">Proyectos</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>{proyecto.titulo}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* ------------------------- CONTENIDO ---------------------------- */}

        <section className="w-full px-6 py-10">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            {/* Título REAL */}
            <h2 className="text-2xl font-semibold text-[#0E4A54] mb-6">
              {proyecto.titulo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Imagen grande */}
              <div className="md:col-span-2">
                <Image
                  src={imagen}
                  width={800}
                  height={500}
                  alt={proyecto.titulo}
                  className="rounded-xl w-full object-cover"
                />

                <div className="mt-4">
                  <span className="text-sm text-red-400 font-semibold">
                    Usuario {proyecto.id_usuario ?? "Desconocido"}
                  </span>

                  <h3 className="text-xl font-bold mt-1">{proyecto.titulo}</h3>

                  <div className="text-gray-600 mt-2 space-y-4 leading-relaxed">
                    {proyecto.descripcion
                      ?.split("\n")
                      .map((line: string, index: number) => (
                        <p key={index}>{line.trim()}</p>
                      ))}
                  </div>
                </div>
              </div>

              {/* Comentarios placeholder */}
              <div className="flex flex-col gap-6">
                {[2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Image
                      src="/imagenes/placeholder.webp"
                      width={50}
                      height={50}
                      alt="Avatar"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <span className="text-sm text-gray-500">
                        Estudiante {i}
                      </span>
                      <p className="text-gray-800">
                        Lorem ipsum dolor sit amet, consectetur sit
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-auto mb-4 w-full">
                  <input
                    type="text"
                    placeholder="Escribe un comentario"
                    className="border rounded-lg px-4 py-2 text-sm text-gray-700 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------- FOOTER ---------------------------- */}

        <footer className="w-full mt-8 pt-6 border-t">
          <div className="max-w-6xl mx-auto text-center px-4">
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#0E4A54] font-medium mb-3">
              <a href="#" className="hover:underline">
                Home / News
              </a>
              <a href="/proyectos" className="hover:underline">
                Proyectos
              </a>
              <a href="/secretaria" className="hover:underline">
                Secretaria
              </a>
              <a href="/reuniones" className="hover:underline">
                Reuniones
              </a>
              <a href="/quedadas" className="hover:underline">
                Quedadas
              </a>
              <a href="/incidencias" className="hover:underline">
                Incidencias
              </a>
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
