import { createClient } from "@supabase/supabase-js";
import { supabaseServiceConfig } from "@/lib/env";

/**
 * Client Supabase avec la clé `service_role` (bypass RLS) — SERVEUR UNIQUEMENT.
 * Centralise la lecture validée des variables d'env : si l'URL ou la clé
 * service_role manque (ex. variable Vercel oubliée en prod), on échoue tout de
 * suite avec un message explicite plutôt qu'avec une erreur opaque.
 */
export function createServiceClient() {
  const { url, serviceKey } = supabaseServiceConfig();
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
