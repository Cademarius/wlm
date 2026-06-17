-- =====================================================================
-- WLM — Installation complète du schéma (projet NEUF)
-- À exécuter EN PREMIER sur un projet Supabase vide.
-- Inclut déjà l'identité par téléphone (rend 0001/0003/0004 redondants
-- pour une installation fraîche). Idempotent.
-- =====================================================================

-- ---------------------------------------------------------------------
-- users : profil, lié 1-1 à l'auth Supabase (auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  name text,
  age integer,
  image text,
  bio text,
  interests text[],
  location text,
  gender text check (gender in ('male','female','other')),
  google_id text,
  crush_slots integer not null default 5,
  profile_completion_skips integer not null default 0,
  is_online boolean default false,
  last_seen timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_phone_unique
  on public.users (phone) where phone is not null;
create unique index if not exists users_email_unique
  on public.users (email) where email is not null;

-- ---------------------------------------------------------------------
-- crushes : "j'aime en secret" — ciblé par NUMÉRO
-- ---------------------------------------------------------------------
create table if not exists public.crushes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  crush_name text,                 -- surnom privé optionnel
  crush_phone text,                -- numéro de la cible (E.164)
  status text not null default 'pending',  -- 'pending' | 'matched' | 'revealed'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists crushes_user_phone_unique
  on public.crushes (user_id, crush_phone) where crush_phone is not null;
create index if not exists crushes_crush_phone_idx on public.crushes (crush_phone);
create index if not exists crushes_user_idx on public.crushes (user_id);

-- ---------------------------------------------------------------------
-- matches : couple réciproque
-- ---------------------------------------------------------------------
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.users(id) on delete cascade,
  user2_id uuid not null references public.users(id) on delete cascade,
  matched_at timestamptz not null default now(),
  unique (user1_id, user2_id)
);

-- ---------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text,
  title text,
  title_en text,
  message text,
  message_en text,
  from_user_id uuid references public.users(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id);

-- ---------------------------------------------------------------------
-- push_subscriptions (notifications PWA)
-- ---------------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  endpoint text,
  subscription jsonb,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------
-- Monétisation : achats + indices débloqués
-- ---------------------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product text not null,                  -- 'hint' | 'slots' | 'boost'
  amount integer not null,
  currency text not null default 'XOF',
  status text not null default 'pending', -- 'pending' | 'confirmed' | 'failed'
  transaction_id text unique,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists purchases_user_idx on public.purchases (user_id);

create table if not exists public.unlocked_hints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  crush_id uuid not null references public.crushes(id) on delete cascade,
  hint_type text not null,                -- 'gender' | 'initial' | 'city'
  created_at timestamptz not null default now(),
  unique (user_id, crush_id, hint_type)
);
create index if not exists unlocked_hints_user_idx on public.unlocked_hints (user_id);

-- ---------------------------------------------------------------------
-- Invitations virales (anti-spam)
-- ---------------------------------------------------------------------
create table if not exists public.viral_invites (
  phone text primary key,
  invite_count integer not null default 0,
  last_sent_at timestamptz
);

-- ---------------------------------------------------------------------
-- Création auto du profil à l'inscription par téléphone
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
-- NOTE RLS : non activé pour l'instant (l'app lit le profil via la clé
-- anon côté client, et les routes serveur utilisent la service_role).
-- À durcir plus tard avec des policies dédiées.
-- =====================================================================
