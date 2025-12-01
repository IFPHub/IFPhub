import Header from "@/app/frontend/components/header";
import Sidebar from "@/app/frontend/components/sidebar-noticias";
import { createClient } from "@/app/backend/utils/supabase/client";

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

  return (
    <main className="wrap">
      <Header />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="bg-card rounded-[14px] p-8 shadow-md-custom">
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold leading-tight">
            {noticia.titulo}
          </h1>

          <img
            src={imagen}
            alt={noticia.titulo}
            className="h-80 w-full rounded-[14px] object-cover mb-6"
          />

          <p className="text-gray-700">{noticia.descripcion}</p>

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
