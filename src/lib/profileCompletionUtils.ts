/**
 * Utilitaires pour gérer les champs de profil ignorés par l'utilisateur
 */

const IGNORED_FIELDS_KEY = "profile_ignored_fields";

export type ProfileField = "age" | "location" | "bio" | "interests";

/**
 * Récupère la liste des champs ignorés
 */
export function getIgnoredFields(): ProfileField[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(IGNORED_FIELDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Ajoute un champ à la liste des champs ignorés
 */
export function addIgnoredField(field: ProfileField): void {
  if (typeof window === "undefined") return;
  
  const ignored = getIgnoredFields();
  if (!ignored.includes(field)) {
    ignored.push(field);
    localStorage.setItem(IGNORED_FIELDS_KEY, JSON.stringify(ignored));
  }
}

/**
 * Retire un champ de la liste des champs ignorés
 */
export function removeIgnoredField(field: ProfileField): void {
  if (typeof window === "undefined") return;
  
  const ignored = getIgnoredFields();
  const filtered = ignored.filter((f) => f !== field);
  localStorage.setItem(IGNORED_FIELDS_KEY, JSON.stringify(filtered));
}

/**
 * Vérifie si un champ est ignoré
 */
export function isFieldIgnored(field: ProfileField): boolean {
  return getIgnoredFields().includes(field);
}

/**
 * Réinitialise tous les champs ignorés
 */
export function resetIgnoredFields(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(IGNORED_FIELDS_KEY);
}

/**
 * Réinitialise également le flag de complétion pour réafficher le modal
 */
export function resetProfileCompletion(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("profile_completion_shown");
  resetIgnoredFields();
}
