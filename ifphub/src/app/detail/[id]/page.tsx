import Sidebar from "@/app/frontend/components/sidebar-noticias";
import { createClient } from "@/app/backend/utils/supabase/client";
import { Baskervville } from "next/font/google";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/app/frontend/components/ui/breadcrumb";

import { Separator } from "@/app/frontend/components/ui/separator";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

const baskervville = Baskervville({
  weight: "700",
  subsets: ["latin"],
});

export default async function DetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_noticia_por_id", {
    p_id: Number(id),
  });

  if (error) {
    console.error(error);
    return <div>Error cargando noticia</div>;
  }

  if (!data || data.length === 0) {
    return <div>No se ha encontrado la noticia</div>;
  }

  const noticia = data[0];

  const imagen =
    noticia.imagen && noticia.imagen.trim() !== ""
      ? noticia.imagen
      : "/imagenes/default_image.webp";

  const descripcion = noticia.descripcion ?? "";
  const descriptionParts = descripcion.split(/\n\s*\n/);

  let firstParagraph = descriptionParts[0] ?? "";
  let secondParagraph = "";
  let thirdParagraph = "";

  if (descriptionParts.length >= 3) {
    secondParagraph = descriptionParts[1] ?? "";
    thirdParagraph = descriptionParts.slice(2).join("\n\n");
  } else if (descriptionParts.length === 2) {
    secondParagraph = descriptionParts[1] ?? "";
  } else {
    const sentences = descripcion.split(". ").filter(Boolean);
    if (sentences.length >= 3) {
      firstParagraph = `${sentences[0]}.`;
      secondParagraph = `${sentences[1]}.`;
      thirdParagraph = sentences.slice(2).join(". ");
    }
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <main className="wrap">
          {/* HEADER */}
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/noticias">
                    Noticias
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>{noticia.titulo}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* CONTENIDO */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] px-4">
            <article className="bg-card rounded-[14px] p-8 shadow-md-custom">
              <h1
                className={`${baskervville.className} mb-4 text-2xl md:text-3xl font-bold leading-tight`}
              >
                {noticia.titulo}
              </h1>

              <img
                src={imagen}
                alt={noticia.titulo}
                className="h-80 w-full rounded-[14px] object-cover mb-6"
              />

              <p className="text-gray-700">{firstParagraph}</p>

              {secondParagraph && (
                <p className="mt-4 text-gray-700">{secondParagraph}</p>
              )}

              {thirdParagraph && (
                <p className="mt-4 text-gray-700">{thirdParagraph}</p>
              )}

              <footer className="mt-10 text-center text-sm text-muted border-t pt-4">
                © 2025 Portal Noticias
              </footer>
            </article>

            <aside className="sidebar">
              <Sidebar />
            </aside>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
