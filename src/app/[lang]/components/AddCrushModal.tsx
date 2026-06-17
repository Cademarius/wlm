"use client";

import React, { useState, useEffect } from "react";
import { X, Heart, Loader2 } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Toast from "./Toast";
import { useToast } from "@/hooks/useToast";
import { useParams } from "next/navigation";
import { getTranslation } from "@/lib/i18n/getTranslation";
import { openKkiapay } from "@/lib/kkiapayClient";
import { SLOTS_PACK } from "@/lib/products";

interface AddCrushModalProps {
  showModal: boolean;
  handleClose: () => void;
  currentUserId: string;
  onCrushAdded?: () => void;
  existingPhones?: string[];
}

const AddCrushModal: React.FC<AddCrushModalProps> = ({
  showModal,
  handleClose,
  currentUserId,
  onCrushAdded,
  existingPhones = [],
}) => {
  const { toast, success, error: showError, hideToast } = useToast();
  const params = useParams();
  const lang = (params.lang as string) || "fr";
  const t = getTranslation(lang as "fr" | "en");

  const [phone, setPhone] = useState<string | undefined>();
  const [label, setLabel] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [buyingSlots, setBuyingSlots] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) handleClose();
    };
    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal, handleClose]);

  const resetAndClose = () => {
    setPhone(undefined);
    setLabel("");
    handleClose();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !isValidPhoneNumber(phone)) {
      showError("Entre un numéro de téléphone valide.");
      return;
    }
    if (existingPhones.includes(phone)) {
      showError("Tu as déjà ajouté ce numéro.");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch("/api/add-crush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          crushPhone: phone,
          crushLabel: label.trim() || undefined,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.match) {
          success("💘 C'est réciproque !");
        } else {
          success("Ajouté en secret 🤫");
        }
        onCrushAdded?.();
        window.dispatchEvent(new Event("refreshNotifications"));
        resetAndClose();
      } else if (response.status === 402) {
        setLimitReached(true);
        showError(
          "Tu as atteint ta limite. Débloque plus de places pour aimer en secret."
        );
      } else {
        showError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Error adding crush:", err);
      showError("Une erreur est survenue.");
    } finally {
      setIsAdding(false);
    }
  };

  const buySlots = async () => {
    setBuyingSlots(true);
    try {
      const { transactionId } = await openKkiapay({ amount: SLOTS_PACK.amount });
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          transactionId,
          product: "slots",
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Paiement non validé");
      }
      success(`+${SLOTS_PACK.slots} places débloquées 🎉`);
      setLimitReached(false);
    } catch (e) {
      showError(e instanceof Error ? e.message : "Erreur de paiement");
    } finally {
      setBuyingSlots(false);
    }
  };

  if (!showModal) return null;

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4"
        onClick={resetAndClose}
      >
        <div
          className="wlm-modal rounded-3xl w-full max-w-md flex flex-col max-h-[90dvh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-white font-bold text-xl flex items-center gap-3">
              <div className="bg-[#FF4F81]/20 p-2 rounded-xl">
                <Heart className="text-[#FF4F81]" size={22} />
              </div>
              Ajoute quelqu&apos;un que tu aimes en secret
            </h2>
            <button
              onClick={resetAndClose}
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded-full p-2"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAdd} className="p-6 flex flex-col gap-5">
            <p className="text-white/60 text-sm">
              Entre son numéro de téléphone. C&apos;est <strong>100% secret</strong> :
              il ne saura jamais que c&apos;est toi, sauf si lui aussi t&apos;aime en
              secret 💘
            </p>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Son numéro
              </label>
              <div className="wlm-phone-input bg-white/10 rounded-lg px-3 py-3">
                <PhoneInput
                  international
                  defaultCountry="BJ"
                  placeholder="Numéro de la personne"
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Un surnom pour t&apos;y retrouver{" "}
                <span className="text-white/40">(optionnel, privé)</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={40}
                placeholder="Ex: la fille du cours de maths"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81]"
              />
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="bg-gradient-to-r from-[#FF4F81] to-[#FF3D6D] hover:from-[#FF3D6D] hover:to-[#FF2B59] text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              {isAdding ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Ajout…
                </>
              ) : (
                <>
                  <Heart size={18} /> {t.addcrush.addButton}
                </>
              )}
            </button>

            {limitReached && (
              <button
                type="button"
                onClick={buySlots}
                disabled={buyingSlots}
                className="border border-[#FF4F81]/50 text-[#FF4F81] hover:bg-[#FF4F81]/10 py-3 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {buyingSlots ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Paiement…
                  </>
                ) : (
                  <>
                    Débloquer +{SLOTS_PACK.slots} places · {SLOTS_PACK.amount} FCFA
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCrushModal;
