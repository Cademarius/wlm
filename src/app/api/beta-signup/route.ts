import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/** Nombre d'inscrits bêta (preuve sociale, lecture via service_role). */
export async function GET() {
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from("beta_signups")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

/**
 * Inscription d'un bêta-testeur (liste d'attente publique).
 * Pas d'authentification : page marketing ouverte. On stocke le numéro
 * WhatsApp + prénom + ville. Dédoublonnage par numéro (upsert).
 */
export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; city?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const phone = (body.phone || "").trim();
  const name = (body.name || "").trim() || null;
  const city = (body.city || "").trim() || null;

  // Validation minimale du numéro (E.164 : + suivi de 8 à 15 chiffres).
  if (!/^\+\d{8,15}$/.test(phone)) {
    return NextResponse.json(
      { error: "Numéro de téléphone invalide" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("beta_signups")
    .upsert(
      { phone, name, city, source: "landing" },
      { onConflict: "phone" }
    );

  if (error) {
    console.error("[beta-signup] erreur:", error.message);
    return NextResponse.json({ error: "Enregistrement impossible" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
