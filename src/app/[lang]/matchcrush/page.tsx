"use client";

import { use, useEffect, useState } from "react";
import Header from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from 'next/image';
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { Heart, Loader2 } from "lucide-react";

interface AdmirerUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
}

interface Admirer {
  id: string;
  status: string;
  created_at: string;
  user: AdmirerUser | null;
}

const MatchWithACrush = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const t = getTranslation(resolvedParams.lang);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [admirers, setAdmirers] = useState<Admirer[]>([]);
  const [isLoadingAdmirers, setIsLoadingAdmirers] = useState(false);

  const fetchAdmirers = async () => {
    if (!user?.id) return;
    
    setIsLoadingAdmirers(true);
    try {
      const response = await fetch(`/api/get-admirers?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setAdmirers(data.admirers || []);
      } else {
        console.error("Error fetching admirers:", data.error);
      }
    } catch (error) {
      console.error("Error fetching admirers:", error);
    } finally {
      setIsLoadingAdmirers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAdmirers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  return (
    <div 
      className="w-full min-h-screen flex flex-col text-white bg-[#1C1F3F]"
      style={{ 
        backgroundImage: "url('/images/ui/bg-pattern.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      
         <Header lang={resolvedParams.lang} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Afficher le loader pendant que l'authentification ou les données se chargent */}
        {isAuthLoading || (isAuthenticated && isLoadingAdmirers) ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
            <p className="text-white/60">Chargement...</p>
          </div>
        ) : /* Si l'utilisateur n'est pas connecté OU n'a pas d'admirateurs (après chargement), afficher l'état initial */
        !isAuthenticated || admirers.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto mb-12">
              <Image
                src="/images/ui/illustration.svg"
                alt={t.matchcrush.illustrationAlt}
                fill
                className="object-contain animate-float"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 60vw"
              />
            </div>
            
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                {t.matchcrush.title}
              </h2>
              
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl">
                {!isAuthenticated 
                  ? t.matchcrush.descriptionNotAuthenticated
                  : t.matchcrush.description}
              </p>
            </div>
          </div>
        ) : (
          /* Afficher la liste des admirateurs uniquement si l'utilisateur est connecté ET a des admirateurs */
          <div>
            {/* Header Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 text-white">
                {t.matchcrush.titleWithContent}
              </h2>
            </div>

            {/* Admirers List Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="text-[#FF4F81]" size={28} />
                  {t.matchcrush.titleWithContent} ({admirers.length})
                </h3>
              </div>

              {isLoadingAdmirers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
                  <p className="text-white/60">Chargement...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {admirers.map((admirer) => (
                    <div
                      key={admirer.id}
                      className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl p-6 border border-[#FF4F81]/20 hover:border-[#FF4F81]/50 transition-all duration-300"
                    >
                      {admirer.user ? (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 flex-shrink-0">
                              <Image
                                src={admirer.user.image || "/images/users/avatar.webp"}
                                alt={admirer.user.name || "User"}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-lg truncate">
                                {admirer.user.name}
                              </h4>
                              {(admirer.user.age || admirer.user.location) && (
                                <p className="text-white/60 text-sm">
                                  {admirer.user.age && `${admirer.user.age} ans`}
                                  {admirer.user.age && admirer.user.location && " • "}
                                  {admirer.user.location}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                admirer.status === "matched"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                              }`}
                            >
                              {admirer.status === "matched" ? `🎉 ${t.matchcrush.status.matched}` : `💙 ${t.matchcrush.status.admires}`}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-white/40 text-center py-4">
                          Utilisateur non trouvé
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <MobileNavBar className="block xl:hidden" activePage="matchcrush" params={{ lang: resolvedParams.lang }} />
    </div>
  );
};

export default MatchWithACrush;