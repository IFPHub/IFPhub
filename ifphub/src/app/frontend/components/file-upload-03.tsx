// file-upload-03.tsx
"use client";

// ✅ CHANGE: renombramos el icono a FileIcon para evitar conflicto con el tipo global File.
import { File as FileIcon, Trash } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

// ✅ CHANGE: usar el Textarea correcto de shadcn por alias absoluto (evita rutas raras como "./ui/textarea")
import { Textarea } from "@/app/frontend/components/ui/textarea";

import { Button } from "@/app/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/frontend/components/ui/card";
import { Input } from "@/app/frontend/components/ui/input";
import { Label } from "@/app/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/frontend/components/ui/select";
import { Separator } from "@/app/frontend/components/ui/separator";
import { cn } from "@/lib/utils";

// Si Dialog01 es tu confirmación (p.ej. “subida ok”), lo dejamos.
import Dialog01 from "@/app/frontend/components/dialog-01";

// ✅ CHANGE: props opcionales para que el componente pueda cerrar el modal/avisar al padre sin acoplarse.
type FileUpload03Props = {
  onCancel?: () => void;
  onUploaded?: () => void;
};



const MAX_FILE_SIZE = 50 * 1024 * 1024; // ✅ CHANGE: límite real 50MB

function formatBytes(bytes: number) {
  // ✅ CHANGE: helper para mostrar tamaño humano
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export default function FileUpload03({
  onCancel,
  onUploaded,
}: FileUpload03Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // ✅ CHANGE: acepta múltiples archivos
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      setError(null);
      setFiles(acceptedFiles);
    },
    onDropRejected: (rejections) => {
      // ✅ CHANGE: feedback si exceden tamaño u otras restricciones
      const first = rejections[0];
      if (!first) return;
      const reason = first.errors?.[0]?.code;
      if (reason === "file-too-large") {
        setError("Un archivo supera el tamaño máximo de 50MB.");
      } else {
        setError(
          "No se pudo cargar uno o más archivos. Revisa el formato/tamaño."
        );
      }
    },
  });


  const handleBackToDashboard = () => {
    setFiles([]);
    setError(null);
    onCancel?.(); // cierra el modal grande
  };

  const removeFile = (name: string) => {
    // ✅ CHANGE: función separada para legibilidad
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const filesList = files.map((file) => (
    <li key={file.name} className="relative">
      {/* ✅ CHANGE: quitado h-80 (rompía el layout) */}
      <Card className="relative p-4">
        <div className="absolute right-3 top-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() => removeFile(file.name)}
          >
            <Trash className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        <CardContent className="flex items-center gap-3 p-0 pr-10">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileIcon className="h-5 w-5 text-foreground" aria-hidden />
          </span>

          {/* ✅ CHANGE: truncate para nombres largos */}
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{file.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return (
    // ✅ CHANGE: ya NO centramos en pantalla (el modal ya se encarga). Usamos todo el ancho.
    <Card className="w-full max-w-none">
      <CardHeader>
        <CardTitle>Sube un proyecto</CardTitle>
        <CardDescription>
          Arrastra o carga un archivo para añadirlo a proyectos
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ CHANGE: quitado action/method (no estás posteando a servidor desde HTML) */}
        <form className="space-y-6">
          {/* ✅ CHANGE: 2 columnas en desktop para aprovechar el modal grande */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Izquierda: datos */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="project-name" className="font-medium">
                  Nombre del proyecto
                </Label>
                <Input
                  id="project-name"
                  name="project-name"
                  placeholder="Nombre del proyecto"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visibility" className="font-medium">
                    Visibilidad
                  </Label>
                  {/* ✅ CHANGE: defaultValue consistente con valores (private/public) */}
                  <Select defaultValue="private">
                    <SelectTrigger
                      id="visibility"
                      name="visibility"
                      className="mt-2 w-full"
                    >
                      <SelectValue placeholder="Selecciona visibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privado</SelectItem>
                      <SelectItem value="public">Público</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Solo tú puedes ver los privados.
                  </p>
                </div>

                <div>
                  <Label htmlFor="category" className="font-medium">
                    Categoría
                  </Label>

                  {/* ✅ CHANGE: defaultValue en minúsculas para que coincida con los value */}
                  <Select defaultValue="daw">
                    <SelectTrigger
                      id="category"
                      name="category"
                      className="mt-2 w-full"
                    >
                      <SelectValue placeholder="Escoge una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daw">DAW</SelectItem>
                      <SelectItem value="dam">DAM</SelectItem>
                      <SelectItem value="smx">SMX</SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Escoge una categoría.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-medium">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  className="mt-2 min-h-[130px]"
                  placeholder="Añade una descripción a tu proyecto..."
                />
              </div>
            </div>

            {/* Derecha: archivos */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="file-upload-2" className="font-medium">
                  Cargar Archivo(s)
                </Label>

                <div
                  {...getRootProps()}
                  className={cn(
                    isDragActive
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-border",
                    // ✅ CHANGE: min-h para que el dropzone aproveche el espacio del modal
                    "mt-2 flex items-center justify-center rounded-md border border-dashed px-6 min-h-[320px] transition-colors duration-200"
                  )}
                >
                  <div className="text-center">
                    <FileIcon
                      className="mx-auto h-12 w-12 text-muted-foreground/80"
                      aria-hidden
                    />
                    <div className="mt-4 flex flex-wrap justify-center text-muted-foreground">
                      <p>Arrastra o</p>

                      {/* ✅ CHANGE: htmlFor coincide con el id real */}
                      <label
                        htmlFor="file-upload-2"
                        className="relative cursor-pointer rounded-sm px-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
                      >
                        <span>escoge archivo(s)</span>

                        {/* ✅ CHANGE: mantenemos id compartido para accesibilidad */}
                        <input
                          {...getInputProps({
                            id: "file-upload-2",
                            name: "file-upload-2",
                          })}
                          type="file"
                          className="sr-only"
                        />
                      </label>

                      <p>para cargarlo(s)</p>
                    </div>

                    {/* ✅ CHANGE: feedback de error */}
                    {error && (
                      <p className="mt-3 text-sm text-destructive">{error}</p>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between gap-4">
                  <span>Puedes cargar todo tipo de archivos</span>
                  <span>Tamaño max. del archivo: 50MB</span>
                </div>
              </div>

              {filesList.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground">
                    Archivo(s) a subir
                  </h4>
                  {/* ✅ CHANGE: lista con scroll si hay muchos archivos */}
                  <ul
                    role="list"
                    className="mt-3 space-y-4 max-h-[260px] overflow-y-auto pr-1"
                  >
                    {filesList}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              // ✅ CHANGE: cancelar limpia + cierra (si el padre lo pasa)
              onClick={() => {
                setFiles([]);
                setError(null);
                onCancel?.();
              }}
            >
              Cancelar
            </Button>

            {/* ✅ CHANGE: mantenemos tu Dialog01, pero al “confirmar subida” puedes cerrar el modal */}
            <Dialog01
              trigger={<Button type="button">Subir</Button>}
              onBackToDashboard={handleBackToDashboard}
              to="#" // cambia esto si tu ruta es otra
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
