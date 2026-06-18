"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { sendOtp, verifyOtp } from "@/lib/supabase/auth";
import { type Language } from "@/lib/i18n/setting";
import { useTranslation } from "@/lib/i18n/I18nProvider";

interface PhoneLoginProps {
  params: { lang: Language };
  onClose?: () => void;
}

type Step = "phone" | "code";

const PhoneLogin: React.FC<PhoneLoginProps> = ({ params, onClose }) => {
  const router = useRouter();
  const { t, format } = useTranslation();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState<string | undefined>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || !isValidPhoneNumber(phone)) {
      setError(t.auth.invalidPhone);
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep("code");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.auth.sendError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone || code.trim().length < 4) {
      setError(t.auth.enterCode);
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, code.trim());
      router.push(`/${params.lang}/feed`);
      router.refresh();
    } catch {
      setError(t.auth.verifyError);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    setError(null);
    setLoading(true);
    try {
      await sendOtp(phone);
    } catch {
      setError(t.auth.resendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wlm-modal p-6 rounded-3xl w-full max-w-sm mx-auto flex flex-col items-center text-white max-h-[90dvh] overflow-y-auto">
      <div className="mb-6 flex items-center gap-2">
        <Image src="/icon.svg" alt="WLM" width={36} height={36} className="h-9 w-9" priority />
        <span className="text-2xl font-extrabold wlm-gradient-text tracking-tight">WLM</span>
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="w-full flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">{t.auth.title}</h2>
            <p className="text-sm text-white/60 mt-1">
              {t.auth.desc}
            </p>
          </div>

          <div className="wlm-phone-input bg-white/10 rounded-lg px-3 py-3">
            <PhoneInput
              international
              defaultCountry="BJ"
              placeholder={t.auth.phonePlaceholder}
              value={phone}
              onChange={setPhone}
            />
          </div>

          {error && <p className="text-sm text-[#FF5C8A] text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="wlm-btn-gradient wlm-glow hover:brightness-110 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {loading ? t.auth.sending : t.auth.getCode}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold">{t.auth.codeTitle}</h2>
            <p className="text-sm text-white/60 mt-1">
              {format(t.auth.codeDesc, { phone: phone ?? "" })}
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
            {loading ? t.auth.verifying : t.auth.login}
          </button>

          <div className="flex items-center justify-between text-xs text-white/60">
            <button type="button" onClick={() => setStep("phone")}>
              {t.auth.changeNumber}
            </button>
            <button type="button" onClick={handleResend} disabled={loading}>
              {t.auth.resend}
            </button>
          </div>
        </form>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-6 text-xs text-white/40 hover:text-white/70"
        >
          {t.auth.close}
        </button>
      )}
    </div>
  );
};

export default PhoneLogin;
