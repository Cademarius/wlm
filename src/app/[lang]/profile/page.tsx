"use client";

import React from "react";
import { useAuth } from "../components/AuthGuard";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Edit2, Heart, Users, Settings, LogOut } from "lucide-react";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import Header from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";

type ProfilePageProps = {
  params: Promise<{ lang: Language }>;
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [lang, setLang] = React.useState<Language>('fr');
  const [crushesCount, setCrushesCount] = React.useState(0);
  const [admirersCount, setAdmirersCount] = React.useState(0);
  const [matchesCount, setMatchesCount] = React.useState(0);

  React.useEffect(() => {
    params.then(p => setLang(p.lang));
  }, [params]);

  const t = getTranslation(lang);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        // Fetch crushes
        const crushesResponse = await fetch(`/api/get-crushes?userId=${user.id}`);
        const crushesData = await crushesResponse.json();
        if (crushesResponse.ok) {
          setCrushesCount(crushesData.count || 0);
          // Compter les matches (status === "matched")
          const matches = crushesData.crushes.filter((c: { status: string }) => c.status === "matched");
          setMatchesCount(matches.length);
        }

        // Fetch admirers
        const admirersResponse = await fetch(`/api/get-admirers?userId=${user.id}`);
        const admirersData = await admirersResponse.json();
        if (admirersResponse.ok) {
          setAdmirersCount(admirersData.count || 0);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
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
      <Header lang={lang} />
      
      <main className="flex-1 py-6 sm:py-8 xl:py-12 px-4 sm:px-6 xl:px-12">
        <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-4 sm:mb-6 border border-[#FF4F81]/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FF4F81] shadow-lg">
                <Image
                  src={user.image || "/images/users/avatar.webp"}
                  alt={user.name || "User"}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-[#FF4F81] p-2 rounded-full shadow-lg hover:bg-[#FF3D6D] transition-colors duration-200 cursor-pointer">
                <Edit2 size={14} className="text-white sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{user.name}</h1>
              <p className="text-sm sm:text-base text-white/70 mb-3 sm:mb-4 truncate px-2">{user.email}</p>
              
              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-4 sm:gap-6 mt-3 sm:mt-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#FF4F81]">{crushesCount}</div>
                  <div className="text-xs sm:text-sm text-white/60">{t.profile.stats.crushes}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#FF4F81]">{matchesCount}</div>
                  <div className="text-xs sm:text-sm text-white/60">{t.profile.stats.matches}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#FF4F81]">{admirersCount}</div>
                  <div className="text-xs sm:text-sm text-white/60">{t.profile.stats.admirers}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto md:self-start flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Settings Button */}
              <button 
                onClick={() => router.push(`/${lang}/profile/settings`)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer"
              >
                <Settings size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{t.settings.title}</span>
              </button>
              
              {/* Logout Button - Only on XL screens */}
              <button 
                onClick={() => signOut({ callbackUrl: `/${lang}` })}
                className="hidden xl:flex bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-4 py-2 rounded-full items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={18} />
                <span className="text-sm sm:text-base">{t.header.logout}</span>
              </button>
            </div>
          </div>
        </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* My Crushes */}
            <div className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#FF4F81]/20 hover:border-[#FF4F81]/50 transition-all duration-300 cursor-pointer active:scale-95"
                 onClick={() => router.push(`/${lang}/addcrush`)}>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="bg-[#FF4F81]/20 p-2 sm:p-3 rounded-full">
                  <Heart className="text-[#FF4F81]" size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{t.profile.stats.crushes}</h2>
              </div>
              <p className="text-sm sm:text-base text-white/60">{t.profile.actions.viewCrushes}</p>
              <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-[#FF4F81]">{crushesCount}</div>
            </div>

            {/* My Admirers */}
            <div className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#FF4F81]/20 hover:border-[#FF4F81]/50 transition-all duration-300 cursor-pointer active:scale-95"
                 onClick={() => router.push(`/${lang}/matchcrush`)}>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="bg-[#FF4F81]/20 p-2 sm:p-3 rounded-full">
                  <Users className="text-[#FF4F81]" size={20} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{t.profile.stats.admirers}</h2>
              </div>
              <p className="text-sm sm:text-base text-white/60">{t.profile.actions.viewAdmirers}</p>
              <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-[#FF4F81]">{admirersCount}</div>
            </div>
          </div>
        </div>
      </main>
      
      <MobileNavBar className="block xl:hidden" activePage="profile" params={{ lang }} />
    </div>
  );
}