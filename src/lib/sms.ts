/**
 * Abstraction d'envoi SMS — providers supportés : Vonage et Twilio.
 *
 * Sert de canal de repli quand WhatsApp n'est pas disponible (numéro sans
 * WhatsApp, template non approuvé, ou WhatsApp non configuré). Contrairement à
 * WhatsApp, le SMS autorise le texte libre — pas de template à faire approuver.
 *
 * Choix du provider (au runtime, selon les variables présentes) :
 *   1. Vonage  si VONAGE_API_KEY + VONAGE_API_SECRET
 *   2. Twilio  si TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + (FROM | MESSAGING_SERVICE)
 *   3. sinon   → mode STUB (log, rien envoyé) pour ne pas bloquer le dev.
 *
 * Vonage est recommandé pour le Bénin / l'Afrique de l'Ouest (inscription qui
 * passe mieux que Twilio, bonne couverture). L'appelant ne change jamais.
 */

export interface SmsResult {
  sent: boolean;
  stub?: boolean;
  error?: string;
}

function toE164(phone: string): string {
  return phone.startsWith("+") ? phone : `+${phone.replace(/[^\d]/g, "")}`;
}

export async function sendSms(toPhone: string, body: string): Promise<SmsResult> {
  const to = toE164(toPhone);

  if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
    return sendViaVonage(to, body);
  }
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    (process.env.TWILIO_SMS_FROM || process.env.TWILIO_MESSAGING_SERVICE_SID)
  ) {
    return sendViaTwilio(to, body);
  }

  console.log(
    `[SMS STUB] → ${to} : "${body}" — configure VONAGE_* ou TWILIO_* pour envoyer pour de vrai.`
  );
  return { sent: false, stub: true };
}

// --- Vonage (rest.nexmo.com) -------------------------------------------------
async function sendViaVonage(to: string, body: string): Promise<SmsResult> {
  const apiKey = process.env.VONAGE_API_KEY as string;
  const apiSecret = process.env.VONAGE_API_SECRET as string;
  const from = process.env.VONAGE_FROM || "WLM"; // sender ID alphanumérique ou numéro

  try {
    const form = new URLSearchParams({
      api_key: apiKey,
      api_secret: apiSecret,
      // Vonage attend le destinataire sans le "+".
      to: to.replace(/[^\d]/g, ""),
      from,
      text: body,
    });

    const res = await fetch("https://rest.nexmo.com/sms/json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const data = (await res.json()) as {
      messages?: Array<{ status: string; "error-text"?: string }>;
    };
    const msg = data.messages?.[0];
    if (msg && msg.status === "0") return { sent: true };
    const err = msg?.["error-text"] || `statut Vonage ${msg?.status}`;
    console.error("[SMS Vonage] échec d'envoi:", err);
    return { sent: false, error: err };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

// --- Twilio (api.twilio.com) -------------------------------------------------
async function sendViaTwilio(to: string, body: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID as string;
  const token = process.env.TWILIO_AUTH_TOKEN as string;
  const from = process.env.TWILIO_SMS_FROM;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  try {
    const form = new URLSearchParams({ To: to, Body: body });
    if (messagingServiceSid) form.set("MessagingServiceSid", messagingServiceSid);
    else form.set("From", from as string);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[SMS Twilio] échec d'envoi:", err);
      return { sent: false, error: err };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
