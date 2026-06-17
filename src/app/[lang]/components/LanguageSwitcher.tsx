"use client";

import { usePathname, useRouter } from "next/navigation";
import { languages, type Language } from "@/lib/i18n/setting";
import { useTranslation } from "@/lib/i18n/I18nProvider";

/**
 * Bascule de langue : remplace le segment de locale dans l'URL courante.
 * Compact (FR | EN), pensé pour le header desktop et mobile.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { lang } = useTranslation();

  const switchTo = (target: Language) => {
    if (target === lang) return;
    const segments = pathname.split("/");
    // segments[0] = "" (chaîne avant le 1er "/"), segments[1] = locale
    if (languages.includes(segments[1] as Language)) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    router.push(segments.join("/") || `/${target}`);
  };

  return (
    <div
      className={`flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Langue / Language"
    >
      {languages.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={l === lang}
          className={`rounded-full px-2.5 py-1 uppercase transition ${
            l === lang
              ? "wlm-btn-gradient text-white"
              : "text-white/55 hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
