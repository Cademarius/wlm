-- =====================================================================
-- WLM — Migration 0002 : nettoyage des anciens comptes (DESTRUCTIF)
-- =====================================================================
-- ⚠️  À EXÉCUTER MANUELLEMENT ET EN CONSCIENCE. Cette migration SUPPRIME
--     définitivement les anciens comptes (ère Google/email) et leurs
--     données liées. On repart sur une base 100 % identité-par-téléphone.
--
--     Autorisé par le user : « tu peux supprimer les anciens comptes ».
--     Fais une sauvegarde Supabase (Database > Backups) avant si tu hésites.
-- =====================================================================

begin;

-- Les "anciens comptes" = profils public.users SANS numéro de téléphone
-- (donc créés via Google/email, pas via le nouveau flux OTP).

-- 1) Données dépendantes d'abord (au cas où il n'y aurait pas de ON DELETE CASCADE)
delete from public.notifications
  where user_id in (select id from public.users where phone is null)
     or from_user_id in (select id from public.users where phone is null);

delete from public.push_subscriptions
  where user_id in (select id from public.users where phone is null);

delete from public.matches
  where user1_id in (select id from public.users where phone is null)
     or user2_id in (select id from public.users where phone is null);

delete from public.crushes
  where user_id in (select id from public.users where phone is null);

-- 2) Les profils eux-mêmes
delete from public.users where phone is null;

commit;

-- =====================================================================
-- Optionnel : purger aussi les utilisateurs auth orphelins (ère Google).
-- À lancer séparément si tu veux un nettoyage total côté auth.
--   delete from auth.users
--   where id not in (select id from public.users);
-- =====================================================================
