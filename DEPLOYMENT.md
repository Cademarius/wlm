# Déploiement & séparation DEV / PROD

WLM utilise **deux bases Supabase distinctes** et se déploie sur **Vercel**.

| Environnement | Base Supabase | KkiaPay | Variables d'env | Où |
|---|---|---|---|---|
| **DEV** (local) | projet de dev (données de test) | sandbox | `.env.local` | ta machine |
| **PROD** (Vercel) | projet de prod (à créer) | live | Vercel → scope *Production* | dashboard Vercel |

> `.env*` est gitignoré : **aucun secret n'est committé**. Le modèle des variables est dans `.env.example`.

---

## 1. Développement (local)

1. `cp .env.example .env.local`
2. Renseigner les valeurs du **projet Supabase de dev** (URL, anon, service_role) et les **clés KkiaPay sandbox** (`*_SANDBOX=1`).
3. `npm run dev` (port 3001).

---

## 2. Créer la base de PRODUCTION (une seule fois)

1. Sur [supabase.com](https://supabase.com), **créer un nouveau projet** (ex. `wlm-prod`), région proche du Bénin (ex. `eu-west`). Noter le mot de passe DB.
2. **Appliquer le schéma** : ouvrir *SQL Editor* → coller et exécuter **`supabase/migrations/0000_base_schema.sql`**.
   - C'est le schéma complet consolidé (identité téléphone, crushes, matches, notifications, push, purchases, unlocked_hints, viral_invites, trigger). Idempotent.
   - Les fichiers `0001`–`0004` sont l'historique de migration — **inutiles** sur un projet neuf.
3. **Auth téléphone** : *Authentication → Providers → Phone* → activer ; configurer le provider OTP (Twilio Verify + sender WhatsApp/SMS) comme en dev. **Ne PAS** ajouter de *Test Phone Numbers* en prod.
4. **Récupérer les clés** : *Project Settings → API* → `Project URL`, `anon public`, `service_role`.

---

## 3. Configurer Vercel (scope Production)

*Project → Settings → Environment Variables* — pour chaque variable, cocher **Production** (et *Preview* si tu veux que les previews tapent aussi la base de prod ; sinon pointe les Preview vers la base de dev).

| Variable | Valeur (PROD) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet **prod** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon **prod** |
| `SUPABASE_SERVICE_ROLE_KEY` | clé service_role **prod** (secret) |
| `NEXT_PUBLIC_APP_URL` | `https://ton-domaine.app` |
| `NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY` | clé publique **live** |
| `KKIAPAY_PRIVATE_KEY` | clé privée **live** |
| `KKIAPAY_SECRET` | secret **live** |
| `NEXT_PUBLIC_KKIAPAY_SANDBOX` | `0` |
| `KKIAPAY_SANDBOX` | `0` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | clé publique VAPID |
| `VAPID_PRIVATE_KEY` | clé privée VAPID |
| `ADMIN_PHONES` | numéros admin E.164, séparés par virgule |
| `WHATSAPP_*` | quand la roadmap #7 sera branchée |

Après modification des variables → **redéployer** (les variables ne sont lues qu'au build/déploiement).

---

## 4. Garde-fou

Les variables Supabase sont lues via `src/lib/env.ts` (validation *fail-fast*). Si une variable manque en prod, le build/déploiement échoue avec un message explicite (`[env] Variable d'environnement manquante : …`) plutôt qu'une erreur opaque. Le client service_role passe par `src/lib/supabase/service.ts` (`createServiceClient()`).

## 5. Checklist mise en prod

- [ ] Projet Supabase prod créé + `0000_base_schema.sql` exécuté
- [ ] Auth téléphone activée en prod (provider OTP configuré, pas de test numbers)
- [ ] Variables Vercel renseignées (scope Production) + redéploiement
- [ ] KkiaPay en **live** (`SANDBOX=0`) avec clés de production
- [ ] `NEXT_PUBLIC_APP_URL` = domaine de prod
- [ ] `ADMIN_PHONES` renseigné
- [ ] Test de bout en bout sur le domaine de prod (connexion OTP → ajout secret → paiement réel)
