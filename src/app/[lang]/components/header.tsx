"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  SearchNormal,
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
  const { user, isAuthenticated } = useAuth();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const userImage = user?.image;
  const userName = user?.name;
  

  const NAV_LINKS = [
    { id: "accueil", label: "Accueil", href: `/${lang}/feed`, icon: Home },
    { id: "secrets", label: "Secrets", href: `/${lang}/addcrush`, icon: HeartTick },
    { id: "admirateurs", label: "Admirateurs", href: `/${lang}/matchcrush`, icon: ProfileCircle },
  ];
  
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
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
    <header className="sticky top-0 z-50 w-full h-14 sm:h-16 md:h-[72px] xl:h-20 px-4 sm:px-6 xl:px-12 flex items-center justify-between border-b border-white/10 bg-[#1a1033]/40 backdrop-blur-xl backdrop-saturate-150">
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
        {/* Search Bar - Animated expansion */}
        <div className="relative">
          <div className={`flex items-center bg-gradient-to-r from-white/[0.08] to-white/[0.03] rounded-full overflow-hidden transition-all duration-300 ease-in-out shadow-lg border border-[#FF4F81]/30 ${
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
            <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-[#FF4F81]/30 rounded-2xl shadow-2xl shadow-[#FF4F81]/20 max-h-[500px] overflow-y-auto z-50 animate-[slideDown_0.3s_ease-out]">
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
                          src={searchUser.image || "/images/users/avatar.svg"}
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
  <div className="shrink-0">
    <NotificationBell />
  </div>
        
        {/* Avatar utilisateur avec photo Google - Cliquable pour ouvrir le profil */}
  <div className="shrink-0">
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
              <div className="flex items-center w-full bg-linear-to-r from-white/[0.08] to-white/[0.03] rounded-full overflow-hidden border border-[#FF4F81]/40 shadow-lg">
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
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 shrink-0">
                          <Image
                            src={searchUser.image || "/images/users/avatar.svg"}
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
                        <div className="text-[#FF4F81] shrink-0">
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
            <div className="shrink-0">
              <NotificationBell />
            </div>
            
            <button
              onClick={() => {
                if (!isAuthenticated) setShowLoginModal(true);
                else router.push(`/${lang}/profile`);
              }}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FF5C8A]/60 active:scale-90 transition shrink-0"
              aria-label="Mon profil"
            >
              <Image
                src={userImage || "/images/users/avatar.svg"}
                alt={userName || "Profil"}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </button>
          </>
        )}
      </div>

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