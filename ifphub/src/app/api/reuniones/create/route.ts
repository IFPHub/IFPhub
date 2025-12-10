import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      titulo,
      descripcion,
      tag,
      profesor,
      date,
      video,
      id_usuario,
      id_curso,
    } = body;

    const supabase = createClient();

    const { error } = await supabase.rpc("fn_insert_reunion", {
      p_titulo: titulo,
      p_descripcion: descripcion ?? null,
      p_tag: tag ?? null,
      p_profesor: profesor ?? null,
      p_fecha: date ?? null, // 👈 IMPORTANTE
      p_video: video ?? null,
      p_id_usuario: id_usuario,
      p_id_curso: id_curso ?? null,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}
