"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type CardItem = {
  id: number;
  title: string;
  description: string;
  author: string;
  tag: string;
  date?: string; // YYYY-MM-DD
  course?: string;
  professor?: string;
  videoUrl?: string;
  coverUrl?: string;
};

type Curso = {
  id_curso: number;
  nombre: string;
  grado: number | null;
  horario: {
    horario: string;
  } | null;
};


const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const bodyFont = { fontFamily: '"Montserrat", system-ui, sans-serif' };
const titleFont = { fontFamily: '"Libre Baskerville", serif' };

function MiniCalendar({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [year, setYear] = useState(value?.getFullYear() ?? today.getFullYear());

  useEffect(() => {
    if (value) {
      setMonth(value.getMonth());
      setYear(value.getFullYear());
    }
  }, [value]);

  const firstDay = new Date(year, month, 1);
  const start = (firstDay.getDay() + 6) % 7; // lunes=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: { day: number; inMonth: boolean; date: Date }[] = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - start + 1;
    let d: Date;
    let inMonth = true;

    if (dayNum < 1) {
      inMonth = false;
      d = new Date(year, month - 1, prevDays + dayNum);
      cells.push({ day: d.getDate(), inMonth, date: d });
    } else if (dayNum > daysInMonth) {
      inMonth = false;
      d = new Date(year, month + 1, dayNum - daysInMonth);
      cells.push({ day: d.getDate(), inMonth, date: d });
    } else {
      d = new Date(year, month, dayNum);
      cells.push({ day: dayNum, inMonth, date: d });
    }
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="w-[260px] rounded-lg border border-black/10 bg-[#D46D85] p-3 text-sm shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => {
            const m = month - 1;
            if (m < 0) {
              setMonth(11);
              setYear(year - 1);
            } else setMonth(m);
          }}
          className="px-2 text-lg leading-none opacity-70 hover:opacity-100"
        >
          ‹
        </button>

        <div className="flex items-center gap-2 font-medium">
          <span className="rounded-md border border-black/10 px-2 py-0.5">
            {MONTHS[month]}
          </span>
          <span className="rounded-md border border-black/10 px-2 py-0.5">
            {year}
          </span>
        </div>

        <button
          onClick={() => {
            const m = month + 1;
            if (m > 11) {
              setMonth(0);
              setYear(year + 1);
            } else setMonth(m);
          }}
          className="px-2 text-lg leading-none opacity-70 hover:opacity-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs opacity-70">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 text-center">
        {cells.map((c, i) => {
          const selected = value && isSameDay(value, c.date);
          return (
            <button
              key={i}
              onClick={() => onChange(c.date)}
              className={[
                "h-8 rounded-md",
                c.inMonth ? "opacity-100" : "opacity-40",
                selected
                  ? "border border-black/30 font-semibold"
                  : "hover:bg-black/[.04]",
              ].join(" ")}
            >
              {c.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function capitalize(str?: any) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* -------------------- MODAL CREAR -------------------- */
function CreateModal({
  onClose,
  title,
  setTitle,
  desc,
  setDesc,
  cats,
  toggleCat,
  videoUrl,
  setVideoUrl,
  coverUrl,
  setCoverUrl,
  coverFile,
  setCoverFile,
  videoFile,
  setVideoFile,
  onSave,
  newCourse,
  setNewCourse,
  tags,
  courses,
  newTag,
  setNewTag,
  addNewTag
}: {
  onClose: () => void;
  title: string;
  setTitle: (v: string) => void;
  desc: string;
  setDesc: (v: string) => void;
  cats: string[];
  toggleCat: (c: string) => void;
  videoUrl: string;
  setVideoUrl: (v: string) => void;
  coverUrl: string;
  setCoverUrl: (v: string) => void;
  coverFile: File | null;
  setCoverFile: (f: File | null) => void;
  videoFile: File | null;
  setVideoFile: (f: File | null) => void;
  onSave: () => void;
  newCourse: Curso | null;
  setNewCourse: (v: Curso | null) => void;
  courses: Curso[];
  tags: string[];
  newTag: string;
  setNewTag: (v: string) => void;
  addNewTag: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) onClose();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  const randomCourses = useMemo(() => {
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    return {
      visible: shuffled.slice(0, 3),
      rest: shuffled.slice(3),
    };
  }, [courses]);

  const courseLabel = newCourse
  ? [
      newCourse.nombre,
      newCourse.grado ? `${newCourse.grado}º` : null,
      capitalize(newCourse.horario),
    ]
      .filter(Boolean)
      .join(" · ")
  : "Curso";
  const [showAllCourses, setShowAllCourses] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/30 p-4 sm:p-8">
      <div
        ref={panelRef}
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-xl bg-[#F5F5F5] p-6 shadow-xl"
        style={bodyFont}
      >
        {/* PARTE ARRIBA */}
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-semibold text-[#D46D85]"
            style={titleFont}
          >
            Crear contenido
          </h2>
          <button
            onClick={onClose}
            className="text-xl opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid gap-8 md:grid-cols-[1.4fr_1.1fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="flex flex-col gap-6">
            {/* TÍTULO */}
            <div>
              <h3
                className="mb-2 text-lg font-semibold text-[#D46D85]"
                style={titleFont}
              >
                Título
              </h3>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 w-full rounded-md border border-black/20 bg-[#124D58] px-4 text-sm text-white placeholder:text-zinc-200"
                placeholder="Introduce un título..."
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <h3
                className="mb-2 text-lg font-semibold text-[#D46D85]"
                style={titleFont}
              >
                Descripción
              </h3>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="min-h-[120px] w-full rounded-md border border-black/20 bg-[#124D58] p-4 text-sm text-white placeholder:text-zinc-200"
                placeholder="Describe el contenido..."
              />
            </div>

            {/* CURSO + TAGS + PORTADA */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* CURSO + TAGS */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold text-[#D46D85]"
                  style={titleFont}
                >
                  Categorías
                </h3>

                {/* CURSO */}
                <p className="mb-2 text-sm font-medium text-[#004B57]">
                  Curso
                </p>
                <div className="flex flex-wrap gap-2">
                  {randomCourses.visible.map((c) => {
                    const active = newCourse?.id_curso === c.id_curso;
                    
                    return (
                      <button
                        key={c.id_curso}
                        type="button"
                        onClick={() => setNewCourse(c)}
                        className={`flex items-center justify-between gap-2 rounded-full border px-3 py-1 text-xs ${
                          active
                            ? "border-[#124D58] bg-[#124D58] text-white"
                            : "border-[#124D58] text-[#124D58]"
                        }`}
                      >
                        <span className="max-w-[160px] truncate">
                          {c.nombre}
                          
                        </span>
                        <span className="text-[10px] opacity-70">{capitalize(c.horario)}</span>
                        <span className="text-[10px] opacity-70">{c.grado + 'º'}</span>
                      </button>
                    );
                  })}
                  
                  {/* CUARTO BOTÓN */}
                  {randomCourses.rest.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllCourses((v) => !v)}
                      className="flex overflow-hidden items-center gap-2 rounded-full border border-dashed px-3 py-1 text-xs text-[#124D58] hover:bg-[#124D58]/5"
                    >
                      {newCourse ? (
                        <>
                          <span className="truncate max-w-[120px]">
                            {newCourse.nombre}
                          </span>
                          <span className="text-[10px] opacity-60">{newCourse?.horario?.horario}</span>
                        </>
                      ) : (
                        "Ver más"
                      )}
                    </button>
                  )}
                </div>

                {showAllCourses && (
                  <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-black/10 bg-white shadow-sm">
                    {randomCourses.rest.map((c) => (
                      <button
                        key={c.id_curso}
                        type="button"
                        onClick={() => {
                          setNewCourse(c);
                          setShowAllCourses(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-black/[.04]"
                      >
                        <span>{c.nombre + ' · ' + capitalize(c.horario) + ' · ' + c.grado + 'º'}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* TAGS */}
                <p className="mt-4 mb-2 text-sm font-medium text-[#004B57]">
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((c) => {
                    const active = cats.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCat(c)}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          active
                            ? "border-black/40 bg-[#D46D85] text-white"
                            : "border-[#D46D85]/60 bg-transparent text-[#D46D85]"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();

                        const value = newTag.trim();
                        if (!value) return;

                        if (!tags.includes(value)) {
                          addNewTag();
                        }

                        toggleCat(value); // ✅ se añade a cats del modal
                        setNewTag("");
                      }
                    }}
                    placeholder="+"
                    className="h-8 w-20 rounded-md border border-dashed border-black/30 bg-transparent px-2 text-sm text-[#D46D85]"
                  />
                </div>
              </div>

              {/* PORTADA */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold text-[#D46D85]"
                  style={titleFont}
                >
                  Portada
                </h3>

                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="mb-2 h-10 w-full rounded-md border border-black/20 bg-white px-3 text-xs text-zinc-800 placeholder:text-zinc-400"
                  placeholder="https://tuservidor.com/portada.png"
                />

                <label className="mt-1 flex flex-col gap-1 text-xs text-zinc-700">
                  Subir imagen de portada
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  />
                  {coverFile && (
                    <span className="text-[11px] opacity-80">
                      Archivo seleccionado: {coverFile.name}
                    </span>
                  )}
                </label>

                <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-md border border-black/15 bg-zinc-100">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="Portada"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs opacity-60">
                      Sin portada
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* VIDEO */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="mb-2 block text-sm font-medium text-[#D46D85]">
                  Vídeo (URL)
                </span>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="h-10 w-full rounded-md border border-black/20 bg-white px-3 text-xs text-zinc-800 placeholder:text-zinc-400"
                  placeholder="https://tuservidor.com/video.mp4"
                />
              </div>

              <div>
                <span className="mb-1 block text-sm font-medium text-[#D46D85]">
                  Subir archivo de vídeo
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="text-xs"
                  onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                />
                {videoFile && (
                  <span className="mt-1 block text-[11px] text-zinc-700 opacity-80">
                    Archivo seleccionado: {videoFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PREVIEW */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-sm">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-black/15 bg-zinc-100">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Portada preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs opacity-60">
                    Sin portada
                  </div>
                )}
              </div>

              <h3
                className="mt-3 text-lg font-semibold text-[#004B57]"
                style={titleFont}
              >
                {title || "Ejemplo"}
              </h3>
              <p className="mt-1 text-sm text-zinc-800">
                {desc ||
                  "Descripción de ejemplo del contenido que se mostrará en esta clase."}
              </p>

              <p className="mt-2 text-[11px] text-zinc-600">
                {courseLabel}
              </p>

              <div className="mt-3 flex items-center gap-3 text-sm text-[#D46D85]">
                <button
                  type="button"
                  title="Descargar"
                  className="hover:opacity-80"
                >
                  ↓
                </button>
                <button
                  type="button"
                  title="Favorito"
                  className="hover:opacity-80"
                >
                  ☆
                </button>
                <button
                  type="button"
                  title="Ver código"
                  className="hover:opacity-80"
                >
                  {"</>"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES ABAJO */}
        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-9 rounded-md border border-black/20 bg-white px-5 text-sm text-[#D46D85] hover:bg-black/[.04]"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="h-9 rounded-md border border-black/20 bg-[#D46D85] px-6 text-sm font-medium text-white hover:bg-[#c55c77]"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- MODAL VIDEO -------------------- */
function VideoModal({
  item,
  onClose,
}: {
  item: CardItem;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const hasVideo = !!item.videoUrl;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4">
      <div
        ref={panelRef}
        className="mx-auto flex max-h-[90vh] w-full max-w-5xl flex-col gap-6 overflow-y-auto rounded-xl bg-[#F5F5F5] p-6 shadow-xl"
        style={bodyFont}
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold" style={titleFont}>
              {item.title}
            </h2>
            <p className="text-xs text-zinc-500">
              {item.professor ?? item.author} · {item.course ?? "Sin curso"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>

        {hasVideo ? (
          <video
            src={item.videoUrl}
            controls
            autoPlay
            className="mt-4 w-full rounded-md bg-black"
          />
        ) : (
          <div className="mt-4 rounded-md border border-dashed border-black/20 p-6 text-sm text-zinc-600">
            <p>Esta clase todavía no tiene ningún vídeo asociado.</p>
            <p className="mt-2 text-xs opacity-80">
              Cuando se suba un vídeo o se rellene este campo en la base de
              datos, podrás reproducirlo aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- CARD -------------------- */
function Card({ it, onOpen }: { it: CardItem; onOpen: (it: CardItem) => void }) {
  return (
    <article
      onClick={() => onOpen(it)}
      className="group flex cursor-pointer flex-col gap-2"
      style={bodyFont}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-black/10 bg-white">
        {it.coverUrl ? (
          <img
            src={it.coverUrl}
            alt={it.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs opacity-60">
            Sin portada
          </div>
        )}

        {it.videoUrl && (
          <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
            Reproducir vídeo
          </div>
        )}
      </div>

      <h3
        className="mt-2 text-[22px] leading-6 text-[#004B57]"
        style={titleFont}
      >
        {it.title}
      </h3>

      <p className="text-sm leading-5 text-zinc-700">
        {it.description}
      </p>

      <div className="mt-1 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-3">
          <span title="descargar">↓</span>
          <span title="favorito">☆</span>
          <span title="guardado">🔖</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-full border border-black/10"/>
          <span>{it.author}</span>
        </div>
      </div>
    </article>
  );
}

/* -------------------- ELEGIR PROFESOR -------------------- */
function ProfessorPopover({
  professors,
  onPick,
  onClear,
}: {
  professors: string[];
  onPick: (p: string) => void;
  onClear: () => void;
}) {
  const [q, setQ] = useState("");
  const list = professors.filter((p) =>
    p.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div
      className="absolute left-0 top-11 z-50 w-56 rounded-lg border border-black/10 bg-white p-2 text-sm shadow-lg"
      style={bodyFont}
    >
      <div className="relative mb-2">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs opacity-60">
          🔍
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="h-8 w-full rounded-md border border-black/10 bg-white pl-6 pr-2 text-xs"
        />
      </div>

      <div className="max-h-44 overflow-auto">
        {list.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-black/[.04]"
          >
            <span className="h-5 w-5 rounded-full border border-black/10" />
            {p}
          </button>
        ))}
        {!list.length && (
          <div className="px-2 py-2 text-xs opacity-60">No hay resultados</div>
        )}
      </div>

      <button
        onClick={onClear}
        className="mt-2 w-full rounded-md px-2 py-2 text-left text-xs opacity-60 hover:bg-black/[.04]"
      >
        Quitar filtro
      </button>
    </div>
  );
}

export function Board() {
  const [courses, setCourses] = useState<any[]>([]);
  const [items, setItems] = useState<CardItem[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );

  const [openFilter, setOpenFilter] =
    useState<"fecha" | "curso" | "profesor" | null>(null);

  const fechaRef = useRef<HTMLDivElement>(null);
  const cursoRef = useRef<HTMLDivElement>(null);
  const profesorRef = useRef<HTMLDivElement>(null);

  // BOTÓN CREAR
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCats, setNewCats] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newCoverUrl, setNewCoverUrl] = useState("");
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newCourse, setNewCourse] = useState<Curso | null>(null);

  // MODAL VIDEO
  const [activeVideoItem, setActiveVideoItem] = useState<CardItem | null>(null);
  
  useEffect(() => {
    if (isCreateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCreateOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/cursos");
        if (!res.ok) throw new Error("Error al cargar datos");

        const data = await res.json();

        // 👇 si la api devuelve SOLO cursos
        if (Array.isArray(data)) {
          setCourses(data);
          return;
        }

        // 👇 si luego decides devolver más cosas
        if (data.cursos) {
          setCourses(data.cursos);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  // CARGAR REUNIONES DESDE /api/reuniones
  useEffect(() => {
    async function fetchReuniones() {
      try {
        const res = await fetch("/api/reuniones");
        if (!res.ok) throw new Error("Error al obtener reuniones");

        const data = await res.json();

        type ReunionFromDB = {
          id_reuniones: number;
          titulo: string | null;
          descripcion: string | null;
          tag: string | null;
          profesor: string | null;
          date: string | null;
          video: string | null;
          id_usuario: number | null;
          id_curso: number | null;
          // si luego en el RPC devuelves nombre de curso, lo añades aquí
          // curso_nombre?: string | null;
        };

        const mapped: CardItem[] = (data as ReunionFromDB[]).map((r) => ({
          id: r.id_reuniones,
          title: r.titulo ?? "Sin título",
          description: r.descripcion ?? "Sin descripción",
          author: r.profesor ?? "Profesor",
          tag: r.tag ?? "",
          date: r.date ?? undefined,
          // course: r.curso_nombre ?? undefined,
          course: undefined,
          professor: r.profesor ?? undefined,
          videoUrl: r.video ?? undefined,
          coverUrl: undefined,
        }));

        setItems(mapped);
      } catch (err) {
        console.error(err);
      }
    }

    fetchReuniones();
  }, []);

    // TAGS DINÁMICOS (a partir de lo que viene de la BD)
    const TAGS = useMemo(() => {
      const set = new Set<string>();
      items.forEach((it) => {
        if (it.tag && it.tag.trim()) set.add(it.tag.trim());
      });
      return Array.from(set).sort();
    }, [items]);

    const ALL_TAGS = useMemo(() => {
      const set = new Set([...TAGS, ...customTags]);
      return Array.from(set).sort();
    }, [TAGS, customTags]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      const map = {
        fecha: fechaRef,
        curso: cursoRef,
        profesor: profesorRef,
      } as const;
      if (!openFilter) return;
      const ref = map[openFilter].current;
      if (ref && !ref.contains(target)) setOpenFilter(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openFilter]);

  const PROFESSORS = useMemo(() => {
    const setP = new Set(items.map((i) => i.professor ?? i.author));
    return Array.from(setP);
  }, [items]);

  const toggleCat = (c: string) => {
    setNewCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const addNewTag = () => {
    const value = newTag.trim();
    if (!value) return;

    if (!customTags.includes(value) && !TAGS.includes(value)) {
      setCustomTags((prev) => [...prev, value]);
    }

    setNewCats((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );

    setNewTag("");
  };

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const q = query.toLowerCase();
      const matchesQuery =
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q);

      const matchesTag = activeTag
        ? it.tag === activeTag || !TAGS.includes(activeTag)
        : true;
      const matchesCourse = selectedCourse ? it.course === selectedCourse : true;
      const matchesProfessor = selectedProfessor
        ? (it.professor ?? it.author) === selectedProfessor
        : true;
      const matchesDate = selectedDate
        ? it.date === selectedDate.toISOString().slice(0, 10)
        : true;

      return (
        matchesQuery &&
        matchesTag &&
        matchesCourse &&
        matchesProfessor &&
        matchesDate
      );
    });
  }, [items, query, activeTag, selectedCourse, selectedProfessor, selectedDate]);

  const saveNewItem = async () => {
    if (!newTitle.trim()) return;

    const payload = {
      titulo: newTitle.trim(),
      descripcion: newDesc.trim() || null,
      tag: newCats[0] ?? null,
      profesor: "Jorge Aguirre",
      date: selectedDate
        ? selectedDate.toISOString().slice(0, 10)
        : null,
      video: newVideoUrl.trim() || null,
      id_usuario: 1, // ✅ fijo por ahora
      id_curso: newCourse?.id_curso ?? null,
    };

    try {
      const res = await fetch("/api/reuniones/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error al insertar reunión");
      }

      // 🔄 RECARGAR REUNIONES (simple y limpio)
      const reload = await fetch("/api/reuniones");
      const data = await reload.json();

      const mapped = data.map((r: any) => ({
        id: r.id_reuniones,
        title: r.titulo ?? "Sin título",
        description: r.descripcion ?? "Sin descripción",
        author: r.profesor ?? "Profesor",
        tag: r.tag ?? "",
        date: r.date ?? undefined,
        course: undefined,
        professor: r.profesor ?? undefined,
        videoUrl: r.video ?? undefined,
        coverUrl: undefined,
      }));

      setItems(mapped);

      // ✅ CERRAR MODAL Y LIMPIAR
      setCreateOpen(false);
      setNewTitle("");
      setNewDesc("");
      setNewCats([]);
      setNewVideoUrl("");
      setNewCoverUrl("");
      setNewCoverFile(null);
      setNewVideoFile(null);
      setNewCourse(null);

    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la reunión");
    }
  };

  const openCard = (it: CardItem) => {
    setActiveVideoItem(it);
  };

  const openCreateModal = () => {
    setNewCourse(null);
    setCreateOpen(true);
  };

  return (
    
    <div className="w-full px-4 sm:px-6 lg:px-10" style={bodyFont}>
      <div className="mx-auto w-full max-w-6xl">
        {/* BOTONES ARRIBA */}
        <div className="flex w-full flex-wrap items-center gap-3">
          {/* FECHA */}
          <div ref={fechaRef} className="relative">
            <button
              onClick={() =>
                setOpenFilter(openFilter === "fecha" ? null : "fecha")
              }
              className="flex h-9 w-36 items-center justify-between rounded-md border border-black/10 bg-[#D46D85] px-3 text-sm text-zinc-800"
            >
              <span className="text-white">
                {selectedDate ? selectedDate.toLocaleDateString() : "Fecha"}
              </span>
              <span className="text-xs opacity-60">▾</span>
            </button>

            {openFilter === "fecha" && (
              <div className="absolute left-0 top-11 z-50">
                <MiniCalendar
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    setOpenFilter(null);
                  }}
                />
              </div>
            )}
          </div>

          {/* CURSO */}
          <div ref={cursoRef} className="relative">
            <button
              onClick={() =>
                setOpenFilter(openFilter === "curso" ? null : "curso")
              }
              className="flex h-9 w-36 items-center justify-between rounded-md border border-black/10 bg-[#D46D85] px-3 text-sm text-zinc-800"
            >
              <span className="text-white">{selectedCourse ?? "Curso"}</span>
              <span className="text-xs opacity-60">▾</span>
            </button>

            {openFilter === "curso" && (
              <div className="absolute left-0 top-11 z-50 w-56 rounded-lg border border-black/10 bg-white p-1 text-sm shadow-lg">
                {courses.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCourse(c);
                      setOpenFilter(null);
                    }}
                    className="w-full rounded-md px-3 py-2 text-left hover:bg-black/[.04]"
                  >
                    {c}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setOpenFilter(null);
                  }}
                  className="w-full rounded-md px-3 py-2 text-left opacity-60 hover:bg-black/[.04]"
                >
                  Quitar filtro
                </button>
              </div>
            )}
          </div>

          {/* PROFESOR */}
          <div ref={profesorRef} className="relative">
            <button
              onClick={() =>
                setOpenFilter(openFilter === "profesor" ? null : "profesor")
              }
              className="flex h-9 w-36 items-center justify-between rounded-md border border-black/10 bg-[#D46D85] px-3 text-sm text-zinc-800"
            >
              <span className="text-white">
                {selectedProfessor ?? "Profesor"}
              </span>
              <span className="text-xs opacity-60">▾</span>
            </button>

            {openFilter === "profesor" && (
              <ProfessorPopover
                professors={PROFESSORS}
                onPick={(p) => {
                  setSelectedProfessor(p);
                  setOpenFilter(null);
                }}
                onClear={() => {
                  setSelectedProfessor(null);
                  setOpenFilter(null);
                }}
              />
            )}
          </div>

          {/* CREAR */}
          <button
            onClick={openCreateModal}
            className="h-9 rounded-md border border-black/10 bg-[#D46D85] px-4 text-sm text-white hover:bg-black/[.04]"
          >
            + Crear
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="mt-4 flex w-full items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscador"
              className="h-10 w-full rounded-md border border-black/10 bg-[#124D58] pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-200"
            />
          </div>

          <button className="h-10 w-32 shrink-0 rounded-md border border-black/10 bg-[#124D58] text-sm text-zinc-100 hover:bg-black/[.04]">
            Ordenar por &nbsp;›
          </button>
        </div>

        {/* TAGS FILTRO */}
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(active ? null : tag)}
                className={`h-8 rounded-md border px-3 text-sm text-white bg-[#D46D85] ${
                  active
                    ? "border-black/30"
                    : "border-black/10"
                } hover:bg-black/[.04]`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* GRID DE CARDS */}
        <section className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((it) => (
            <Card key={it.id} it={it} onOpen={openCard} />
          ))}
        </section>
      </div>

      {/* MODAL CREAR */}
      {isCreateOpen && (
        <CreateModal
          onClose={() => setCreateOpen(false)}
          title={newTitle}
          setTitle={setNewTitle}
          desc={newDesc}
          setDesc={setNewDesc}
          cats={newCats}
          toggleCat={toggleCat}
          videoUrl={newVideoUrl}
          setVideoUrl={setNewVideoUrl}
          coverUrl={newCoverUrl}
          setCoverUrl={setNewCoverUrl}
          coverFile={newCoverFile}
          setCoverFile={setNewCoverFile}
          videoFile={newVideoFile}
          setVideoFile={setNewVideoFile}
          onSave={saveNewItem}
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          tags={ALL_TAGS}
          courses={courses}
          newTag={newTag}
          setNewTag={setNewTag}
          addNewTag={addNewTag}
        />
      )}

      {/* MODAL VIDEO */}
      {activeVideoItem && (
        <VideoModal
          item={activeVideoItem}
          onClose={() => setActiveVideoItem(null)}
        />
      )}
    </div>
  );
}
