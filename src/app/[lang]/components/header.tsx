"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  SearchNormal, 
  CloseCircle, 
  Notification, 
  Home, 
  HeartTick, 
  ProfileCircle 
} from "iconsax-react";
import { Search, X } from "lucide-react"; 
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';

type HeaderProps = {
  lang: Language;
};

const Header = ({ lang }: HeaderProps) => {
  const t = getTranslation(lang);
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    <header className="sticky top-0 z-50 w-full max-w-[1576px] h-[70px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between border-b-2 border-[#FF4F81] lg:h-[100px] md:h-[80px] bg-[#1C1F3F]/95 backdrop-blur-sm">
      {/* Logo */}
      <Link href={`/${lang}`}>
        <Image
          src="/images/branding/wholikeme-desktop-logo.webp"
          alt="WhoLikeMe Logo"
          width={211}
          height={80}
          className="hidden lg:block cursor-pointer"
        />
        <Image
          src="/images/branding/wholikeme-mobile-logo.webp"
          alt="WhoLikeMe Logo"
          width={79}
          height={24}
          className="lg:hidden cursor-pointer"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex gap-8">
        {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
          <Link key={id} href={href}>
            <span
              className={`flex items-center gap-2 text-xl font-medium cursor-pointer transition-colors duration-300 ${
                pathname === href ? "text-[#FF4F81]" : "text-white hover:text-[#FF4F81]"
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

      {/* Desktop Search and User Controls */}
      <div className="hidden lg:flex items-center gap-4 relative">
        {/* Language Selector */}
        <div className="relative">
          <div className="flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full p-1 border border-[#FF4F81]/30 shadow-lg">
            <button
              onClick={() => switchLanguage('fr')}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                lang === 'fr' 
                  ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                lang === 'en' 
                  ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {isSearchActive ? (
          <div className="flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full overflow-hidden transition-all duration-300 ease-in-out shadow-lg border border-[#FF4F81]/30">
            <input
              type="text"
              placeholder={t.header.search.placeholder}
              className="bg-transparent text-white pl-5 pr-2 py-3 w-64 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50 placeholder-white/60"
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="p-2 text-white/70 hover:text-[#FF4F81] transition-colors duration-200"
              aria-label={t.header.search.close}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleSearch} 
            className="p-2 cursor-pointer hover:text-[#FF4F81] text-white transition-transform duration-200 hover:scale-110"
            aria-label={t.header.search.label}
          >
            <SearchNormal size={26} color="white" variant="Linear" />
          </button>
        )}
        
        <button 
          className="p-2 cursor-pointer text-white hover:text-[#FF4F81] transition-colors duration-200"
          aria-label={t.header.notifications.label}
        >
          <Notification size={32} color="white" variant="Linear" />
        </button>
        
        <button
          className="w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-transparent hover:border-[#FF4F81]"
          onClick={() => console.log("Open login overlay")}
          aria-label={t.header.profile.userProfile}
        >
          <Image 
            src="/images/users/avatar.webp" 
            alt="User Avatar" 
            width={50} 
            height={50} 
            className="object-cover"
          />
        </button>
      </div>

       {/* Mobile Search and Controls */}
      <div className="flex items-center gap-3 lg:hidden">
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
                className="px-4 text-white/70 hover:text-[#FF4F81] transition-colors duration-200"
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
            
            <button 
              className="p-1 cursor-pointer text-white hover:text-[#FF4F81] transition-colors duration-200"
              aria-label={t.header.notifications.label}
            >
              <Notification size={24} color="white" variant="Linear" />
            </button>
            
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
          className="fixed inset-0 top-[70px] z-40 pt-6 px-6 bg-[#1C1F3F]"
          style={{
            backgroundImage: "url('/images/ui/bg-pattern.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "calc(100vh - 70px)",
            width: "100%"
          }}
        >
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map(({ id, label, href, icon: Icon }) => (
              <Link 
                key={id} 
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span
                  className={`flex items-center gap-3 text-xl font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
                    pathname === href 
                      ? "text-[#FF4F81] bg-[#FF4F81]/10 border border-[#FF4F81]/30" 
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
            
            <div className="pt-4 mt-4 border-t border-white/20 flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors duration-200">
              <button
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 hover:border-[#FF4F81] transition-colors duration-200"
                onClick={() => {
                  console.log("Open login overlay");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Image 
                  src="/images/users/avatar.webp" 
                  alt="User Avatar" 
                  width={50} 
                  height={50} 
                  className="object-cover w-full h-full" 
                />
              </button>
              <span className="text-white text-lg font-medium">{t.header.profile.myProfile}</span>
            </div>

            {/* Language Selector in Mobile Menu */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-center">
                <div className="flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full p-1 border border-[#FF4F81]/30 shadow-lg">
                  <button
                    onClick={() => {
                      switchLanguage('fr');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      lang === 'fr' 
                        ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => {
                      switchLanguage('en');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      lang === 'en' 
                        ? 'bg-[#FF4F81] text-white shadow-lg transform scale-105' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;