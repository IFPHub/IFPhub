import Header from '@/app/frontend/components/header'
import Hero from '@/app/frontend/components/hero'
import Sidebar from '@/app/frontend/components/sidebar-noticias'
import Link from "next/link"

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

  console.log("UID:", uid);
  console.log("SIG:", sig);

  const noticias = await getNoticias();

  const getImg = (img: string) =>
    img && img.trim() !== "" ? img : "/imagenes/default_image.webp";

  return (
    <main>
      <Header />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="bg-card rounded-[14px] p-8 shadow-md-custom">
          <Hero />

          {/* POPULAR */}
          <section className="mt-8">
            <div className="border-l-4 border-accent pl-3 mb-4">
              <h3 className="text-accent uppercase tracking-widest text-sm font-libre">Popular</h3>
            </div>

            <div className="grid gap-4">
              {noticias.slice(0, 3).map((n: any) => (
                <Link 
                  key={n.id_noticia} 
                  href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}
                >
                  <article className="flex gap-4 items-center p-4 rounded-lg bg-white border border-[#eef3f6] hover:shadow-md-custom transition-transform cursor-pointer">
                    <img
                      src={getImg(n.imagen)}
                      alt={n.titulo}
                      className="w-[110px] h-[72px] rounded-md object-cover"
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
            {noticias.slice(3, 5).map((n: any) => (
              <Link key={n.id_noticia} href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}>
                <div className="bg-white rounded-lg p-4 border border-[#eef3f6] hover:shadow-md-custom transition-transform cursor-pointer">
                  <img
                    src={getImg(n.imagen)}
                    alt={n.titulo}
                    className="h-[140px] w-full rounded-md object-cover"
                  />
                  <h4 className="mt-3">{n.titulo}</h4>
                  <p className="text-sm text-muted mt-1">{n.descripcion.slice(0, 100)}...</p>
                </div>
              </Link>
            ))}

            <div className="flex flex-col gap-3">
              {noticias.slice(5, 7).map((n: any) => (
                <Link key={n.id_noticia} href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}>
                  <div className="bg-white rounded-lg p-3 border border-[#eef3f6] cursor-pointer">
                    <img
                      src={getImg(n.imagen)}
                      alt={n.titulo}
                      className="h-20 w-full rounded-md object-cover"
                    />
                    <h5 className="mt-2">{n.titulo}</h5>
                    <p className="text-sm text-muted mt-1">{n.descripcion.slice(0, 80)}...</p>
                  </div>
                </Link>
              ))}
            </div>
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
  );
}
