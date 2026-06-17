/**
 * Catalogue des produits payants WLM (montants en FCFA / XOF).
 * Source de vérité partagée client + serveur : le serveur revérifie le montant
 * payé contre ces valeurs avant d'accorder le produit (anti-fraude).
 */

export type HintType = "gender" | "initial" | "city";
export type ProductKind = "hint" | "slots" | "boost";

export const HINT_PRICES: Record<HintType, number> = {
  gender: 200,
  city: 500,
  initial: 1000,
};

// Pack de places supplémentaires pour aimer en secret
export const SLOTS_PACK = { amount: 500, slots: 5 };

// Relance d'un secret (re-pousser une cible non inscrite à s'inscrire)
export const BOOST_PRICE = 200;

/** Prix attendu pour un produit donné (sert à valider le paiement côté serveur). */
export function expectedAmount(
  product: ProductKind,
  hintType?: HintType
): number | null {
  if (product === "hint") {
    return hintType ? HINT_PRICES[hintType] : null;
  }
  if (product === "slots") return SLOTS_PACK.amount;
  if (product === "boost") return BOOST_PRICE;
  return null;
}
