"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { sendOtp, verifyOtp, type OtpChannel } from "@/lib/supabase/auth";
import { type Language } from "@/lib/i18n/setting";

interface PhoneLoginProps {
  params: { lang: Language };
  onClose?: () => void;
}

type Step = "phone" | "code";

const PhoneLogin: React.FC<PhoneLoginProps> = ({ params, onClose }) => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState<string | undefined>();
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState<OtpChannel>("whatsapp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Entre un numéro de téléphone valide.");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone, channel);
      setStep("code");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le code. Réessaie."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || code.trim().length < 4) {
      setError("Entre le code reçu.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, code.trim());
      router.push(`/${params.lang}/feed`);
      router.refresh();
    } catch {
      setError("Code incorrect ou expiré. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    setError(null);
    setLoading(true);
    try {
      await sendOtp(phone, channel);
    } catch {
      setError("Échec du renvoi du code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wlm-modal p-6 rounded-3xl w-full max-w-sm mx-auto flex flex-col items-center text-white max-h-[90dvh] overflow-y-auto">
      <div className="mb-6">
        <Image
          src="/images/branding/wholikeme-desktop-logo.webp"
          alt="WLM"
          width={140}
          height={54}
          priority
        />
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="w-full flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Découvre qui t&apos;aime en secret</h2>
            <p className="text-sm text-white/60 mt-1">
              Entre ton numéro pour recevoir un code de connexion.
            </p>
          </div>

          <div className="wlm-phone-input bg-white/10 rounded-lg px-3 py-3">
            <PhoneInput
              international
              defaultCountry="BJ"
              placeholder="Ton numéro de téléphone"
              value={phone}
              onChange={setPhone}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`px-4 py-1.5 rounded-full transition ${
                channel === "whatsapp"
                  ? "wlm-btn-gradient text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setChannel("sms")}
              className={`px-4 py-1.5 rounded-full transition ${
                channel === "sms"
                  ? "wlm-btn-gradient text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              SMS
            </button>
          </div>

          {error && <p className="text-sm text-[#FF5C8A] text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="wlm-btn-gradient wlm-glow hover:brightness-110 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {loading ? "Envoi…" : "Recevoir mon code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Entre ton code</h2>
            <p className="text-sm text-white/60 mt-1">
              Envoyé {channel === "whatsapp" ? "sur WhatsApp" : "par SMS"} au{" "}
              <span className="text-white">{phone}</span>
            </p>
          </div>

          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="• • • • • •"
            className="bg-white/10 rounded-lg px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none"
          />

          {error && <p className="text-sm text-[#FF5C8A] text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="wlm-btn-gradient wlm-glow hover:brightness-110 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {loading ? "Vérification…" : "Se connecter"}
          </button>

          <div className="flex items-center justify-between text-xs text-white/60">
            <button type="button" onClick={() => setStep("phone")}>
              ← Changer de numéro
            </button>
            <button type="button" onClick={handleResend} disabled={loading}>
              Renvoyer le code
            </button>
          </div>
        </form>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-6 text-xs text-white/40 hover:text-white/70"
        >
          Fermer
        </button>
      )}
    </div>
  );
};

export default PhoneLogin;
