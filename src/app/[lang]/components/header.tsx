"use client";

import { useState, useEffect } from "react";
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
import { Search, X, Users as UsersIcon } from "lucide-react"; 
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import UserProfileButton from "./UserProfileButton";
import LoginModal from "./login";
import { useAuth } from "./AuthGuard";
import NotificationBell from "./NotificationBell";

interface SearchUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
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

  // Recherche d'utilisateurs
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || !user?.id) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search-users?query=${encodeURIComponent(searchQuery)}&currentUserId=${user.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setSearchResults(data.users || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, user?.id]);

  const handleUserClick = (userId: string) => {
    router.push(`/${lang}/user/${userId}`);
    setIsSearchActive(false);
    setSearchQuery("");
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full h-14 sm:h-16 md:h-[72px] xl:h-20 px-4 sm:px-6 xl:px-12 flex items-center justify-between border-b border-[#FF4F81]/50 bg-[#1C1F3F]/90 backdrop-blur-md backdrop-saturate-150 shadow-lg shadow-black/20">
      {/* Logo */}
      <Link 
        href={`/${lang}`} 
        className="flex-shrink-0 cursor-pointer active:scale-95 transition-transform duration-150"
        aria-label="WhoLikeMe Homepage"
      >
        <Image
          src="/images/branding/wholikeme-desktop-logo.webp"
          alt="WhoLikeMe Logo"
          width={211}
          height={80}
          className="hidden xl:block h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
          priority
        />
        <Image
          src="/images/branding/wholikeme-mobile-logo.webp"
          alt="WhoLikeMe Logo"
          width={79}
          height={24}
          className="xl:hidden h-6 sm:h-7 w-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
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
        <div className="relative">
          <div className={`flex items-center bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full overflow-hidden transition-all duration-300 ease-in-out shadow-lg border border-[#FF4F81]/30 ${
            isSearchActive ? 'w-96' : 'w-auto'
          }`}>
            {isSearchActive ? (
              <>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.header.search.placeholder}
                  className="bg-transparent text-white pl-6 pr-2 py-3 flex-1 focus:outline-none placeholder-white/60 text-base"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchActive(false);
                      clearSearch();
                    }
                  }}
                />
                <button
                  onClick={() => {
                    toggleSearch();
                    clearSearch();
                  }}
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

          {/* Search Results Dropdown */}
          {showResults && isSearchActive && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] border border-[#FF4F81]/30 rounded-2xl shadow-2xl shadow-[#FF4F81]/20 max-h-[500px] overflow-y-auto z-50 animate-[slideDown_0.3s_ease-out]">
              {isSearching ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-[#FF4F81]/30 border-t-[#FF4F81] rounded-full animate-spin" />
                  <p className="text-white/60 mt-4">{t.addcrush.searching}</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((searchUser, index) => (
                    <div
                      key={searchUser.id}
                      onClick={() => handleUserClick(searchUser.id)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-200 group"
                      style={{
                        animation: `slideInUp 0.3s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 group-hover:border-[#FF4F81] transition-colors flex-shrink-0">
                        <Image
                          src={searchUser.image || "/images/users/avatar.webp"}
                          alt={searchUser.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate group-hover:text-[#FF4F81] transition-colors">
                          {searchUser.name}
                        </h4>
                        {searchUser.location && (
                          <p className="text-white/40 text-xs truncate mt-1">{searchUser.location}</p>
                        )}
                      </div>
                      <div className="text-[#FF4F81] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <UsersIcon size={48} className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">{t.addcrush.noResults}</p>
                  <p className="text-white/40 text-sm mt-2">{t.addcrush.tryAnotherSearch}</p>
                </div>
              )}
            </div>
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
      <div className="flex items-center gap-2 sm:gap-3 xl:hidden">
        {isSearchActive ? (
          <div className="absolute inset-0 top-0 left-0 right-0 bg-[#1C1F3F]/98 backdrop-blur-md z-50 animate-[slideDown_0.2s_ease-out] border-b border-[#FF4F81]/50">
            <div className="flex items-center h-14 sm:h-16 md:h-[72px] px-4">
              <div className="flex items-center w-full bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-full overflow-hidden border border-[#FF4F81]/40 shadow-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.header.search.placeholder}
                  className="bg-transparent text-white px-4 py-2.5 sm:py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-[#FF4F81] focus:ring-opacity-50 placeholder-white/60 text-sm sm:text-base"
                  autoFocus
                />
                <button
                  onClick={() => {
                    toggleSearch();
                    clearSearch();
                  }}
                  className="px-3 sm:px-4 py-2 text-white/70 hover:text-[#FF4F81] active:scale-90 transition-all duration-200 cursor-pointer touch-manipulation"
                  aria-label={t.header.search.close}
                >
                  <X size={20} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Search Results */}
            {showResults && (
              <div className="max-h-[calc(100vh-4rem)] overflow-y-auto bg-[#1C1F3F] border-t border-[#FF4F81]/20">
                {isSearching ? (
                  <div className="p-8 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#FF4F81]/30 border-t-[#FF4F81] rounded-full animate-spin" />
                    <p className="text-white/60 mt-4">{t.addcrush.searching}</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((searchUser, index) => (
                      <div
                        key={searchUser.id}
                        onClick={() => handleUserClick(searchUser.id)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all duration-200"
                        style={{
                          animation: `slideInUp 0.3s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 flex-shrink-0">
                          <Image
                            src={searchUser.image || "/images/users/avatar.webp"}
                            alt={searchUser.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold truncate text-sm">
                            {searchUser.name}
                          </h4>
                          {searchUser.location && (
                            <p className="text-white/40 text-xs truncate mt-0.5">{searchUser.location}</p>
                          )}
                        </div>
                        <div className="text-[#FF4F81] flex-shrink-0">
                          →
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <UsersIcon size={40} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">{t.addcrush.noResults}</p>
                    <p className="text-white/40 text-xs mt-2">{t.addcrush.tryAnotherSearch}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <button 
              onClick={toggleSearch}
              className="p-2 cursor-pointer text-white hover:text-[#FF4F81] active:scale-90 transition-all duration-200 rounded-lg hover:bg-white/5 touch-manipulation"
              aria-label={t.header.search.label}
            >
              <Search size={20} className="sm:w-6 sm:h-6" />
            </button>
            
            {/* Notifications */}
            <div className="flex-shrink-0">
              <NotificationBell />
            </div>
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 cursor-pointer text-white hover:text-[#FF4F81] active:scale-90 transition-all duration-200 rounded-lg hover:bg-white/5 touch-manipulation"
              aria-label={isMobileMenuOpen ? t.header.menu.close : t.header.menu.open}
            >
              {isMobileMenuOpen ? <CloseCircle size={22} className="sm:w-6 sm:h-6" color="white" /> : <Menu size={22} className="sm:w-6 sm:h-6" color="white" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu avec animation */}
      {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 top-14 sm:top-16 md:top-[72px] z-40 px-4 sm:px-6 py-6 sm:py-8 bg-[#1C1F3F] overflow-y-auto overscroll-contain animate-[slideDown_0.3s_ease-out] safe-area-inset"
            style={{
              backgroundImage: "url('/images/ui/bg-pattern.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "calc(100vh - 3.5rem)",
              width: "100%",
              WebkitOverflowScrolling: "touch"
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
                  // Mettre à jour le statut en ligne à false avant de déconnecter
                  try {
                    const userId = session?.user?.id || user?.id;
                    if (userId) {
                      await fetch('/api/set-online', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, is_online: false }),
                      });
                    }
                  } catch (err) {
                    console.error('Erreur lors de la mise à jour du statut offline:', err);
                  }
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