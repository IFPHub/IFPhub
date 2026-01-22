import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_quedadas");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const {
    title,
    description,
    image,
    date,
    time,
    address,
    category,
    id_usuario,
  } = body;

  const { error } = await supabase.rpc("fn_create_quedada", {
    p_titulo: title,
    p_descripcion: description,
    p_imagen_url: image,
    p_fecha: date,
    p_hora: time,
    p_direccion: address,
    p_categoria: category,
    p_id_usuario: id_usuario,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}