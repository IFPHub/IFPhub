"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Pencil } from "lucide-react";

import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/frontend/components/ui/avatar";
import { Button } from "@/app/frontend/components/ui/button";
import { Input } from "@/app/frontend/components/ui/input";
import { Separator } from "@/app/frontend/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/frontend/components/ui/dialog";

type Profile = {
  name: string;
  email: string;
  avatar: string;
  course: string;
  year: string;
  notifications: boolean;
};

const initialProfile: Profile = {
  name: "",
  email: "",
  avatar: "/avatars/shadcn.jpg",
  course: "DAW",
  year: "2",
  notifications: true,
};

export default function PerfilPage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const sig = searchParams.get("sig");

  const [profile, setProfile] = React.useState<Profile>(initialProfile);
  const [savedProfile, setSavedProfile] = React.useState<Profile>(initialProfile);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = React.useState<string | null>(null);
  const [nameDraft, setNameDraft] = React.useState("");
  const [isNameDialogOpen, setIsNameDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!uid) return;
    let isActive = true;

    const storedName = sessionStorage.getItem("ifphub_user_name");
    const storedEmail = sessionStorage.getItem("ifphub_user_email");

    if (storedName || storedEmail) {
      setProfile((prev) => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
      }));
    }

    const loadUser = async () => {
      try {
        const userId = Number(uid);
        if (!Number.isFinite(userId)) return;

        const res = await fetch("/api/usuario");
        if (!res.ok) return;

        const users = await res.json();
        const match = Array.isArray(users)
          ? users.find((item) => Number(item.id_usuario) === userId)
          : null;

        if (!match) return;

        const name = [match.nombre, match.apellido].filter(Boolean).join(" ");
        const email = match.mail ?? match.email ?? "";

        if (isActive) {
          setProfile((prev) => {
            const nextProfile = {
              ...prev,
              name: name || prev.name,
              email: email || prev.email,
            };
            setSavedProfile(nextProfile);
            return nextProfile;
          });
          setNameDraft(name || "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();

    return () => {
      isActive = false;
    };
  }, [uid]);

  if (!uid || !sig) return null;

  const trimmedName = profile.name.trim();
  const trimmedDraft = nameDraft.trim();
  const hasNameChanges = Boolean(trimmedDraft) && trimmedDraft !== trimmedName;
  const hasProfileChanges =
    profile.name !== savedProfile.name ||
    profile.email !== savedProfile.email ||
    profile.notifications !== savedProfile.notifications ||
    Boolean(avatarPreview) ||
    Boolean(headerPreview);

  return (
    <SidebarProvider>
      <AppSidebar uid={uid} sig={sig} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm text-[#123d58]">Perfil</span>
          </div>
        </header>

        <main className="h-[calc(100vh-5rem)] p-4 md:p-6 overflow-auto">
          <div className="w-full max-w-none">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-semibold font-['Libre_Baskerville'] text-[#123d58]">
                Bienvenido, {profile.name || "usuario"}
              </h1>
              <p className="mt-1 text-sm text-[#123d58]/60">
                Administra tu perfil y preferencias.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#dbe2e8] bg-white shadow-sm">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group relative h-24 w-full"
                    aria-label="Cambiar imagen de cabecera"
                  >
                    <div
                      className={`h-24 w-full ${
                        headerPreview
                          ? ""
                          : "bg-gradient-to-r from-[#dbe9f4] via-[#f0f4f6] to-[#f7ead7]"
                      }`}
                      style={
                        headerPreview
                          ? {
                              backgroundImage: `url(${headerPreview})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : undefined
                      }
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-5 w-5" />
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[#123d58]">
                      Cambiar imagen de cabecera
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setHeaderPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-[#123d58]/60">
                      PNG o JPG, tamaño recomendado 1200x300.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="px-4 pb-6 pt-4 md:px-8 md:pb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="group relative">
                          <Avatar className="h-16 w-16 rounded-2xl ring-4 ring-white">
                            <AvatarImage src={avatarPreview ?? profile.avatar} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#123d58]/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <Camera className="h-5 w-5" />
                          </span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-[#123d58]">
                            Cambiar foto de perfil
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                setAvatarPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-[#123d58]/60">
                            PNG o JPG, tamaño recomendado 300x300.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#123d58]">
                          {profile.name || "Nombre de usuario"}
                        </h2>
                        <Dialog
                          open={isNameDialogOpen}
                          onOpenChange={(open) => {
                            setIsNameDialogOpen(open);
                            if (open) {
                              setNameDraft(profile.name);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full p-1 text-[#123d58]/70 hover:text-[#123d58]"
                              aria-label="Editar nombre de usuario"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-[#123d58]">
                                Editar nombre de usuario
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <Input
                                value={nameDraft}
                                onChange={(event) =>
                                  setNameDraft(event.target.value)
                                }
                                placeholder="Nombre y apellidos"
                              />
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  className="bg-[#123d58] text-white hover:bg-[#0f344b]"
                                  onClick={() => {
                                    setProfile((prev) => ({
                                      ...prev,
                                      name: trimmedDraft,
                                    }));
                                    setIsNameDialogOpen(false);
                                  }}
                                  disabled={!hasNameChanges}
                                >
                                  Guardar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-sm text-[#123d58]/70">
                        {profile.email || "correo@dominio.es"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-[#123d58]">
                      Correo
                    </label>
                    <Input
                      value={profile.email}
                      placeholder="correo@dominio.es"
                      readOnly
                      className="mt-1 h-10 border-[#dbe2e8] bg-[#f8fafc] text-[#123d58]/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#123d58]">
                      Curso
                    </label>
                    <Input
                      value={profile.course}
                      readOnly
                      className="mt-1 h-10 border-[#dbe2e8] bg-[#f8fafc] text-[#123d58]/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#123d58]">
                      Año
                    </label>
                    <Input
                      value={profile.year}
                      readOnly
                      className="mt-1 h-10 border-[#dbe2e8] bg-[#f8fafc] text-[#123d58]/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#123d58]">
                      Permitir notificaciones
                    </label>
                    <select
                      value={profile.notifications ? "si" : "no"}
                      onChange={(event) =>
                        setProfile((prev) => ({
                          ...prev,
                          notifications: event.target.value === "si",
                        }))
                      }
                      className="mt-1 h-10 w-full rounded-md border border-[#dbe2e8] bg-white px-3 text-sm text-[#123d58] focus:outline-none focus:ring-2 focus:ring-[#123d58]/20"
                    >
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <Button
                    className="bg-[#123d58] text-white hover:bg-[#0f344b]"
                    disabled={!hasProfileChanges}
                    onClick={() => {
                      setSavedProfile(profile);
                      setAvatarPreview(null);
                      setHeaderPreview(null);
                    }}
                  >
                    Guardar cambios
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Cerrar sesión
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-[#123d58]">
                          Confirmar cierre de sesión
                        </DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-[#123d58]/70">
                        ¿Seguro que quieres cerrar sesión?
                      </p>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 px-4 border-[#dbe2e8]"
                        >
                          Cancelar
                        </Button>
                        <a
                          href="/"
                          className="inline-flex h-10 items-center rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Cerrar sesión
                        </a>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
