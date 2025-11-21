"use client";

import React from "react";
import { useAuth } from "../components/AuthGuard";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Edit2, Heart, Users, Settings, LogOut } from "lucide-react";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import HeaderComponent from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";
import { ProfileHeaderSkeleton, ProfileSectionSkeleton } from "../components/SkeletonLoader";

type ProfilePageProps = {
  params: Promise<{ lang: Language }>;
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [lang, setLang] = React.useState<Language>('fr');
  const [crushesCount, setCrushesCount] = React.useState(0);
  const [admirersCount, setAdmirersCount] = React.useState(0);
  // const [matchesCount, setMatchesCount] = React.useState(0);
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  React.useEffect(() => {
    params.then(p => setLang(p.lang));
  }, [params]);

  const t = getTranslation(lang);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      setIsLoadingStats(true);
      try {
        // Fetch crushes
        const crushesResponse = await fetch(`/api/get-crushes?userId=${user.id}`);
        const crushesData = await crushesResponse.json();
        if (crushesResponse.ok) {
          setCrushesCount(crushesData.count || 0);
          // Compter les matches (status === "matched")
          // const matches = crushesData.crushes.filter((c: { status: string }) => c.status === "matched");
          // setMatchesCount(matches.length);
        }

        // Fetch admirers
        const admirersResponse = await fetch(`/api/get-admirers?userId=${user.id}`);
        const admirersData = await admirersResponse.json();
        if (admirersResponse.ok) {
          setAdmirersCount(admirersData.count || 0);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        // Délai minimum pour une meilleure UX
        setTimeout(() => {
          setIsLoadingStats(false);
          setIsInitialLoad(false);
        }, 300);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (!user) {
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-[#1C1F3F] flex flex-col"
      style={{
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <HeaderComponent lang={lang} />
      
      <main className="flex-1 py-6 sm:py-8 xl:py-12 px-4 sm:px-6 xl:px-12 mb-20 xl:mb-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        {isLoadingStats ? (
          <ProfileHeaderSkeleton />
        ) : (
        <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-4 sm:mb-6 border border-[#FF4F81]/30 animate-[slideInUp_0.4s_ease-out] relative overflow-hidden">
          {/* Effet de brillance au hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4F81]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-6 group">
            {/* Avatar */}
            <div className="relative">
              <button
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FF4F81] transition-all duration-300 group-hover:border-[#FF3D6D] group-hover:scale-105 bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] p-0"
                style={{ outline: 'none', border: 'none' }}
                aria-label="Modifier la photo de profil"
                onClick={() => router.push(`/${lang}/profile/settings`)}
              >
                <Image
                  src={user.image || "/images/users/avatar.webp"}
                  alt={user.name || "User"}
                  width={256}
                  height={256}
                  quality={95}
                  priority
                  sizes="(max-width: 640px) 96px, 128px"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                  }}
                />
              </button>
              <button 
                className="absolute bottom-0 right-0 bg-[#FF4F81] p-2 rounded-full shadow-lg hover:bg-[#FF3D6D] active:scale-90 transition-all duration-200 cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center hover:rotate-12"
                aria-label="Edit profile picture"
                onClick={() => router.push(`/${lang}/profile/settings`)}
              >
                <Edit2 size={16} className="text-white sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{user.name}</h1>
              <p className="text-sm sm:text-base text-white/70 mb-3 sm:mb-4 truncate px-2">{user.email}</p>
              
              {/* Stats supprimées pour éviter la répétition */}
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto md:self-start flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Settings Button */}
              <button 
                onClick={() => router.push(`/${lang}/profile/settings`)}
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white px-4 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation min-h-[44px]"
                aria-label={t.settings.title}
              >
                <Settings size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">{t.settings.title}</span>
              </button>
              
              {/* Logout Button - Only on XL screens */}
              <button 
                onClick={async () => {
                  // Mettre à jour le statut en ligne à false avant de déconnecter
                  try {
                    const userId = user?.id;
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
                className="hidden xl:flex bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-4 py-3 rounded-full items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 min-h-[44px]"
                aria-label={t.header.logout}
              >
                <LogOut size={18} />
                <span className="text-sm sm:text-base font-medium">{t.header.logout}</span>
              </button>
            </div>
          </div>
        </div>
        )}

          {/* Profile Sections */}
          {isInitialLoad ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div style={{ animation: 'fadeIn 0.4s ease-out 0.1s both' }}>
                <ProfileSectionSkeleton />
              </div>
              <div style={{ animation: 'fadeIn 0.4s ease-out 0.2s both' }}>
                <ProfileSectionSkeleton />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* My Crushes */}
              <div 
                className="relative bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-[#FF4F81]/20 hover:border-[#FF4F81]/50 hover:shadow-lg hover:shadow-[#FF4F81]/20 transition-all duration-300 cursor-pointer active:scale-[0.98] transform hover:scale-[1.02] touch-manipulation group overflow-hidden"
                onClick={() => router.push(`/${lang}/addcrush`)}
                style={{ animation: 'slideInUp 0.4s ease-out 0.1s both' }}
              >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="bg-[#FF4F81]/20 p-2.5 sm:p-3 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF4F81]/30 group-hover:rotate-12">
                      <Heart className="text-[#FF4F81] transition-all duration-300 group-hover:fill-[#FF4F81] group-hover:scale-110" size={20} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FF4F81] transition-colors duration-300">{t.profile.stats.crushes}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-white/60 mb-3 group-hover:text-white/80 transition-colors duration-300">{t.profile.actions.viewCrushes}</p>
                  <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-[#FF4F81] transition-all duration-300 group-hover:scale-110 transform-gpu">
                    {crushesCount}
                  </div>
                </div>
              </div>

              {/* My Admirers */}
              <div 
                className="relative bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-[#FF4F81]/20 hover:border-[#FF4F81]/50 hover:shadow-lg hover:shadow-[#FF4F81]/20 transition-all duration-300 cursor-pointer active:scale-[0.98] transform hover:scale-[1.02] touch-manipulation group overflow-hidden"
                onClick={() => router.push(`/${lang}/matchcrush`)}
                style={{ animation: 'slideInUp 0.4s ease-out 0.2s both' }}
              >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="bg-[#FF4F81]/20 p-2.5 sm:p-3 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF4F81]/30 group-hover:rotate-12">
                      <Users className="text-[#FF4F81] transition-all duration-300 group-hover:scale-110" size={20} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FF4F81] transition-colors duration-300">{t.profile.stats.admirers}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-white/60 mb-3 group-hover:text-white/80 transition-colors duration-300">{t.profile.actions.viewAdmirers}</p>
                  <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-[#FF4F81] transition-all duration-300 group-hover:scale-110 transform-gpu">
                    {admirersCount}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <MobileNavBar className="block xl:hidden" activePage="profile" params={{ lang }} />
    </div>
  );
}