/**
 * Vérification serveur d'un paiement KkiaPay (Mobile Money MTN/Moov Bénin).
 *
 * Le widget KkiaPay s'ouvre côté client et renvoie un `transactionId`.
 * On NE FAIT JAMAIS confiance au client : on revérifie ici le statut et le
 * montant auprès de l'API KkiaPay avant d'accorder quoi que ce soit.
 *
 * Env requis : KKIAPAY_PRIVATE_KEY, KKIAPAY_SECRET,
 *              NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY, (option) KKIAPAY_SANDBOX=1
 */

export interface KkiapayVerification {
  ok: boolean;
  status?: string;
  amount?: number;
  error?: string;
}

export async function verifyKkiapayTransaction(
  transactionId: string
): Promise<KkiapayVerification> {
  const publicKey = process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY;
  const privateKey = process.env.KKIAPAY_PRIVATE_KEY;
  const secret = process.env.KKIAPAY_SECRET;

  if (!publicKey || !privateKey || !secret) {
    return { ok: false, error: "KkiaPay non configuré" };
  }

  const base = process.env.KKIAPAY_SANDBOX
    ? "https://api-sandbox.kkiapay.me"
    : "https://api.kkiapay.me";

  try {
    const res = await fetch(`${base}/api/v1/transactions/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": publicKey,
        "x-private-key": privateKey,
        "x-secret-key": secret,
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }

    const data = (await res.json()) as { status?: string; amount?: number };
    const isSuccess = (data.status || "").toUpperCase() === "SUCCESS";

    return { ok: isSuccess, status: data.status, amount: data.amount };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}
