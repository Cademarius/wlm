"use client";

import React from "react";
import { getTranslation } from '@/lib/i18n/getTranslation';
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Users, MapPin, Calendar, User as UserIcon } from "lucide-react";
import { type Language } from '@/lib/i18n/setting';
import HeaderComponent from "../../components/header";
import MobileNavBar from "../../components/mobile-nav-bar";
import { ProfileHeaderSkeleton } from "../../components/SkeletonLoader";
import { useAuth } from "../../components/AuthGuard";

type UserProfilePageProps = {
  params: Promise<{ lang: Language; userId: string }>;
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
  gender?: string | null;
  bio: string | null;
  created_at: string;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  // const router = useRouter();
  const { user: currentUser } = useAuth();
  const [lang, setLang] = React.useState<Language>('fr');
  const t = React.useMemo(() => getTranslation(lang), [lang]);
  const [userId, setUserId] = React.useState<string>('');
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCrush, setIsCrush] = React.useState(false);
  const [isAdmirer, setIsAdmirer] = React.useState(false);
  const [isMatch, setIsMatch] = React.useState(false);
  const [admirersCount, setAdmirersCount] = React.useState(0);

  React.useEffect(() => {
    params.then(p => {
      setLang(p.lang);
      setUserId(p.userId);
    });
  }, [params]);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !currentUser?.id) return;

      setIsLoading(true);
      try {
        // Fetch user profile
        const response = await fetch(`/api/get-user?userId=${userId}`);
        const data = await response.json();
        
        if (response.ok && data.user) {
          setUserProfile(data.user);
        }

        // Check relationship status
        const crushesResponse = await fetch(`/api/get-crushes?userId=${currentUser.id}`);
        const crushesData = await crushesResponse.json();
        
        if (crushesResponse.ok) {
          const crushRelation = crushesData.crushes.find((c: { user: { id: string } | null; status: string }) => c.user?.id === userId);
          if (crushRelation) {
            setIsCrush(true);
            setIsMatch(crushRelation.status === "matched");
          }
        }

        // Check if user is an admirer
        const admirersResponse = await fetch(`/api/get-admirers?userId=${currentUser.id}`);
        const admirersData = await admirersResponse.json();
        
        if (admirersResponse.ok) {
          const admirer = admirersData.admirers.find((a: { user_id: string }) => a.user_id === userId);
          setIsAdmirer(!!admirer);
        }

        // Get admirers count for this user's profile
        const userAdmirersResponse = await fetch(`/api/get-admirers?userId=${userId}`);
        const userAdmirersData = await userAdmirersResponse.json();
        if (userAdmirersResponse.ok) {
          setAdmirersCount(userAdmirersData.count || 0);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser?.id]);

  const handleAddCrush = async () => {
    if (!currentUser?.id || !userId) return;

    try {
      const response = await fetch('/api/add-crush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          crushUserId: userId,
        }),
      });

      if (response.ok) {
        setIsCrush(true);
        // Check if it's a match
        const data = await response.json();
        if (data.match) {
          setIsMatch(true);
        }
      }
    } catch (error) {
      console.error("Error adding crush:", error);
    }
  };

  if (!currentUser) {
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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          {isLoading ? (
            <ProfileHeaderSkeleton />
          ) : userProfile ? (
            <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 border border-[#FF4F81]/30 relative overflow-hidden animate-[slideInUp_0.4s_ease-out]">
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4F81]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[#FF4F81] bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F]">
                      <Image
                        src={userProfile.image || "/images/users/avatar.webp"}
                        alt={userProfile.name || "User"}
                        width={256}
                        height={256}
                        quality={95}
                        priority
                        className="object-cover w-full h-full"
                        style={{
                          imageRendering: '-webkit-optimize-contrast',
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)',
                        }}
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{userProfile.name}</h1>
                    
                    {/* Info Grid */}
                    <div className="space-y-2 mt-4">
                      {userProfile.age && (
                        <div className="flex items-center gap-2 text-white/70 justify-center md:justify-start">
                          <Calendar size={18} className="text-[#FF4F81]" />
                          <span>{t.addcrush?.age ? t.addcrush.age.replace('{{count}}', userProfile.age.toString()) : `${userProfile.age} ans`}</span>
                        </div>
                      )}
                      {userProfile.gender && (
                        <div className="flex items-center gap-2 text-white/70 justify-center md:justify-start">
                          <UserIcon size={18} className="text-[#FF4F81]" />
                          <span>
                            {userProfile.gender === 'male' && (t.settings?.sections?.personalInfo?.gender?.male || 'Homme')}
                            {userProfile.gender === 'female' && (t.settings?.sections?.personalInfo?.gender?.female || 'Femme')}
                            {userProfile.gender === 'other' && (t.settings?.sections?.personalInfo?.gender?.other || 'Autre')}
                          </span>
                        </div>
                      )}
                      {userProfile.location && (
                        <div className="flex items-center gap-2 text-white/70 justify-center md:justify-start">
                          <MapPin size={18} className="text-[#FF4F81]" />
                          <span>{userProfile.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex gap-6 justify-center md:justify-start">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#FF4F81]">{admirersCount}</div>
                          <div className="text-xs text-white/60">{t.profile?.stats?.admirers || 'Admirateurs'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full md:w-auto flex flex-col gap-3">
                    {!isCrush && !isMatch && (
                      <button
                        onClick={handleAddCrush}
                        className="bg-[#FF4F81] hover:bg-[#FF3D6D] text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 min-h-[44px]"
                      >
                        <Heart size={20} />
                        <span className="font-medium">{t.addcrush?.buttonText || 'Ajouter un crush'}</span>
                      </button>
                    )}
                    
                    {isCrush && !isMatch && (
                      <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-6 py-3 rounded-full flex items-center justify-center gap-2 min-h-[44px]">
                        <Heart size={20} className="fill-yellow-400" />
                        <span className="font-medium">{t.addcrush?.messages?.alreadyAdded || 'Crush ajouté'}</span>
                      </div>
                    )}
                    
                    {isMatch && (
                      <div className="bg-green-500/20 border-2 border-green-500 text-green-400 px-6 py-3 rounded-full flex items-center justify-center gap-2 min-h-[44px]">
                        <Heart size={20} className="fill-green-400" />
                        <span className="font-bold">{t.addcrush?.status?.matched || 'Match'}</span>
                      </div>
                    )}
                    
                    {isAdmirer && !isMatch && (
                      <div className="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-6 py-3 rounded-full flex items-center justify-center gap-2 min-h-[44px] text-sm">
                        <Users size={18} />
                        <span className="font-medium">{t.matchcrush?.status?.admires || 'Vous admire'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {userProfile.bio && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-white font-semibold mb-2">{t.settings?.sections?.about?.title || 'À propos'}</h3>
                    <p className="text-white/70 leading-relaxed">{userProfile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-8 text-center border border-[#FF4F81]/30">
              <p className="text-white/70">{t.userNotFound || t.addcrush?.noResults || 'Utilisateur non trouvé'}</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileNavBar className="block xl:hidden" activePage="" params={{ lang }} />
    </div>
  );
}
