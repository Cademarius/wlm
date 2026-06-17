-- =====================================================================
-- WLM — Migration 0003 : suivi des invitations virales (anti-spam)
-- Une ligne par numéro invité, pour ne pas renvoyer trop souvent
-- l'invitation « quelqu'un t'aime en secret ».
-- =====================================================================

create table if not exists public.viral_invites (
  phone text primary key,
  invite_count integer not null default 0,
  last_sent_at timestamptz
);
