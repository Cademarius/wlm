import { createServiceClient } from "@/lib/supabase/service";
import { sendWhatsAppTemplate } from "./whatsapp";
import { sendSms } from "./sms";

/**
 * Invite virale : prévient un numéro NON inscrit que quelqu'un l'aime en
 * secret, et l'incite à s'inscrire pour savoir si c'est réciproque.
 *
 * Canaux : WhatsApp d'abord (template Meta approuvé), repli SMS si WhatsApp
 * échoue / n'est pas configuré. On ne révèle JAMAIS qui a ajouté le numéro.
 *
 * Anti-spam : pas de renvoi avant COOLDOWN_DAYS, même si plusieurs personnes
 * ajoutent ce numéro.
 */
const COOLDOWN_DAYS = 7;

export type InviteChannel = "whatsapp" | "sms" | "stub" | "failed";

export interface InviteResult {
  sent: boolean;
  channel: InviteChannel;
  throttled?: boolean;
}

export async function sendSecretAdmirerInvite(
  phone: string,
  force = false
): Promise<InviteResult> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("viral_invites")
    .select("phone, invite_count, last_sent_at")
    .eq("phone", phone)
    .maybeSingle();

  if (!force && existing?.last_sent_at) {
    const since = Date.now() - new Date(existing.last_sent_at).getTime();
    if (since < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
      return { sent: false, channel: "stub", throttled: true };
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wholikeme.app";

  // 1) WhatsApp (template approuvé requis pour écrire à un inconnu).
  const wa = await sendWhatsAppTemplate(
    phone,
    process.env.WHATSAPP_INVITE_TEMPLATE || "secret_admirer_invite",
    "fr",
    [appUrl]
  );

  let channel: InviteChannel;
  let sent = false;

  if (wa.sent) {
    channel = "whatsapp";
    sent = true;
  } else {
    // 2) Repli SMS (texte libre, sans révéler l'identité de l'admirateur).
    const sms = await sendSms(
      phone,
      `💘 Quelqu'un t'aime en secret sur WLM. Découvre qui : ${appUrl}`
    );
    if (sms.sent) {
      channel = "sms";
      sent = true;
    } else {
      // Aucun canal n'a réellement envoyé : stub (non configuré) ou échec.
      channel = wa.stub && sms.stub ? "stub" : "failed";
    }
  }

  // On enregistre la tentative (envoi réel ou stub) pour respecter le cooldown.
  await supabase.from("viral_invites").upsert({
    phone,
    invite_count: (existing?.invite_count ?? 0) + 1,
    last_sent_at: new Date().toISOString(),
    last_channel: channel,
  });

  return { sent, channel };
}
