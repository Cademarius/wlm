-- =====================================================================
-- WLM — Migration 0004 : monétisation (achats + indices débloqués)
-- =====================================================================

-- Historique des paiements (KkiaPay / Mobile Money)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  product text not null,                 -- 'hint' | 'slots' | 'boost'
  amount integer not null,               -- montant en FCFA (XOF)
  currency text not null default 'XOF',
  status text not null default 'pending',-- 'pending' | 'confirmed' | 'failed'
  transaction_id text unique,            -- id de transaction KkiaPay
  metadata jsonb,                        -- contexte (crush_id, hint_type, phone…)
  created_at timestamptz not null default now()
);
create index if not exists purchases_user_idx on public.purchases (user_id);

-- Indices révélés : qui a payé pour voir quel indice, sur quel admirateur
create table if not exists public.unlocked_hints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,        -- celui qui débloque (l'admiré·e)
  crush_id uuid not null,       -- la ligne crushes de l'admirateur (secret pointant vers user_id)
  hint_type text not null,      -- 'gender' | 'initial' | 'city'
  created_at timestamptz not null default now(),
  unique (user_id, crush_id, hint_type)
);
create index if not exists unlocked_hints_user_idx on public.unlocked_hints (user_id);
