"use client";

import Image from "next/image";
import { Card } from "@/app/frontend/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/frontend/components/ui/avatar";
import { ArrowRight, CalendarDays } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  coverImage: string;
  cursoNombre?: string | null;
  cursoGrado?: string | null;
};

function getCursoSiglas(nombreCurso: string | null) {
  if (!nombreCurso) return "";

  const curso = nombreCurso.toLowerCase();

  if (curso.includes("multiplataforma")) return "DAM";
  if (curso.includes("web")) return "DAW";
  if (curso.includes("sistemas")) return "ASIX";

  return nombreCurso;
}

export function ProjectCard({
  title,
  description,
  authorName,
  authorAvatar,
  date,
  coverImage,
  cursoGrado,
  cursoNombre,
}: ProjectCardProps) {
  const cursoLabel =
    cursoNombre && cursoGrado
      ? `${cursoGrado} ${getCursoSiglas(cursoNombre)}`
      : "Proyecto";

  return (
    <Card className="border border-[#124d58] bg-[#124d58] overflow-hidden shadow-xl group h-full flex flex-col relative">
      <div className="w-full h-[220px] overflow-hidden relative">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#124d58] to-transparent opacity-60" />
        <span className="absolute top-4 right-4 rounded-md bg-[#D65A7E] px-3 py-1 text-xs font-medium text-white shadow-lg">
          {cursoLabel}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[#D65A7E] transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#D65A7E]" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 border border-white/20">
                {authorAvatar && (
                  <AvatarImage src={authorAvatar} alt={authorName} />
                )}
                <AvatarFallback className="bg-white/10 text-xs">
                  {authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-white/90">
                {authorName}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1a6b7a]">
            <span className="text-sm text-gray-300" />
            <a
              href=""
              className="flex items-center gap-1 text-[#D65A7E] text-sm font-medium group-hover:translate-x-1 transition-transform"
            >
              Ver proyecto <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
