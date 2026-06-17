import { createServerSupabaseClient } from "./server";

/** Récupère l'utilisateur auth Supabase côté serveur (ou null). */
export async function getServerAuthUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
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
