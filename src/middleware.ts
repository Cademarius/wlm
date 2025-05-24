import { NextRequest, NextResponse } from 'next/server';
import { languages } from '@/lib/i18n/setting';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ne pas rediriger les fichiers statiques
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // fichier avec extension → image, json, png, etc.
  ) {
    return NextResponse.next();
  }

  // Redirection vers une locale si absente
  const isMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (isMissingLocale) {
    const acceptLang = request.headers.get('accept-language') || '';
    const detectedLang = acceptLang.startsWith('fr') ? 'fr' : 'en';

    const newUrl = new URL(`/${detectedLang}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // on cible toutes les routes sauf les fichiers statiques (avec extension) et les assets Next.js
    '/((?!_next|favicon.ico|.*\\..*$).*)',
  ],
};
