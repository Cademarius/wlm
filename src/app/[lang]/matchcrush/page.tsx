"use client";

import { use, useEffect, useState } from "react";
import HeaderComponent from "../components/header";
import MobileNavBar from "../components/mobile-nav-bar";
import Image from 'next/image';
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import { Heart } from "lucide-react";
import UserCard from "../components/UserCard";
import PageTransition from "../components/PageTransition";
import LoadingState from "../components/LoadingState";
import { CrushListSkeleton } from "../components/SkeletonLoader";

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
  const [isContentReady, setIsContentReady] = useState(false);

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

  // Gérer l'affichage du contenu après le chargement
  useEffect(() => {
    if (!isAuthLoading && !isLoadingAdmirers) {
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsContentReady(false);
    }
  }, [isAuthLoading, isLoadingAdmirers]);

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
      
         <HeaderComponent lang={resolvedParams.lang} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 xl:mb-0 overflow-y-auto">
        {/* Afficher le loader pendant que l'authentification se charge */}
        {isAuthLoading ? (
          <LoadingState message="Chargement..." />
        ) : /* Si l'utilisateur est connecté et charge ses admirateurs */
        isAuthenticated && isLoadingAdmirers ? (
          <PageTransition isLoading={isLoadingAdmirers}>
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="h-10 bg-gray-700/40 rounded-lg w-64 mx-auto animate-pulse" />
                <div className="h-6 bg-gray-700/30 rounded-lg w-48 mx-auto animate-pulse" />
              </div>
              <CrushListSkeleton count={6} />
            </div>
          </PageTransition>
        ) : /* Si l'utilisateur n'est pas connecté OU n'a pas d'admirateurs (après chargement), afficher l'état initial */
        !isAuthenticated || admirers.length === 0 ? (
          <PageTransition>
            <div className="flex flex-col items-center justify-center" style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto mb-12">
                <Image
                  src="/images/ui/illustration.svg"
                  alt={t.matchcrush.illustrationAlt}
                  fill
                  className="object-contain animate-float"
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 75vw, 50vw"
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
          </PageTransition>
        ) : (
          /* Afficher la liste des admirateurs uniquement si l'utilisateur est connecté ET a des admirateurs */
          <PageTransition>
            <div style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Heart className="text-[#FF4F81]" size={36} />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {t.matchcrush.titleWithContent}
                  </h2>
                </div>
                <p className="text-white/60 text-base sm:text-lg">
                  {admirers.length} {admirers.length > 1 ? 'personnes vous admirent' : 'personne vous admire'}
                </p>
              </div>

              {/* Admirers List Section */}
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {admirers.map((admirer, index) => (
                    <UserCard
                      key={admirer.id}
                      user={admirer.user}
                      status={admirer.status}
                      statusLabel={{
                        matched: t.matchcrush.status.matched,
                        admires: t.matchcrush.status.admires,
                      }}
                      type="admirer"
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PageTransition>
        )}
      </main>

      <MobileNavBar className="block xl:hidden" activePage="matchcrush" params={{ lang: resolvedParams.lang }} />
    </div>
  );
};

export default MatchWithACrush;