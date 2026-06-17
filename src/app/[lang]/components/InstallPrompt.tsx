"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Share } from "lucide-react";
import { useTranslation } from "@/lib/i18n/I18nProvider";

// Évènement Chrome/Android non typé par défaut
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "wlm-install-dismissed";
const DISMISS_DAYS = 14;

function recentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Déjà installée (PWA en mode standalone) → ne rien afficher
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Uniquement mobile / tablette
    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
    if (!isSmallScreen) return;

    if (recentlyDismissed()) return;

    // iOS Safari ne déclenche pas beforeinstallprompt → on guide manuellement
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    // Sur iOS, l'install n'est possible que dans Safari
    const isSafari = ios && !/crios|fxios|edgios/.test(ua);
    if (ios) {
      if (isSafari) {
        setIsIOS(true);
        setVisible(true);
      }
      return;
    }

    // Android / Chrome / Edge
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // Si l'app vient d'être installée, on masque
    const onInstalled = () => {
      setVisible(false);
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {}
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    setShowIOSHelp(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pointer-events-none">
      <div className="wlm-glass pointer-events-auto mx-auto max-w-md rounded-3xl border border-white/15 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <Image
            src="/icon.svg"
            alt="WLM"
            width={44}
            height={44}
            className="h-11 w-11 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">{t.install.title}</p>
            <p className="mt-0.5 text-sm text-white/60">
              {t.install.desc}
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label={t.install.close}
            className="flex-shrink-0 rounded-full p-1 text-white/40 transition hover:text-white/80"
          >
            <X size={18} />
          </button>
        </div>

        {showIOSHelp ? (
          <div className="mt-3 rounded-2xl bg-white/5 p-3 text-sm text-white/80">
            <p className="flex items-center gap-2">
              1. {t.install.iosStep1}
              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5">
                <Share size={15} /> {t.install.iosShare}
              </span>
            </p>
            <p className="mt-2">
              2. {t.install.iosStep2} <span className="font-semibold text-white">{t.install.iosOption}</span>
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="wlm-btn-gradient wlm-glow flex-1 rounded-xl py-2.5 font-semibold text-white transition hover:brightness-110 active:scale-95"
            >
              {t.install.install}
            </button>
            <button
              onClick={dismiss}
              className="rounded-xl px-4 py-2.5 text-sm text-white/60 transition hover:text-white"
            >
              {t.install.later}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
