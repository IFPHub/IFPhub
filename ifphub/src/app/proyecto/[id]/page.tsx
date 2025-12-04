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

// Tipos del proyecto y comentario
type Comentario = {
  id_comentario: number;
  texto: string;
  fecha_hora: string;
  likes: number;
  id_usuario: number;
  entity_type: string;
  entity_id: number;
};

type Proyecto = {
  id_proyecto: number;
  titulo: string;
  descripcion: string;
  fecha: string | null;
  imagen: string | null;
  id_usuario: number | null;
};

export default async function Page(props: { params?: any }) {
  const params = await props.params;
  const supabase = createClient();
  const proyectoId = Number(params?.id);
  // Obtener proyecto
  const { data: proyectoData, error } = await supabase.rpc(
    "fn_get_proyecto_por_id",
    { p_id: proyectoId }
  );

  if (error || !proyectoData?.length) {
    console.error(error);
    return <div>Error al cargar el proyecto o no existe.</div>;
  }

  const proyecto: Proyecto = proyectoData[0];
  const imagen = "/imagenes/placeholder.webp";

  // Obtener comentarios del proyecto
  const { data: comentarios, error: errorComentarios } =
    await supabase.rpc("fn_get_comentarios_por_proyecto", {
      p_proyecto_id: proyectoId,
    });

  if (errorComentarios) console.error(errorComentarios);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/compartir-proyectos">
                    Proyectos
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>{proyecto.titulo}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* CONTENIDO */}
        <section className="w-full px-6 py-10">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-[#0E4A54] mb-6">
              {proyecto.titulo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* IMAGEN */}
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

                  <h3 className="text-xl font-bold mt-1">
                    {proyecto.titulo}
                  </h3>

                  <div className="text-gray-600 mt-2 space-y-4 leading-relaxed">
                    {proyecto.descripcion
                      ?.split("\n")
                      .map((line: string, index: number) => (
                        <p key={index}>{line.trim()}</p>
                      ))}
                  </div>
                </div>
              </div>

              {/* COMENTARIOS */}
              <div className="flex flex-col gap-6">
                {(comentarios as Comentario[] | null)?.map(
                  (c: Comentario) => (
                    <div
                      key={c.id_comentario}
                      className="flex items-center gap-4"
                    >
                      <Image
                        src="/imagenes/placeholder.webp"
                        width={50}
                        height={50}
                        alt="Avatar"
                        className="rounded-full object-cover"
                      />
                      <div>
                        <span className="text-sm text-gray-500">
                          Usuario {c.id_usuario}
                        </span>
                        <p className="text-gray-800">{c.texto}</p>
                      </div>
                    </div>
                  )
                )}

                {(!comentarios || comentarios.length === 0) && (
                  <p className="text-gray-500 text-sm">
                    No hay comentarios todavía.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full mt-8 pt-6 border-t">
          <div className="max-w-6xl mx-auto text-center px-4">
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#0E4A54] font-medium mb-3">
              <a href="#">Home / News</a>
              <a href="/compartir-proyectos">Proyectos</a>
              <a href="/quedadas">Quedadas</a>
              <a href="/incidencias">Incidencias</a>
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
