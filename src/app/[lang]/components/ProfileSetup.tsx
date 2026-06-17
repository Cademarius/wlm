"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/AuthProvider";

const GENDERS = [
  { value: "female", label: "Femme" },
  { value: "male", label: "Homme" },
  { value: "other", label: "Autre" },
];

/**
 * Invitation LÉGÈRE et NON bloquante à compléter le minimum utile :
 * prénom + genre + ville (révélation au match + indices payants).
 * L'utilisateur peut fermer avec « Plus tard ».
 */
export default function ProfileSetup() {
  const { user, isAuthenticated, profile, refresh } = useAuth();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attendre que le profil soit réellement chargé (évite l'ouverture pendant le chargement)
    if (!isAuthenticated || !user || !profile) return;
    // Profil déjà complet → s'assurer que le modal est fermé et ne pas le rouvrir
    if (user.profileComplete) {
      setOpen(false);
      return;
    }
    if (dismissed) return;
    // Pas sur les pages profil (l'utilisateur peut déjà y éditer)
    if (pathname?.includes("/profile")) return;
    setOpen(true);
  }, [isAuthenticated, user, profile, pathname, dismissed]);

  // Pré-remplir si des valeurs existent déjà
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setGender(profile.gender ?? "");
      setLocation(profile.location ?? "");
    }
  }, [profile]);

  const dismiss = () => {
    // Masqué pour la visite en cours ; réapparaît au prochain chargement tant que le profil est incomplet.
    setDismissed(true);
    setOpen(false);
  };

  const save = async () => {
    setError(null);
    if (!name.trim() || !gender || !location.trim()) {
      setError("Renseigne ton prénom, ton genre et ta ville.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name: name.trim(),
          gender,
          location: location.trim(),
        }),
      });
      if (!res.ok) throw new Error("save failed");
      await refresh();
      setOpen(false);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="wlm-modal w-full max-w-sm rounded-3xl p-6 text-white max-h-[90dvh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-center">
          Complète ton profil en 10 secondes
        </h2>
        <p className="mt-1 text-center text-sm text-white/60">
          Juste 3 infos — pour révéler ton identité en cas de match 💘 et activer
          les indices.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-white/80">Prénom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="Ton prénom"
              className="w-full rounded-lg bg-white/10 px-4 py-3 placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FF5C8A]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Genre</label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                    gender === g.value
                      ? "bg-[#FF5C8A] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Ville</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={60}
              placeholder="Ex : Cotonou"
              className="w-full rounded-lg bg-white/10 px-4 py-3 placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FF5C8A]"
            />
          </div>

          {error && <p className="text-sm text-[#FF5C8A]">{error}</p>}

          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-[#FF5C8A] py-3 font-semibold transition hover:bg-[#e04370] disabled:opacity-50 active:scale-95"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            onClick={dismiss}
            className="text-sm text-white/50 hover:text-white/80"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
