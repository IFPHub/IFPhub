import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_incidencias");

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tipo_incidencia =
      typeof body.tipo_incidencia === "string" ? body.tipo_incidencia : null;
    const explicacion =
      typeof body.explicacion === "string" ? body.explicacion.trim() : "";
    const prioridad =
      body.prioridad === null || body.prioridad === undefined
        ? null
        : Number(body.prioridad);
    const id_aula = Number(body.id_aula);

    if (!tipo_incidencia || !explicacion || !Number.isFinite(id_aula)) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    if (prioridad !== null && !Number.isFinite(prioridad)) {
      return NextResponse.json(
        { error: "Prioridad invalida" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error: aulaError } = await supabase.from("aula").upsert(
      {
        id_aula,
        nombre: `Aula ${id_aula}`,
      },
      { onConflict: "id_aula" }
    );

    if (aulaError) {
      console.error(aulaError);
      return NextResponse.json(
        { error: "Error al preparar aula" },
        { status: 500 }
      );
    }

    const { data: lastRows, error: lastError } = await supabase
      .from("incidencias")
      .select("id_incidencia")
      .order("id_incidencia", { ascending: false })
      .limit(1);

    if (lastError) {
      console.error(lastError);
      return NextResponse.json(
        { error: "Error al preparar incidencia" },
        { status: 500 }
      );
    }

    const nextId = Number(lastRows?.[0]?.id_incidencia ?? 0) + 1;

    const { error } = await supabase.from("incidencias").insert({
      id_incidencia: nextId,
      tipo_incidencia,
      explicacion,
      prioridad,
      id_aula,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error al insertar incidencia" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
