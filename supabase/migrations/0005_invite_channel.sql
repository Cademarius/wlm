-- =====================================================================
-- WLM — Canal d'invitation virale (WhatsApp / SMS)
-- Ajoute le canal réellement utilisé pour la dernière invite envoyée.
-- À exécuter sur une base EXISTANTE (le schéma 0000 l'inclut déjà pour
-- les installations neuves). Idempotent.
-- =====================================================================

alter table public.viral_invites
  add column if not exists last_channel text;
