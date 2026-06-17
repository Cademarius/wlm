"use client";

/**
 * Helper client pour ouvrir le widget de paiement KkiaPay (Mobile Money Bénin)
 * et attendre le résultat. On charge le script CDN une seule fois.
 *
 * Env : NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY, (option) NEXT_PUBLIC_KKIAPAY_SANDBOX=1
 */

const SCRIPT_SRC = "https://cdn.kkiapay.me/k.js";

interface KkiapayWindow {
  openKkiapayWidget: (opts: Record<string, unknown>) => void;
  addKkiapayListener: (event: string, cb: (resp: { transactionId: string }) => void) => void;
  removeKkiapayListener?: (event: string, cb: (resp: unknown) => void) => void;
}

function kk(): KkiapayWindow {
  return window as unknown as KkiapayWindow;
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof kk().openKkiapayWidget === "function") return resolve();
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Échec du chargement de KkiaPay"));
    document.body.appendChild(s);
  });
  return scriptPromise;
}

export interface KkiapayOpenOptions {
  amount: number;
  phone?: string;
  name?: string;
}

/** Ouvre le widget et résout avec le transactionId en cas de succès. */
export async function openKkiapay(
  opts: KkiapayOpenOptions
): Promise<{ transactionId: string }> {
  await loadScript();

  return new Promise((resolve, reject) => {
    const onSuccess = (resp: { transactionId: string }) => {
      cleanup();
      resolve({ transactionId: resp.transactionId });
    };
    const onFail = () => {
      cleanup();
      reject(new Error("Paiement échoué ou annulé"));
    };
    function cleanup() {
      kk().removeKkiapayListener?.("success", onSuccess as (r: unknown) => void);
      kk().removeKkiapayListener?.("failed", onFail as (r: unknown) => void);
    }

    kk().addKkiapayListener("success", onSuccess);
    kk().addKkiapayListener("failed", onFail);

    kk().openKkiapayWidget({
      amount: opts.amount,
      key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
      sandbox: process.env.NEXT_PUBLIC_KKIAPAY_SANDBOX === "1",
      phone: opts.phone,
      name: opts.name,
    });
  });
}
