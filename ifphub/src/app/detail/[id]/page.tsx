import Header from "@/app/frontend/components/header";
import Sidebar from "@/app/frontend/components/sidebar-noticias";
import { createClient } from "@/app/backend/utils/supabase/client";
import { Baskervville } from "next/font/google";

const baskervville = Baskervville({ weight: "700", subsets: ["latin"] });

export default async function DetailPage(props: { params: Promise<{ id: string }> }) {
  const { params } = props;
  const { id } = await params;

  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_noticia_por_id", {
    p_id: Number(id)
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
      if (thirdParagraph && !thirdParagraph.endsWith(".")) {
        thirdParagraph = `${thirdParagraph}.`;
      }
    } else if (sentences.length === 2) {
      firstParagraph = `${sentences[0]}.`;
      secondParagraph = `${sentences[1]}.`;
    }
  }

  return (
    <main className="wrap">
      <Header />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="bg-card rounded-[14px] p-8 shadow-md-custom">
          <h1
            className={`${baskervville.className} mt-2 mb-4 text-2xl md:text-3xl font-bold leading-tight`}
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
            © 2025 Portal Noticias — Diseño Pro++
          </footer>
        </article>

        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>
    </main>
  );
}
