import type { Metadata } from 'next';
import AppChrome from './components/AppChrome';
import ProfileSetup from './components/ProfileSetup';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { languages, defaultLang, type Language } from '@/lib/i18n/setting';

const META: Record<Language, { title: string; description: string }> = {
  fr: {
    title: "WLM — Qui t'aime en secret ?",
    description:
      "Ajoute en secret les personnes que tu aimes. Si c'est réciproque, c'est révélé 💘 Sinon, ça reste ton secret.",
  },
  en: {
    title: 'WLM — Who secretly loves you?',
    description:
      "Secretly add the people you love. If it's mutual, it's revealed 💘 Otherwise, it stays your secret.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (languages.includes(lang as Language) ? lang : defaultLang) as Language;
  const m = META[locale];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: { title: m.title, description: m.description },
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', en: '/en' },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <I18nProvider lang={lang as Language}>
      <AppChrome lang={lang as Language}>{children}</AppChrome>
      <ProfileSetup />
    </I18nProvider>
  );
}
