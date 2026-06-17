"use client";

import { createContext, useContext, useEffect } from "react";
import { getTranslation } from "./getTranslation";
import { type Language } from "./setting";

type Dict = ReturnType<typeof getTranslation>;

interface I18nContextValue {
  lang: Language;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) {
  const t = getTranslation(lang);
  // Les pages sont générées en SSG : le <html lang> initial vaut la locale par
  // défaut. On le corrige côté client selon la locale active (accessibilité).
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  return <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>;
}

/**
 * Hook de traduction côté client.
 * `t` = dictionnaire de la langue courante, `lang` = locale active.
 * `format` interpole les variables `{{clé}}` dans un gabarit.
 */
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback de sécurité (composant monté hors provider) : on retombe sur le FR.
    const lang: Language = "fr";
    return { lang, t: getTranslation(lang), format };
  }
  return { ...ctx, format };
}

/** Remplace les `{{clé}}` d'un gabarit par les valeurs fournies. */
export function format(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{{${key}}}`
  );
}
