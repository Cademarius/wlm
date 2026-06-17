import AppChrome from './components/AppChrome';
import ProfileSetup from './components/ProfileSetup';
import { type Language } from '@/lib/i18n/setting';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <AppChrome lang={lang as Language}>{children}</AppChrome>
      <ProfileSetup />
    </>
  );
}
