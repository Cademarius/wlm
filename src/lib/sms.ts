/**
 * Abstraction d'envoi SMS (provider : Twilio).
 *
 * Sert de canal de repli quand WhatsApp n'est pas disponible (numéro sans
 * WhatsApp, template non approuvé, ou WhatsApp non configuré). Contrairement à
 * WhatsApp, le SMS autorise le texte libre — pas de template à faire approuver.
 *
 * Sans config (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + un expéditeur), on
 * bascule en mode STUB : on log au lieu d'envoyer, pour ne rien bloquer en dev.
 *
 * Pour le Bénin / l'Afrique de l'Ouest, Twilio peut être remplacé par Termii,
 * Vonage, etc. : il suffit de réécrire `sendSms` ici, l'appelant ne change pas.
 */

export interface SmsResult {
  sent: boolean;
  stub?: boolean;
  error?: string;
}

export async function sendSms(toPhone: string, body: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM; // numéro Twilio (format E.164)
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

  // Twilio attend le destinataire au format E.164 (avec "+").
  const to = toPhone.startsWith("+") ? toPhone : `+${toPhone.replace(/[^\d]/g, "")}`;

  if (!sid || !token || (!from && !messagingServiceSid)) {
    console.log(
      `[SMS STUB] → ${to} : "${body}" — configure TWILIO_ACCOUNT_SID + ` +
        `TWILIO_AUTH_TOKEN + (TWILIO_SMS_FROM ou TWILIO_MESSAGING_SERVICE_SID) ` +
        `pour envoyer pour de vrai.`
    );
    return { sent: false, stub: true };
  }

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
      console.error("[SMS] échec d'envoi:", err);
      return { sent: false, error: err };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
