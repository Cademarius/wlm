/**
 * Accès centralisé et validé aux variables d'environnement.
 *
 * Séparation des environnements :
 *  - DÉV   : valeurs dans `.env.local` (projet Supabase de dev + KkiaPay sandbox).
 *  - PROD  : variables définies dans le dashboard Vercel (scope « Production »)
 *            → projet Supabase de prod + clés KkiaPay live.
 *
 * Voir `.env.example` et `DEPLOYMENT.md`.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[env] Variable d'environnement manquante : ${name}. ` +
        `Définis-la dans .env.local (dév) ou dans les variables Vercel (prod). ` +
        `Voir .env.example.`
    );
  }
  return value;
}

/** URL + clé anon (publiques, côté navigateur ET serveur SSR). */
export function supabaseAnonConfig() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  };
}

/** URL + clé service_role (SERVEUR UNIQUEMENT — ne jamais exposer au client). */
export function supabaseServiceConfig() {
  return {
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceKey: required(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
  };
}
