import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../../src/globals.css";
import ServiceWorkerWrapper from "@/app/[lang]/components/ServiceWorkerWrapper";
import SessionProvider from "@/app/[lang]/components/SessionProvider";
import AuthGuard from "@/app/[lang]/components/AuthGuard";
import { languages, type Language } from '@/lib/i18n/setting';
import { notFound } from 'next/navigation';

// Génération des paramètres statiques pour i18n
export function generateStaticParams(): { lang: Language }[] {
  return languages.map((lang) => ({ lang }));
}

// Configuration des métadonnées
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://wholikeme.app'),
  title: {
    default: "WhoLikeMe - Qui t'aime en secret ? Découvre-le.",
    template: "%s | WhoLikeMe",
  },
  description:
    "WhoLikeMe est une application sociale pour découvrir si ton crush t'aime en retour. Ajoute ton crush en toute discrétion, s'il te crush aussi c'est un match. Sinon, vois ceux qui t'aiment en secret.",
  keywords: [
    "crush secret",
    "application de rencontre",
    "match réciproque",
    "crush en retour",
    "rencontres jeunes",
    "réseau social amoureux",
    "discrétion",
    "match love",
    "Afrique francophone",
    "Europe francophone",
    "app dating 2025",
    "crush match app",
    "WLM",
    "WhoLikeMe",
  ],
  authors: [{ name: "WLM - WhoLikeMe Team" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "WhoLikeMe",
    title: "Découvre si ton crush t'aime aussi - WhoLikeMe",
    description:
      "Ajoute ton crush de manière anonyme. Si c'est réciproque, c'est un match et vous êtes notifiés. Sinon, vois ceux qui t'aiment en secret.",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "WhoLikeMe - Application de crush secret",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajoute ton crush. Si c'est réciproque, c'est un match 💘",
    description:
      "WhoLikeMe t'aide à découvrir en toute discrétion qui te crush. Match réciproque ou secret flouté. L'amour sans pression.",
    creator: "@wholikeme",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1F3F" },
  ],
};

// Interface pour les props du layout avec support i18n
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Language }>;
}

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  // Attendre la résolution des paramètres
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'fr'; // fallback vers 'fr' si pas de paramètre
  
  // Vérification que la langue est supportée
  if (resolvedParams?.lang && !languages.includes(resolvedParams.lang)) {
    notFound();
  }

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f3336d" />
        <link rel="apple-touch-icon" href="/images/icons/icon.png" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <SessionProvider>
          <AuthGuard>
            <main className="relative flex min-h-screen flex-col">
              {children}
            </main>
          </AuthGuard>
          <ServiceWorkerWrapper />
          <Analytics />
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}