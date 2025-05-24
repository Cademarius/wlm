export const languages = ['fr', 'en'] as const;
export const defaultLang = 'fr';
export type Language = typeof languages[number];
