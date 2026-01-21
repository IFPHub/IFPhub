"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/app/frontend/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/frontend/components/ui/avatar";
import { CalendarDays } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  authorName: string;
  authorAvatar?: string;
  date: string;
  coverImage: string;
};

export function ProjectCard({
  title,
  description,
  authorName,
  authorAvatar,
  date,
  coverImage,
}: ProjectCardProps) {
  return (
    <Card className="max-w-sm overflow-hidden rounded-3xl border-0 bg-[#00525b] text-white shadow-xl p-0">
      <div className="relative h-40 w-full">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <CardContent className="pt-4 pb-3 px-5">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm leading-snug text-white/90">
          {description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-5 pb-4 pt-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border border-white/20">
            {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
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

        <div className="flex items-center gap-1 text-xs text-white/80">
          <CalendarDays className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </CardFooter>
    </Card>
  );
}