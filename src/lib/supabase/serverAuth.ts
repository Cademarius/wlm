import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./server";

/** Récupère l'utilisateur auth Supabase côté serveur (ou null). */
export async function getServerAuthUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

type GuardResult =
  | { error: NextResponse; authUser: null }
  | { error: null; authUser: User };

/**
 * Garde d'authentification pour les routes API.
 * - Exige une session valide (sinon 401).
 * - Si `userId` est fourni, exige que l'appelant SOIT cet utilisateur (sinon 403).
 *   → empêche d'agir/lire au nom d'un autre en passant son userId.
 */
export async function requireSelf(userId?: string | null): Promise<GuardResult> {
  const authUser = await getServerAuthUser();
  if (!authUser) {
    return {
      error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
      authUser: null,
    };
  }
  if (userId && authUser.id !== userId) {
    return {
      error: NextResponse.json({ error: "Accès refusé" }, { status: 403 }),
      authUser: null,
    };
  }
  return { error: null, authUser };
}

/**
 * Vérifie si un numéro fait partie des admins (variable d'env ADMIN_PHONES,
 * numéros E.164 séparés par des virgules). Remplace l'ancien ADMIN_EMAILS.
 */
export function isAdminPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const admins = (process.env.ADMIN_PHONES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return admins.includes(phone);
}
