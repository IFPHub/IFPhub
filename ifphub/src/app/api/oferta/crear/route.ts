import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function PUT(req: Request) {
  const supabase = createClient();

  // 1️⃣ Obtener usuario autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { message: "No autorizado" },
      { status: 401 }
    );
  }

  // 2️⃣ Leer body
  const body = await req.json();

  const {
    id_oferta,
    titulo,
    descripcion,
    sueldo,
    id_curso,
    fecha_limite,
  } = body;

  if (!id_oferta) {
    return NextResponse.json(
      { message: "id_oferta es obligatorio" },
      { status: 400 }
    );
  }

  // 3️⃣ Llamar a la función SQL
  const { error } = await supabase.rpc("fn_update_oferta", {
    p_id_oferta: id_oferta,
    p_titulo: titulo ?? null,
    p_descripcion: descripcion ?? null,
    p_sueldo: sueldo ?? null,
    p_id_curso: id_curso ?? null,
    p_fecha_limite: fecha_limite ?? null,
    p_id_usuario: user.id, // 🔒 sale de la sesión
  });

  if (error) {
    console.error("❌ RPC error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Oferta actualizada correctamente",
  });
}