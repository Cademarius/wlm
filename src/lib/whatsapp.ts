/**
 * Abstraction d'envoi WhatsApp (API Cloud de Meta).
 *
 * IMPORTANT : pour écrire à quelqu'un qui ne t'a jamais contacté (cas de
 * l'invitation virale), WhatsApp impose un **message template** approuvé par
 * Meta — pas du texte libre. D'où `sendWhatsAppTemplate`.
 *
 * Sans config (WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID), on bascule en
 * mode STUB : on log au lieu d'envoyer, pour ne rien bloquer en dev.
 */

export interface WhatsAppResult {
  sent: boolean;
  stub?: boolean;
  error?: string;
}

export async function sendWhatsAppTemplate(
  toPhone: string,
  templateName: string,
  languageCode = "fr",
  bodyParams: string[] = []
): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  // WhatsApp attend le numéro sans le "+"
  const to = toPhone.replace(/[^\d]/g, "");

  if (!token || !phoneId) {
    console.log(
      `[WhatsApp STUB] template "${templateName}" → ${toPhone}` +
        (bodyParams.length ? ` (params: ${bodyParams.join(", ")})` : "") +
        ` — configure WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID pour envoyer pour de vrai.`
    );
    return { sent: false, stub: true };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
            components: bodyParams.length
              ? [
                  {
                    type: "body",
                    parameters: bodyParams.map((text) => ({
                      type: "text",
                      text,
                    })),
                  },
                ]
              : [],
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[WhatsApp] échec d'envoi:", err);
      return { sent: false, error: err };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
