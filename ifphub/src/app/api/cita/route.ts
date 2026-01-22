import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_cita");

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dia_cita = typeof body.dia_cita === "string" ? body.dia_cita : null;
    const hora = typeof body.hora === "string" ? body.hora : null;
    const descripcion =
      typeof body.descripcion === "string" ? body.descripcion.trim() : "";
    const id_usuario =
      body.id_usuario === null || body.id_usuario === undefined
        ? null
        : Number(body.id_usuario);

    if (!dia_cita || !hora) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    if (id_usuario !== null && !Number.isFinite(id_usuario)) {
      return NextResponse.json(
        { error: "Usuario invalido" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: occupiedRows, error: occupiedError } = await supabase
      .from("cita")
      .select("id_cita")
      .eq("dia_cita", dia_cita)
      .eq("hora", hora)
      .limit(1);

    if (occupiedError) {
      console.error(occupiedError);
      return NextResponse.json(
        { error: "Error al validar horario" },
        { status: 500 }
      );
    }

    if (occupiedRows && occupiedRows.length > 0) {
      return NextResponse.json(
        { error: "Horario ocupado" },
        { status: 409 }
      );
    }

    const { data: lastRows, error: lastError } = await supabase
      .from("cita")
      .select("id_cita")
      .order("id_cita", { ascending: false })
      .limit(1);

    if (lastError) {
      console.error(lastError);
      return NextResponse.json(
        { error: "Error al preparar cita" },
        { status: 500 }
      );
    }

    const nextId = Number(lastRows?.[0]?.id_cita ?? 0) + 1;
    const dia_creacion = new Date().toISOString();

    const { error } = await supabase.from("cita").insert({
      id_cita: nextId,
      dia_cita,
      dia_creacion,
      hora,
      descripcion: descripcion || null,
      id_usuario,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error al insertar cita" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
