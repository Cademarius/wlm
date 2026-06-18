"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import MobileNavBar from "./mobile-nav-bar";
import { type Language } from "@/lib/i18n/setting";

/**
 * Chrome de l'app (Header + barre de navigation mobile) rendu dans le LAYOUT
 * → il persiste entre les onglets (plus de remontage ni de refetch à chaque clic).
 * Masqué sur la landing (/[lang]) et l'admin.
 */
export default function AppChrome({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const isLanding = /^\/[a-zA-Z-]+\/?$/.test(pathname); // /fr ou /fr/
  const isAdmin = pathname.includes("/admin");
  const isBeta = pathname.includes("/beta"); // landing bêta autonome
  if (isLanding || isAdmin || isBeta) return <>{children}</>;

  let activePage = "";
  if (pathname.includes("/feed")) activePage = "feed";
  else if (pathname.includes("/addcrush")) activePage = "addcrush";
  else if (pathname.includes("/matchcrush")) activePage = "matchcrush";
  else if (pathname.includes("/profile")) activePage = "profile";

  return (
    <>
      <Header lang={lang} />
      {children}
      <MobileNavBar className="block xl:hidden" activePage={activePage} params={{ lang }} />
    </>
  );
}
