"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { 
  Menu, 
  SearchNormal, 
  CloseCircle, 
  Home, 
  HeartTick, 
  ProfileCircle 
} from "iconsax-react";
import { Search, X } from "lucide-react"; 
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import UserProfileButton from "./UserProfileButton";
import LoginModal from "./login";
import { useAuth } from "./AuthGuard";
import NotificationBell from "./NotificationBell";

type HeaderProps = {
  lang: Language;
};

const Header = ({ lang }: HeaderProps) => {
  const t = getTranslation(lang);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession(); // Écoute les changements de session
  const { user, isAuthenticated } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Utiliser l'image de la session si disponible (plus récente)
  const userImage = session?.user?.image || user?.image;
  const userName = session?.user?.name || user?.name;
  
  const NAV_LINKS = [
    { id: "mon-fil", label: t.header.navigation.myFeed, href: `/${lang}/feed`, icon: Home },
    { id: "mes-crushs", label: t.header.navigation.myCrushes, href: `/${lang}/addcrush`, icon: HeartTick },
    { id: "qui-ma-crush", label: t.header.navigation.myAdmirers, href: `/${lang}/matchcrush`, icon: ProfileCircle },
  ];
  
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const switchLanguage = (newLang: Language) => {
    // Remplacer la langue dans l'URL actuelle
    const currentPath = pathname.replace(`/${lang}`, '');
    const newPath = `/${newLang}${currentPath}`;
    router.push(newPath);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full h-[70px] px-4 sm:px-6 xl:px-12 flex items-center justify-between border-b-2 border-[#FF4F81] xl:h-[100px] md:h-[80px] bg-[#1C1F3F]/95 backdrop-blur-sm">
      {/* Logo */}
      <Link href={`/${lang}`} className="flex-shrink-0 cursor-pointer">
        <Image
          src="/images/branding/wholikeme-desktop-logo.webp"
          alt="WhoLikeMe Logo"
          width={211}
          height={80}
          className="hidden xl:block cursor-pointer hover:opacity-90 transition-opacity duration-200"
          priority
        />
        <Image
          src="/images/branding/wholikeme-mobile-logo.webp"
          alt="WhoLikeMe Logo"
          width={79}
          height={24}
          className="xl:hidden cursor-pointer hover:opacity-90 transition-opacity duration-200"
          priority
        />
      </Link>

      {/* Desktop Navigation - Only on XL screens */}
      <nav className="hidden xl:flex gap-8 flex-1 justify-center max-w-3xl">
        {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
          <Link key={id} href={href} className="cursor-pointer">
            <span
              className={`flex items-center gap-2 text-lg font-medium cursor-pointer transition-all duration-300 px-4 py-2 rounded-full whitespace-nowrap ${
                pathname === href 
                  ? "text-[#FF4F81] bg-[#FF4F81]/10" 
                  : "text-white hover:text-[#FF4F81] hover:bg-white/5"
              }`}
            >
              <Icon 
                size={24} 
                variant={pathname === href ? "Bold" : "Linear"} 
                color={pathname === href ? "#FF4F81" : "white"}
              />
              {label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Desktop Search and User Controls - Only on XL screens */}
      <div className="hidden xl:flex items-center gap-4 relative flex-shrink-0">
        {/* Language Selector - Hide when search is active */}
        <div className={`relative transition-all duration-300 ${isSearchActive ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full p-1 border border-[#FF4F81]/30 shadow-lg">
            <button
              onClick={() => switchLanguage('fr')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                lang === 'fr' 
                  ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                lang === 'en' 
                  ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Search Bar - Animated expansion */}
        <div className={`flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full overflow-hidden transition-all duration-300 ease-in-out shadow-lg border border-[#FF4F81]/30 ${
          isSearchActive ? 'w-80' : 'w-auto'
        }`}>
          {isSearchActive ? (
            <>
              <input
                type="text"
                placeholder={t.header.search.placeholder}
                className="bg-transparent text-white pl-6 pr-2 py-3 flex-1 focus:outline-none placeholder-white/60 text-base"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchActive(false);
                  }
                }}
              />
              <button
                onClick={toggleSearch}
                className="p-3 text-white/70 hover:text-[#FF4F81] transition-colors duration-200 flex-shrink-0 cursor-pointer"
                aria-label={t.header.search.close}
              >
                <X size={22} />
              </button>
            </>
          ) : (
            <button 
              onClick={toggleSearch} 
              className="p-3 cursor-pointer hover:text-[#FF4F81] text-white transition-all duration-200 hover:scale-110 hover:bg-white/5 rounded-full"
              aria-label={t.header.search.label}
            >
              <SearchNormal size={28} color="white" variant="Linear" />
            </button>
          )}
        </div>
        
        {/* Notifications */}
        <div className="flex-shrink-0">
          <NotificationBell />
        </div>
        
        {/* Avatar utilisateur avec photo Google - Cliquable pour ouvrir le profil */}
        <div className="flex-shrink-0">
          <UserProfileButton 
            onLoginClick={() => setShowLoginModal(true)}
            userImage={userImage}
            userName={userName}
          />
        </div>
      </div>

       {/* Mobile/Tablet Search and Controls - Show on screens smaller than XL (1280px) */}
      <div className="flex items-center gap-3 xl:hidden">
        {isSearchActive ? (
          <div className="absolute inset-0 flex items-center bg-[#1C1F3F]/98 backdrop-blur-md px-4 z-50 animate-fadeIn border-b-2 border-[#FF4F81]">
            <div className="flex items-center w-full bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full overflow-hidden border border-[#FF4F81]/40 shadow-lg">
              <input
                type="text"
                placeholder={t.header.search.placeholder}
                className="bg-transparent text-white px-5 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50 placeholder-white/60"
                autoFocus
              />
              <button
                onClick={toggleSearch}
                className="px-4 text-white/70 hover:text-[#FF4F81] transition-colors duration-200 cursor-pointer"
                aria-label={t.header.search.close}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <button 
              onClick={toggleSearch}
              className="p-1 cursor-pointer text-white hover:text-[#FF4F81] transition-colors duration-200"
              aria-label={t.header.search.label}
            >
              <Search size={24} />
            </button>
            
            {/* Notifications */}
            <NotificationBell />
            
            <button
              onClick={toggleMobileMenu}
              className="p-1 cursor-pointer text-white hover:text-[#FF4F81] transition-colors duration-200"
              aria-label={isMobileMenuOpen ? t.header.menu.close : t.header.menu.open}
            >
              {isMobileMenuOpen ? <CloseCircle size={24} color="white" /> : <Menu size={24} color="white" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 top-[70px] md:top-[80px] z-40 px-6 py-8 bg-[#1C1F3F] overflow-y-auto"
            style={{
              backgroundImage: "url('/images/ui/bg-pattern.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "calc(100vh - 70px)",
              width: "100%"
            }}
          >
            {/* User Profile Section */}
            <div className="mb-8">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isAuthenticated) {
                    router.push(`/${lang}/profile`);
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] border border-[#FF4F81]/30 hover:border-[#FF4F81]/50 transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF4F81] shadow-lg flex-shrink-0">
                  <Image
                    src={userImage || "/images/users/avatar.webp"}
                    alt={userName || "User"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white font-bold text-lg truncate">{userName || t.header.profile.myProfile}</p>
                  <p className="text-white/60 text-sm truncate">{t.header.profile.viewProfile}</p>
                </div>
              </button>
            </div>

            {/* Language Selector */}
            <div className="mb-6">
              <p className="text-white/60 text-sm font-medium mb-3 px-2">{t.header.language.label}</p>
              <div className="flex items-center justify-center">
                <div className="flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full p-1 border border-[#FF4F81]/30 shadow-lg w-full max-w-sm">
                  <button
                    onClick={() => {
                      switchLanguage('fr');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 cursor-pointer ${
                      lang === 'fr' 
                        ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.header.language.french}
                  </button>
                  <button
                    onClick={() => {
                      switchLanguage('en');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 cursor-pointer ${
                      lang === 'en' 
                        ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t.header.language.english}
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Button - Affiché seulement si l'utilisateur est connecté */}
            {isAuthenticated && (
              <button
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  await signOut({ callbackUrl: `/${lang}` });
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#FF4F81]/20 hover:bg-[#FF4F81]/30 border border-[#FF4F81]/50 text-[#FF4F81] font-medium transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-lg">{t.header.logout}</span>
              </button>
            )}
        </div>
      )}
    </header>
    
    {/* Login Modal - Rendu en dehors du header pour un centrage correct */}
    <LoginModal 
      showLoginModal={showLoginModal}
      handleCloseLoginModal={() => setShowLoginModal(false)}
      params={{ lang }}
    />
    </>
  );
};

export default Header;