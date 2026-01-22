export default function Sidebar({ uid, sig }: { uid?: string; sig?: string }) {
  // Si existen uid y sig, se añaden a las URLs
  const query = uid && sig ? `?uid=${uid}&sig=${sig}` : "";
  
  return (
    <aside className="bg-card rounded-[14px] p-6 shadow-md-custom flex flex-col gap-8 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Últimas noticias */}
      <section>
        <h3 className="text-accent uppercase tracking-widest text-sm font-libre mb-3 border-l-4 border-accent pl-3">
          Últimas noticias
        </h3>

        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <a
              key={i}
              href={`/noticias/rapida-${i}${query}`}
              className="flex gap-3 items-center p-2 rounded-md hover:bg-[#f3f6f7] cursor-pointer transition-colors"
            >
              <div className="w-14 h-14 rounded-md bg-gradient-to-b from-[var(--soft)] to-[#ffeaf0]" />
              <div className="text-sm leading-tight">
                <p className="font-semibold">Noticia rápida #{i}</p>
                <p className="text-muted text-xs mt-1">Hace 2 horas</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Info */}
      <section>
        <h3 className="text-accent uppercase tracking-widest text-sm font-libre mb-3 border-l-4 border-accent pl-3">
          Información
        </h3>

        <div className="text-sm text-muted leading-relaxed">
          Portal oficial de noticias del campus.  
          Encuentra avisos, eventos, actividades y recursos actualizados.
        </div>
      </section>

      <div className="h-[260px] rounded-lg bg-gradient-to-b from-[var(--soft)] to-[#ffdfe8] flex items-center justify-center font-extrabold text-accent">
        PUBLICIDAD
      </div>
    </aside>
  );
}