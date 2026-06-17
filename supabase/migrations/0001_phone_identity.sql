-- =====================================================================
-- WLM — Migration 0001 : identité par numéro de téléphone
-- Objectif : passer d'une identité Google/email à une identité par
-- numéro de téléphone (auth Supabase), sans détruire les données existantes.
-- À exécuter dans le SQL Editor de Supabase (ou via `supabase db push`).
-- Idempotent : peut être rejoué sans erreur.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) users : le numéro de téléphone devient l'identité principale
-- ---------------------------------------------------------------------
alter table public.users add column if not exists phone text;

-- Un numéro = un compte (on ignore les NULL pour ne pas casser l'existant)
create unique index if not exists users_phone_unique
  on public.users (phone)
  where phone is not null;

-- L'email n'est plus obligatoire (auth par numéro, Google devient optionnel)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users'
      and column_name = 'email' and is_nullable = 'NO'
  ) then
    alter table public.users alter column email drop not null;
  end if;
end $$;

-- Quota de crushes (gratuit = 5 ; les achats de slots l'augmenteront)
alter table public.users add column if not exists crush_slots integer not null default 5;

-- ---------------------------------------------------------------------
-- 2) crushes : on cible un NUMÉRO (fiable), plus un nom libre
-- ---------------------------------------------------------------------
alter table public.crushes add column if not exists crush_phone text;

-- crush_name devient optionnel (transition depuis l'ancien modèle)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'crushes'
      and column_name = 'crush_name' and is_nullable = 'NO'
  ) then
    alter table public.crushes alter column crush_name drop not null;
  end if;
end $$;

-- Un même utilisateur ne peut pas ajouter deux fois le même numéro
create unique index if not exists crushes_user_phone_unique
  on public.crushes (user_id, crush_phone)
  where crush_phone is not null;

-- Recherche rapide « qui a un crush sur ce numéro ? »
create index if not exists crushes_crush_phone_idx
  on public.crushes (crush_phone);

-- ---------------------------------------------------------------------
-- 3) Lier le profil public.users à l'auth Supabase
--    À chaque création d'un compte auth (par téléphone), on crée/maj le profil.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, phone, created_at, updated_at)
  values (new.id, new.phone, now(), now())
  on conflict (id) do update
    set phone = coalesce(excluded.phone, public.users.phone),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

-- =====================================================================
-- NOTES
-- - Les anciens comptes Google existants ne sont PAS supprimés ; ils
--   restent orphelins (sans auth.users correspondant) jusqu'à ce qu'on
--   décide d'une stratégie de migration ou de nettoyage.
-- - La logique de "match" se fera désormais sur crush_phone <-> users.phone.
-- - RLS : laissé tel quel (les routes API utilisent la service_role key).
--   À durcir dans une migration ultérieure une fois l'auth stabilisée.
-- =====================================================================
