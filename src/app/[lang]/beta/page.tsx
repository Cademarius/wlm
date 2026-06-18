"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

/**
 * Landing bêta-testeurs — page autonome (texte en dur, pas de dépendance à
 * l'app : ni i18n partagé, ni auth). Collecte le numéro WhatsApp via
 * /api/beta-signup, et propose de rejoindre le groupe WhatsApp.
 * Le header/menu de l'app est masqué pour cette route (voir AppChrome).
 */

const GROUP_URL = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "";

const STEPS = [
  { emoji: "📱", title: "Ajoute un numéro", desc: "La personne que tu aimes en secret — même si elle n'est pas inscrite." },
  { emoji: "🔒", title: "C'est 100% secret", desc: "Elle ne saura jamais que c'est toi." },
  { emoji: "💘", title: "Si c'est réciproque", desc: "Vous êtes prévenus tous les deux." },
];

const PERKS = [
  "Accès VIP avant tout le monde",
  "Avantages offerts au lancement (indices & places)",
  "Tu façonnes l'app avec tes retours",
];

export default function BetaPage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  // Compteur live des inscrits (preuve sociale).
  useEffect(() => {
    fetch("/api/beta-signup")
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === "number" ? d.count : null))
      .catch(() => {});
  }, []);

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://wlm-two.vercel.app/fr/beta";
    const text = "💘 Découvre qui t'aime en secret. Rejoins la bêta de WLM 👉";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "WLM", text, url });
        return;
      }
    } catch {
      /* l'utilisateur a annulé — on tombe sur WhatsApp */
    }
    if (typeof window !== "undefined") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        "_blank"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Entre un numéro WhatsApp valide.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/beta-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, phone }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Une erreur est survenue. Réessaie.");
      }
      setDone(true);
      setCount((c) => (c ?? 0) + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#1a1033] via-[#241247] to-[#1a1033] text-white">
      {/* Halos décoratifs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FF5C8A]/20 blur-3xl" />
        <div className="absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-[#B14DFF]/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-5 py-10 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="WLM" width={40} height={40} className="h-9 w-9" priority />
          <span className="text-2xl font-extrabold wlm-gradient-text tracking-tight">WLM</span>
        </div>

        {/* Hero */}
        <span className="mt-6 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
          Accès anticipé · Bêta privée 🌍
        </span>
        <h1 className="mt-4 text-center text-3xl font-bold leading-tight sm:text-4xl">
          Découvre qui <span className="wlm-gradient-text">t&apos;aime en secret</span> 💘
        </h1>
        <p className="mt-3 max-w-md text-center text-white/70">
          Ajoute en secret les personnes que tu aimes. Si c&apos;est réciproque, c&apos;est
          révélé. Sinon, ça reste ton secret.
        </p>

        {/* Compteur live (preuve sociale) */}
        {count !== null && (
          <p className="mt-4 flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-semibold">
            {count > 0 ? (
              <>
                <span className="text-[#FF5C8A]">🔥</span>
                Déjà <span className="wlm-gradient-text">{count.toLocaleString("fr-FR")}</span>{" "}
                {count <= 1 ? "inscrit" : "inscrits"}
              </>
            ) : (
              <>✨ Sois parmi les tout premiers</>
            )}
          </p>
        )}

        {/* Comment ça marche */}
        <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="wlm-glass rounded-2xl p-4 text-center">
              <div className="text-2xl">{s.emoji}</div>
              <p className="mt-1 font-semibold">{s.title}</p>
              <p className="mt-1 text-xs text-white/60">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Carte formulaire / succès */}
        <div className="wlm-card mt-8 w-full p-6">
          {!done ? (
            <>
              <h2 className="text-center text-xl font-bold">Rejoins les premiers testeurs</h2>
              <ul className="mt-4 space-y-2">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-[#FF5C8A]">✓</span> {p}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ton prénom"
                  className="rounded-lg bg-white/10 px-3 py-3 text-white outline-none placeholder:text-white/40"
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ta ville"
                  className="rounded-lg bg-white/10 px-3 py-3 text-white outline-none placeholder:text-white/40"
                />
                <div className="wlm-phone-input rounded-lg bg-white/10 px-3 py-3">
                  <PhoneInput
                    international
                    defaultCountry="BJ"
                    placeholder="Ton numéro WhatsApp"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>

                {error && <p className="text-center text-sm text-[#FF5C8A]">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="wlm-btn-gradient wlm-glow rounded-xl py-3 font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Envoi…" : "Devenir bêta-testeur"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="text-4xl">🎉</div>
              <h2 className="mt-2 text-xl font-bold">Bienvenue dans la bêta !</h2>
              {GROUP_URL ? (
                <>
                  <p className="mt-2 text-sm text-white/70">
                    <strong className="text-white">Dernière étape</strong> : rejoins le groupe
                    WhatsApp. C&apos;est là qu&apos;on annonce le lancement et tes avantages.
                  </p>
                  <a
                    href={GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wlm-btn-gradient wlm-glow mt-5 inline-block w-full rounded-xl py-3 font-semibold text-white transition hover:brightness-110 active:scale-95"
                  >
                    Rejoindre le groupe WhatsApp
                  </a>
                </>
              ) : (
                <p className="mt-2 text-sm text-white/70">
                  C&apos;est noté ! On te préviendra sur <strong className="text-white">WhatsApp</strong>{" "}
                  dès le lancement 💬
                </p>
              )}

              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-xs text-white/60">Fais découvrir WLM à tes amis 👀</p>
                <button
                  onClick={handleShare}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10 active:scale-95"
                >
                  📲 Partager
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rejoindre directement le groupe */}
        {GROUP_URL && !done && (
          <div className="mt-5 text-center">
            <p className="text-xs text-white/50">Tu préfères rejoindre directement le groupe ?</p>
            <a
              href={GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-[#25D366] hover:underline"
            >
              Rejoindre le groupe WhatsApp 👉
            </a>
          </div>
        )}

        <p className="mt-auto pt-8 text-center text-xs text-white/40">
          🔒 100% secret · gratuit pour commencer · ton numéro reste privé
        </p>
      </main>
    </div>
  );
}
