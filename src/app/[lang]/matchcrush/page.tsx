"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "../components/AuthGuard";
import { getTranslation } from '@/lib/i18n/getTranslation';
import { type Language } from '@/lib/i18n/setting';
import UserCard from "../components/UserCard";
import AdmirerCard, { type AdmirerHints } from "../components/AdmirerCard";
import PageTransition from "../components/PageTransition";
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
  hints: AdmirerHints;
  unlocked: string[];
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
    <div className="w-full min-h-screen flex flex-col text-white">
      

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 xl:mb-0 overflow-y-auto">
        {/* Afficher le loader pendant que l'authentification se charge */}
  {isAuthLoading ? null : /* Si l'utilisateur est connecté et charge ses admirateurs */
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
            <div className="flex flex-col items-center justify-center text-center min-h-[68vh]" style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              <div className="relative mb-8">
                <div className="absolute inset-0 blur-3xl bg-[#B14DFF]/30 rounded-full" />
                <div className="relative h-24 w-24 rounded-full wlm-btn-gradient wlm-glow flex items-center justify-center animate-float text-4xl">
                  👀
                </div>
              </div>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  {isAuthenticated
                    ? "Personne pour l'instant"
                    : "Découvre qui t'aime en secret"}
                </h2>
                <p className="text-white/60 text-base sm:text-lg">
                  {isAuthenticated
                    ? "Quand quelqu'un t'ajoutera en secret, il apparaîtra ici (flouté). Débloque des indices pour en savoir plus 👀"
                    : "Connecte-toi pour voir qui t'aime en secret."}
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
                  <h2 className="text-2xl sm:text-3xl font-bold wlm-gradient-text">
                    👀 Mes admirateurs
                  </h2>
                </div>
                <p className="text-white/60 text-base sm:text-lg">
                  {admirers.length > 1
                    ? t.matchcrush.admirersPlural.replace("{{count}}", String(admirers.length))
                    : t.matchcrush.admirers.replace("{{count}}", String(admirers.length))}
                </p>
              </div>

              {/* Admirers List Section */}
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {admirers.map((admirer, index) =>
                    admirer.status === "matched" && admirer.user ? (
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
                    ) : (
                      <AdmirerCard
                        key={admirer.id}
                        admirer={{
                          id: admirer.id,
                          status: admirer.status,
                          hints: admirer.hints,
                          unlocked: admirer.unlocked,
                        }}
                        currentUserId={user?.id || ""}
                        onChanged={fetchAdmirers}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </PageTransition>
        )}
      </main>

    </div>
  );
};

export default MatchWithACrush;