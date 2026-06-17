import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next"

const mulish = localFont({
  src: [
    { path: "../../fonts/Mulish-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Mulish-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Mulish-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/Mulish-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../fonts/Mulish-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
});
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../../src/globals.css";
import ServiceWorkerWrapper from "@/app/[lang]/components/ServiceWorkerWrapper";
import InstallPrompt from "@/app/[lang]/components/InstallPrompt";
import SessionProvider from "@/app/[lang]/components/SessionProvider";
import AuthGuard from "@/app/[lang]/components/AuthGuard";
import { languages, defaultLang, type Language } from '@/lib/i18n/setting';
import { notFound } from 'next/navigation';

// Génération des paramètres statiques pour i18n
export function generateStaticParams(): { lang: Language }[] {
  return languages.map((lang) => ({ lang }));
}

// Configuration des métadonnées
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://wholikeme.app'),
  title: {
    default: "WLM — Qui t'aime en secret ?",
    template: "%s | WLM",
  },
  description:
    "Ajoute en secret les personnes que tu aimes. Si c'est réciproque, c'est révélé 💘 Sinon, ça reste ton secret.",
  keywords: [
    "aime en secret",
    "amour réciproque",
    "match réciproque",
    "discrétion",
    "Bénin",
    "Afrique francophone",
    "WLM",
    "secret crush",
    "secretly loves you",
  ],
  authors: [{ name: "WLM" }],
  openGraph: {
    type: "website",
    siteName: "WLM",
    title: "WLM — Qui t'aime en secret ?",
    description:
      "Ajoute en secret les personnes que tu aimes. Si c'est réciproque, c'est révélé 💘 Sinon, ça reste ton secret.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "WLM — qui t'aime en secret",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WLM — Qui t'aime en secret ?",
    description:
      "Ajoute en secret les personnes que tu aimes. Si c'est réciproque, c'est révélé 💘",
    images: ["/og-image.webp"],
  },
  manifest: "/manifest.json",
  robots: "index, follow",
};

// Configuration du viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // gère les encoches / safe-areas (PWA plein écran)
  themeColor: "#1a1033", // barre d'état assortie au fond sombre
};
interface RootLayoutProps {
  children: React.ReactNode;
  // Next's LayoutProps provide params as a Promise or it may be undefined.
  params: Promise<{ lang: Language }> | undefined;
}

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  // Resolve params (may be undefined in some contexts)
  const resolvedParams = params ? (await params) : undefined;
  if (resolvedParams?.lang && !languages.includes(resolvedParams.lang)) {
    notFound();
  }
  // Le layout racine ne reçoit pas le param de segment enfant `[lang]`.
  // Les pages étant générées en SSG, on pose la locale par défaut ici et
  // l'I18nProvider corrige <html lang> côté client selon la locale active.
  const lang: Language = resolvedParams?.lang || defaultLang;

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        {/* Theme color pour tous les navigateurs et PWA */}
        <meta name="msapplication-TileColor" content="#1a1033" />
        <meta name="msapplication-navbutton-color" content="#1a1033" />
        {/* Apple iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${mulish.className} min-h-screen antialiased`}>
        <SessionProvider>
          <AuthGuard>
            <main className="relative flex min-h-screen flex-col">
              {children}
            </main>
          </AuthGuard>
          <ServiceWorkerWrapper />
          <InstallPrompt />
          <Analytics />
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}