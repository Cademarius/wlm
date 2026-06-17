"use client";

import React, { useState } from "react";
import { Lock, Venus, Type, MapPin, Loader2 } from "lucide-react";
import { openKkiapay } from "@/lib/kkiapayClient";
import { HINT_PRICES, type HintType } from "@/lib/products";
import { useTranslation } from "@/lib/i18n/I18nProvider";

export interface AdmirerHints {
  gender?: string | null;
  initial?: string | null;
  city?: string | null;
}

export interface AdmirerData {
  id: string; // = crush_id de l'admirateur
  status: string;
  hints: AdmirerHints;
  unlocked: string[];
}

interface AdmirerCardProps {
  admirer: AdmirerData;
  currentUserId: string;
  onChanged?: () => void;
}

const HINT_ICON: Record<HintType, React.ReactNode> = {
  gender: <Venus size={15} />,
  initial: <Type size={15} />,
  city: <MapPin size={15} />,
};

const AdmirerCard: React.FC<AdmirerCardProps> = ({
  admirer,
  currentUserId,
  onChanged,
}) => {
  const { t, format } = useTranslation();
  const [buying, setBuying] = useState<HintType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Placeholders flous (teaser) — la vraie valeur n'arrive qu'après paiement
  const HINT_PLACEHOLDER: Record<HintType, string> = {
    gender: t.admirerCard.hintFemale,
    initial: t.admirerCard.hintInitial,
    city: t.admirerCard.hintCity,
  };

  // Libellés des indices (traduits)
  const hintLabel: Record<HintType, string> = {
    gender: t.admirerCard.hintLabelGender,
    initial: t.admirerCard.hintLabelInitial,
    city: t.admirerCard.hintLabelCity,
  };

  const genderLabel = (g?: string | null): string => {
    if (g === "male") return t.admirerCard.genderMale;
    if (g === "female") return t.admirerCard.genderFemale;
    if (g === "other") return t.admirerCard.genderOther;
    return t.admirerCard.genderUnknown;
  };

  const isUnlocked = (h: HintType) =>
    admirer.unlocked.includes(h) || admirer.hints[h] !== undefined;

  const revealed = (h: HintType): string | null => {
    if (!isUnlocked(h)) return null;
    if (h === "gender") return genderLabel(admirer.hints.gender);
    if (h === "initial") return admirer.hints.initial ?? "—";
    if (h === "city") return admirer.hints.city ?? "—";
    return null;
  };

  const buyHint = async (hintType: HintType) => {
    setError(null);
    setBuying(hintType);
    try {
      const { transactionId } = await openKkiapay({ amount: HINT_PRICES[hintType] });
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          transactionId,
          product: "hint",
          hintType,
          crushId: admirer.id,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Paiement non validé");
      }
      onChanged?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de paiement");
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="wlm-card p-6 flex flex-col gap-4">
      {/* Teaser flouté */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl wlm-btn-gradient flex items-center justify-center shrink-0">
          <Lock className="text-white" size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-lg leading-tight">
            {t.admirerCard.teaserTitle}
          </p>
          <p className="text-white/50 text-sm">{t.admirerCard.teaserSubtitle}</p>
        </div>
      </div>

      {/* Indices : valeur floutée (teaser) → se révèle au paiement */}
      <div className="flex flex-col gap-2">
        {(Object.keys(HINT_PRICES) as HintType[]).map((h) => {
          const value = revealed(h);
          const unlocked = value !== null;
          return (
            <div
              key={h}
              className="flex items-center justify-between gap-3 bg-white/5 rounded-xl px-3 py-2.5"
            >
              <span className="flex items-center gap-2 text-white/70 text-sm shrink-0">
                {HINT_ICON[h]} {hintLabel[h]}
              </span>

              {unlocked ? (
                <span className="text-[#FF5C8A] font-bold text-sm">{value}</span>
              ) : (
                <button
                  onClick={() => buyHint(h)}
                  disabled={buying !== null}
                  className="group flex items-center gap-2 disabled:opacity-60"
                  aria-label={format(t.admirerCard.unlockAria, { hint: hintLabel[h] })}
                >
                  {/* vraie-fausse valeur floutée pour donner envie */}
                  <span className="blur-[5px] select-none text-white/85 text-sm font-medium">
                    {HINT_PLACEHOLDER[h]}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-white wlm-btn-gradient px-2.5 py-1 rounded-full group-hover:brightness-110 transition">
                    {buying === h ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <>
                        <Lock size={11} /> {HINT_PRICES[h]} F
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-[#FF5C8A] text-xs">{error}</p>}

      <p className="text-white/40 text-xs pt-1 border-t border-white/10 leading-relaxed">
        {t.admirerCard.reciprocalHint}
      </p>
    </div>
  );
};

export default AdmirerCard;
