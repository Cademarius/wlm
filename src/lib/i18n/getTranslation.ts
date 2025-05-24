import fr from './locales/fr.json';
import en from './locales/en.json';
import { type Language } from './setting';

const translations = {
  fr,
  en,
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
