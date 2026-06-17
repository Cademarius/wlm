import { createClient } from './client';

/**
 * Auth WLM par numéro de téléphone (international, format E.164 : +<indicatif><numéro>).
 * Livraison du code par WhatsApp en priorité (channel 'whatsapp'), repli SMS possible.
 * En dev, sans provider configuré, lire le code dans le dashboard Supabase (Auth > Logs).
 */

export type OtpChannel = 'whatsapp' | 'sms';

/**
 * Envoie un code OTP au numéro (E.164, ex: +22990000000 ou +33612345678).
 * Crée le compte automatiquement s'il n'existe pas (shouldCreateUser par défaut).
 */
export async function sendOtp(phone: string, channel: OtpChannel = 'whatsapp') {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { channel },
  });
  if (error) throw error;
}

/**
 * Vérifie le code reçu et ouvre la session si correct.
 * Le type 'sms' couvre la vérification des codes téléphone (WhatsApp inclus) côté Supabase.
 */
export async function verifyOtp(phone: string, token: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  if (error) throw error;
  return data;
}

/** Déconnexion. */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/** Utilisateur auth courant (ou null). */
export async function getCurrentAuthUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
