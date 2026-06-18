-- =====================================================================
-- WLM — Inscriptions bêta-testeurs (liste d'attente)
-- Collecte des premiers utilisateurs avant le lancement public.
-- RLS activé sans policy → accès uniquement via la clé service_role (API).
-- À exécuter sur une base existante (déjà inclus dans 0000 pour les neuves).
-- =====================================================================

create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text unique not null,
  city text,
  source text,
  created_at timestamptz not null default now()
);

alter table public.beta_signups enable row level security;
