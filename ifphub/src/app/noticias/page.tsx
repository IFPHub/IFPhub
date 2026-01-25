import Hero from '@/app/frontend/components/hero'
import Sidebar from '@/app/frontend/components/sidebar-noticias'
import Link from "next/link"

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
import AuthGuard from "@/app/frontend/components/AuthGuard";

async function getNoticias() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/noticias`, {
    cache: "no-store",
  });

  return await res.json();
}

export default async function Page(props: { searchParams: Promise<any> }) {
  const search = await props.searchParams;

  const uid = search?.uid;
  const sig = search?.sig;

  const noticias = await getNoticias();
  const noticiasArray = Array.isArray(noticias) ? noticias : noticias?.data ?? [];

  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  
  const randomNoticias = shuffle(noticiasArray).slice(0, 8);

  const getPicsum = (seed: string | number, w: number, h: number) =>
    `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;

  return (
    <SidebarProvider>
      <AuthGuard>
        {uid && sig && <AppSidebar uid={uid} sig={sig} />}

        <SidebarInset>
          {/* HEADER */}
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />

              <Separator orientation="vertical" className="mr-2" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Noticias</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* CONTENIDO */}
          <main className="px-4 py-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <section className="bg-card rounded-[14px] p-8 shadow-md-custom">
                <Hero />

                {/* POPULAR */}
                <section className="mt-8">
                  <div className="border-l-4 border-accent pl-3 mb-4">
                    <h3 className="text-accent uppercase tracking-widest text-sm font-libre">
                      Popular
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {randomNoticias.slice(0, 3).map((n: any) => (
                      <Link key={n.id_noticia} href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}>
                        <article className="flex gap-4 items-center p-4 rounded-lg bg-white border border-[#eef3f6] hover:shadow-md-custom transition-transform cursor-pointer">
                          <img
                            src={getPicsum(n.id_noticia, 110, 72)}
                            alt={n.titulo}
                            className="w-[110px] h-[72px] rounded-md object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div>
                            <h4 className="text-[15px] font-semibold">{n.titulo}</h4>
                            <p className="text-sm text-muted">{n.descripcion.slice(0, 70)}...</p>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* EXTRA CARDS */}
                <section className="mt-8 grid gap-4 lg:grid-cols-2">
                  {randomNoticias.slice(0, 4).map((n: any) => (
                    <Link key={n.id_noticia} href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}>
                      <div className="bg-white rounded-lg p-4 border border-[#eef3f6] hover:shadow-md-custom transition-transform cursor-pointer">
                        <img
                          src={getPicsum(n.id_noticia, 640, 360)}
                          alt={n.titulo}
                          className="h-[140px] w-full rounded-md object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <h4 className="mt-3">{n.titulo}</h4>
                        <p className="text-sm text-muted mt-1">{n.descripcion.slice(0, 100)}...</p>
                      </div>
                    </Link>
                  ))}
                </section>

                <footer className="mt-8 text-center text-sm text-muted border-t pt-4">
                  © 2025 Portal Noticias — Diseño Pro++
                </footer>
              </section>

              <aside>
                <Sidebar uid={uid} sig={sig} />
              </aside>
            </div>
          </main>
        </SidebarInset>
      </AuthGuard>
    </SidebarProvider>
  );
}