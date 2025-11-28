// lib/sendPushNotification.ts
// Utilitaire Node.js pour envoyer une notification push à un utilisateur


import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  'mailto:admin@tonsite.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface PushPayload {
  title: string;
  body: string;
}

export async function sendPushNotification(userId: string, payload: PushPayload): Promise<boolean> {
  // Récupère l’abonnement push du user
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('user_id', userId)
    .single();
  if (error || !data) {
    return false;
  }
  try {
    await webpush.sendNotification(data.subscription, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}
