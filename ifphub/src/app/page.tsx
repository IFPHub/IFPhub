import Header from '../components/Header'
import Hero from '../components/Hero'
import Sidebar from '../components/Sidebar'
import Link from "next/link"

export default function Page() {
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
              {[
                'Cómo sacar el máximo provecho a las prácticas',
                'Resultados del torneo interfacultades',
                'Becas y ayudas: plazos abiertos'
              ].map((t)=> (
                <Link key={t} href="/detail">
                  <article className="flex gap-4 items-center p-4 rounded-lg bg-white border border-[#eef3f6] hover:shadow-md-custom transition-transform cursor-pointer">
                    <div className="w-[110px] h-[72px] rounded-md bg-gradient-to-b from-[var(--soft)] to-[#ffeaf0]" />
                    <div>
                      <h4 className="text-[15px] font-semibold">{t}</h4>
                      <p className="text-sm text-muted">Resumen rápido y utilidad para estudiantes.</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* EXTRA CARDS */}
          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <Link href="/detail">
              <div className="bg-white rounded-lg p-4 border border-[#eef3f6] hover:shadow-md-custom transition-transform cursor-pointer">
                <div className="h-[140px] rounded-md bg-gradient-to-br from-[#ffeaf0] to-[#f9dbe2]" />
                <h4 className="mt-3">Evento destacado: Conferencia internacional</h4>
                <p className="text-sm text-muted mt-1">Ponentes de primer nivel, entrada gratuita previa inscripción.</p>
              </div>
            </Link>

            <div className="flex flex-col gap-3">
              <Link href="/detail">
                <div className="bg-white rounded-lg p-3 border border-[#eef3f6] cursor-pointer">
                  <div className="h-20 rounded-md bg-gradient-to-br from-[#ffeaf0] to-[#f9dbe2]" />
                  <h5 className="mt-2">Convocatoria: Voluntariado</h5>
                  <p className="text-sm text-muted mt-1">Participa en la organización de eventos.</p>
                </div>
              </Link>

              <Link href="/detail">
                <div className="bg-white rounded-lg p-3 border border-[#eef3f6] cursor-pointer">
                  <div className="h-20 rounded-md bg-gradient-to-br from-[#ffeaf0] to-[#f9dbe2]" />
                  <h5 className="mt-2">Aviso importante</h5>
                  <p className="text-sm text-muted mt-1">Cambio de horarios en secretaría.</p>
                </div>
              </Link>
            </div>
          </section>

          <footer className="mt-8 text-center text-sm text-muted border-t pt-4">
            © 2025 Portal Noticias — Diseño Pro++
          </footer>
        </section>

        <aside>
          <Sidebar />
        </aside>
      </div>
    </main>
  )
}
