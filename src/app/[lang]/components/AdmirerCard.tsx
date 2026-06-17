"use client";

import React, { useState } from "react";
import { Lock, Heart, Venus, Type, MapPin, Loader2 } from "lucide-react";
import { openKkiapay } from "@/lib/kkiapayClient";
import { HINT_PRICES, HINT_LABELS, type HintType } from "@/lib/products";

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
  gender: <Venus size={16} />,
  initial: <Type size={16} />,
  city: <MapPin size={16} />,
};

function genderLabel(g?: string | null): string {
  if (g === "male") return "Un garçon";
  if (g === "female") return "Une fille";
  if (g === "other") return "Autre";
  return "—";
}

const AdmirerCard: React.FC<AdmirerCardProps> = ({
  admirer,
  currentUserId,
  onChanged,
}) => {
  const [buying, setBuying] = useState<HintType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isUnlocked = (h: HintType) =>
    admirer.unlocked.includes(h) || admirer.hints[h] !== undefined;

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

  const revealed = (h: HintType): string | null => {
    if (!isUnlocked(h)) return null;
    if (h === "gender") return genderLabel(admirer.hints.gender);
    if (h === "initial") return admirer.hints.initial ?? "—";
    if (h === "city") return admirer.hints.city ?? "—";
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] rounded-2xl p-6 border border-[#FF4F81]/20 flex flex-col gap-4">
      {/* Teaser flouté */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-2xl bg-[#FF4F81]/15 flex items-center justify-center">
          <Lock className="text-white/70" size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-lg">Quelqu&apos;un t&apos;aime en secret</p>
          <p className="text-white/50 text-sm">Découvre des indices 👇</p>
        </div>
      </div>

      {/* Indices */}
      <div className="flex flex-col gap-2">
        {(Object.keys(HINT_PRICES) as HintType[]).map((h) => {
          const value = revealed(h);
          return (
            <div
              key={h}
              className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
            >
              <span className="flex items-center gap-2 text-white/80 text-sm">
                {HINT_ICON[h]} {HINT_LABELS[h]}
              </span>
              {value !== null ? (
                <span className="text-[#FF4F81] font-semibold text-sm">{value}</span>
              ) : (
                <button
                  onClick={() => buyHint(h)}
                  disabled={buying !== null}
                  className="bg-[#FF4F81] hover:bg-[#e04370] text-white text-xs font-medium px-3 py-1.5 rounded-full transition disabled:opacity-50 flex items-center gap-1"
                >
                  {buying === h ? (
                    <Loader2 className="animate-spin" size={12} />
                  ) : (
                    <>Voir · {HINT_PRICES[h]} FCFA</>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-[#FF4F81] text-xs">{error}</p>}

      <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-white/40 text-xs">
        <Heart size={12} className="text-[#FF4F81]" />
        Ajoute-le/la en secret : si c&apos;est réciproque, tout se révèle 💘
      </div>
    </div>
  );
};

export default AdmirerCard;
