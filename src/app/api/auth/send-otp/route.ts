import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendWhatsAppOtp } from "@/lib/whatsapp";
import { sendSms } from "@/lib/sms";

/**
 * Auth Hook Supabase « Send SMS » → livraison de l'OTP par WhatsApp puis SMS.
 *
 * Supabase génère et vérifie le code lui-même ; il appelle CET endpoint pour le
 * *livrer*. On essaie WhatsApp (template d'authentification Meta) d'abord, puis
 * SMS (Vonage/Twilio) en repli. Aucun provider Twilio Verify requis.
 *
 * Sécurité : requête signée façon « Standard Webhooks » (en-têtes webhook-id /
 * webhook-timestamp / webhook-signature) avec le secret SUPABASE_AUTH_HOOK_SECRET
 * fourni par Supabase à la création du hook.
 *
 * Config : Supabase → Authentication → Hooks → « Send SMS hook » (HTTPS) →
 *   URL = https://<domaine>/api/auth/send-otp
 */

interface SendSmsHookPayload {
  user?: { phone?: string };
  sms?: { otp?: string };
}

/** Vérifie la signature Standard Webhooks. Retourne true si valide. */
function verifySignature(
  rawBody: string,
  headers: Headers,
  secret: string
): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  // Secret Supabase : "v1,whsec_<base64>" → on isole la partie base64.
  const base64Secret = secret.replace(/^v1,/, "").replace(/^whsec_/, "");
  let key: Buffer;
  try {
    key = Buffer.from(base64Secret, "base64");
  } catch {
    return false;
  }

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", key)
    .update(signedContent)
    .digest("base64");

  // L'en-tête peut contenir plusieurs signatures séparées par des espaces,
  // chacune préfixée par sa version (ex. "v1,<sig>").
  const expectedBuf = Buffer.from(expected);
  return signatureHeader.split(" ").some((part) => {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const sigBuf = Buffer.from(sig);
    return (
      sigBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(sigBuf, expectedBuf)
    );
  });
}

export async function POST(req: Request) {
  const secret = process.env.SUPABASE_AUTH_HOOK_SECRET;
  if (!secret) {
    console.error("[send-otp] SUPABASE_AUTH_HOOK_SECRET non configuré.");
    return NextResponse.json({ error: "Hook non configuré" }, { status: 500 });
  }

  const rawBody = await req.text();
  if (!verifySignature(rawBody, req.headers, secret)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let payload: SendSmsHookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const phone = payload.user?.phone;
  const code = payload.sms?.otp;
  if (!phone || !code) {
    return NextResponse.json({ error: "Numéro ou code manquant" }, { status: 400 });
  }

  // 1) WhatsApp d'abord.
  const wa = await sendWhatsAppOtp(phone, code);
  if (wa.sent) {
    return NextResponse.json({});
  }

  // 2) Repli SMS (texte libre).
  const sms = await sendSms(
    phone,
    `WLM : ton code de connexion est ${code}. Il expire dans quelques minutes.`
  );
  if (sms.sent) {
    return NextResponse.json({});
  }

  // Aucun canal n'a livré → on remonte l'erreur à Supabase (l'utilisateur la verra).
  console.error("[send-otp] échec WhatsApp ET SMS", {
    wa: wa.error || (wa.stub ? "stub" : "?"),
    sms: sms.error || (sms.stub ? "stub" : "?"),
  });
  return NextResponse.json(
    { error: "Échec de livraison du code (WhatsApp + SMS)" },
    { status: 500 }
  );
}
