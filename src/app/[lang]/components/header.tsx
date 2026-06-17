"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Home, HeartTick, ProfileCircle } from "iconsax-react";
import { type Language } from "@/lib/i18n/setting";
import UserProfileButton from "./UserProfileButton";
import LoginModal from "./login";
import { useAuth } from "./AuthGuard";
import NotificationBell from "./NotificationBell";
import { defaultAvatar } from "@/lib/avatar";

type HeaderProps = {
  lang: Language;
};

const Header = ({ lang }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const userImage = user?.image;
  const userName = user?.name;

  const NAV_LINKS = [
    { id: "accueil", label: "Accueil", href: `/${lang}/feed`, icon: Home },
    { id: "secrets", label: "Secrets", href: `/${lang}/addcrush`, icon: HeartTick },
    { id: "admirateurs", label: "Admirateurs", href: `/${lang}/matchcrush`, icon: ProfileCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-14 sm:h-16 md:h-[72px] xl:h-20 px-4 sm:px-6 xl:px-12 flex items-center justify-between border-b border-white/10 bg-[#1a1033]/40 backdrop-blur-xl backdrop-saturate-150">
        {/* Logo */}
        <Link
          href={`/${lang}/feed`}
          className="flex items-center gap-2 flex-shrink-0 active:scale-95 transition-transform duration-150"
          aria-label="WLM"
        >
          <Image
            src="/icon.svg"
            alt="WLM"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-9 sm:w-9"
            priority
          />
          <span className="text-xl sm:text-2xl font-extrabold wlm-gradient-text tracking-tight">
            WLM
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden xl:flex gap-8 flex-1 justify-center max-w-3xl">
          {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
            <Link key={id} href={href} className="cursor-pointer">
              <span
                className={`flex items-center gap-2 text-lg font-medium transition-all duration-300 px-4 py-2 rounded-full whitespace-nowrap ${
                  pathname === href
                    ? "text-[#FF5C8A] bg-[#FF5C8A]/10"
                    : "text-white hover:text-[#FF5C8A] hover:bg-white/5"
                }`}
              >
                <Icon
                  size={24}
                  variant={pathname === href ? "Bold" : "Linear"}
                  color={pathname === href ? "#FF5C8A" : "white"}
                />
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Contrôles desktop */}
        <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
          <NotificationBell />
          <UserProfileButton
            onLoginClick={() => setShowLoginModal(true)}
            userImage={userImage}
            userName={userName}
          />
        </div>

        {/* Contrôles mobile/tablette */}
        <div className="flex items-center gap-3 xl:hidden">
          <NotificationBell />
          <button
            onClick={() => {
              if (!isAuthenticated) setShowLoginModal(true);
              else router.push(`/${lang}/profile`);
            }}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FF5C8A]/60 active:scale-90 transition shrink-0"
            aria-label="Mon profil"
          >
            <Image
              src={userImage || defaultAvatar(user?.profile?.gender)}
              alt={userName || "Profil"}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </button>
        </div>
      </header>

      <LoginModal
        showLoginModal={showLoginModal}
        handleCloseLoginModal={() => setShowLoginModal(false)}
        params={{ lang }}
      />
    </>
  );
};

export default Header;
