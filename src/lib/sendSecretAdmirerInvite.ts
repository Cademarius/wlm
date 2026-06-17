import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppTemplate, type WhatsAppResult } from "./whatsapp";

/**
 * Invite virale : prévient un numéro NON inscrit que quelqu'un l'aime en
 * secret, et l'incite à s'inscrire pour savoir si c'est réciproque.
 *
 * Anti-spam : on ne renvoie pas avant COOLDOWN_DAYS, même si plusieurs
 * personnes ajoutent ce numéro. On ne révèle jamais qui l'a ajouté.
 */
const COOLDOWN_DAYS = 7;

export async function sendSecretAdmirerInvite(
  phone: string,
  force = false
): Promise<WhatsAppResult & { throttled?: boolean }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: existing } = await supabase
    .from("viral_invites")
    .select("phone, invite_count, last_sent_at")
    .eq("phone", phone)
    .maybeSingle();

  if (!force && existing?.last_sent_at) {
    const since = Date.now() - new Date(existing.last_sent_at).getTime();
    if (since < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
      return { sent: false, throttled: true };
    }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://wholikeme.app";

  const result = await sendWhatsAppTemplate(
    phone,
    process.env.WHATSAPP_INVITE_TEMPLATE || "secret_admirer_invite",
    "fr",
    [appUrl]
  );

  // On enregistre la tentative (envoi réel ou stub) pour respecter le cooldown.
  await supabase.from("viral_invites").upsert({
    phone,
    invite_count: (existing?.invite_count ?? 0) + 1,
    last_sent_at: new Date().toISOString(),
  });

  return result;
}
