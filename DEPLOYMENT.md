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
3. **Auth téléphone** : *Authentication → Providers → Phone* → activer, puis configurer le **hook OTP** (voir §5) pour la livraison WhatsApp/SMS. **Ne PAS** ajouter de *Test Phone Numbers* en prod.
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
| `SUPABASE_AUTH_HOOK_SECRET` | secret du hook OTP Supabase (voir §5) |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Cloud API (OTP + invites — voir §5/§6) |
| `WHATSAPP_OTP_TEMPLATE` / `WHATSAPP_OTP_LANG` | template OTP WhatsApp (voir §5) |
| `WHATSAPP_INVITE_TEMPLATE` | template d'invite virale (voir §6) |
| `VONAGE_API_KEY` / `VONAGE_API_SECRET` / `VONAGE_FROM` | SMS (OTP de repli + invites) |
| `TWILIO_*` | alternative SMS à Vonage (optionnel) |

Après modification des variables → **redéployer** (les variables ne sont lues qu'au build/déploiement).

---

## 4. Garde-fou

Les variables Supabase sont lues via `src/lib/env.ts` (validation *fail-fast*). Si une variable manque en prod, le build/déploiement échoue avec un message explicite (`[env] Variable d'environnement manquante : …`) plutôt qu'une erreur opaque. Le client service_role passe par `src/lib/supabase/service.ts` (`createServiceClient()`).

## 5. Connexion OTP par WhatsApp + SMS (sans Twilio Verify)

Au lieu d'un provider OTP intégré (Twilio Verify…), on utilise un **Auth Hook Supabase « Send SMS »** : Supabase **génère et vérifie** le code, mais délègue la **livraison** à notre endpoint `/api/auth/send-otp`, qui essaie **WhatsApp d'abord, puis SMS** en repli. Aucun compte Twilio Verify requis.

**Côté Supabase** (sur le projet concerné) :
1. *Authentication → Providers → Phone* → **activer** (mais ne PAS choisir de provider intégré).
2. *Authentication → Hooks* → **Send SMS hook** → type **HTTPS** → URL = `https://<domaine>/api/auth/send-otp`.
3. Copier le **secret** généré (`v1,whsec_…`) → variable `SUPABASE_AUTH_HOOK_SECRET` (dans `.env.local` en dev, Vercel en prod).

**Côté canaux** (au moins un pour livrer réellement ; sinon mode stub = log) :
- **WhatsApp** (prioritaire) : app WhatsApp Cloud API (Meta) → `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` + un **template d'authentification** approuvé → `WHATSAPP_OTP_TEMPLATE` (+ `WHATSAPP_OTP_LANG`).
- **SMS** (repli) : **Termii** (`TERMII_API_KEY`, `TERMII_FROM`) **recommandé pour le Bénin** (inscription qui passe là où Twilio/Vonage bloquent), sinon Vonage (`VONAGE_*`) ou Twilio (`TWILIO_*`). Provider choisi automatiquement (Termii > Vonage > Twilio). **Ces providers sont appelés par notre hook, pas par Supabase** — donc pas besoin qu'ils figurent dans la liste de providers de Supabase.

WhatsApp s'active dès que ses variables sont là — **sans changer le code**. L'app (`signInWithOtp`/`verifyOtp`) est inchangée.

## 6. Invitations virales (WhatsApp + SMS)

Quand quelqu'un ajoute un numéro **non inscrit**, WLM envoie une invite « quelqu'un t'aime en secret » (sans révéler qui). Deux canaux, avec repli automatique :

1. **WhatsApp** (principal) — API Cloud de Meta. Écrire à un inconnu exige un **message template approuvé** par Meta :
   - Créer une app WhatsApp Business, récupérer `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID`.
   - Soumettre un template (1 variable = l'URL de l'app), ex. nommé `secret_admirer_invite`, et le mettre dans `WHATSAPP_INVITE_TEMPLATE`.
2. **SMS** (repli, si WhatsApp échoue/non configuré) — **Vonage** (`VONAGE_*`) ou **Twilio** (`TWILIO_*`), choisi automatiquement selon les variables présentes (voir `src/lib/sms.ts`). Texte libre, pas de template.

Sans aucune config → **mode stub** : l'invite est *loggée* (pas envoyée) et le cooldown anti-spam (7 j) est respecté. Le canal réellement utilisé est tracé dans `viral_invites.last_channel`.
⚠️ Sur une base **existante**, exécuter `supabase/migrations/0005_invite_channel.sql` (la colonne est déjà dans `0000` pour les bases neuves).

## 7. Checklist mise en prod

- [ ] Projet Supabase prod créé + `0000_base_schema.sql` exécuté
- [ ] Auth téléphone activée + hook OTP configuré (`SUPABASE_AUTH_HOOK_SECRET`), pas de test numbers
- [ ] Au moins un canal OTP livre réellement : WhatsApp (`WHATSAPP_*` + template) et/ou SMS (`VONAGE_*`)
- [ ] Variables Vercel renseignées (scope Production) + redéploiement
- [ ] KkiaPay en **live** (`SANDBOX=0`) avec clés de production
- [ ] `NEXT_PUBLIC_APP_URL` = domaine de prod
- [ ] `ADMIN_PHONES` renseigné
- [ ] (optionnel) Invites virales : template WhatsApp approuvé et/ou Twilio SMS configuré (sinon mode stub)
- [ ] Test de bout en bout sur le domaine de prod (connexion OTP → ajout secret → paiement réel)
