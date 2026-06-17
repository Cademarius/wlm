"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import AddCrushModal from "../components/AddCrushModal";
import LoginModal from "../components/login";
import { useAuth } from "../components/AuthGuard";
import { useTranslation } from "@/lib/i18n/I18nProvider";
import { type Language } from '@/lib/i18n/setting';
import { Heart } from "lucide-react";
import { CrushListSkeleton } from "../components/SkeletonLoader";
import UserCard from "../components/UserCard";
import PageTransition from "../components/PageTransition";

interface CrushUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
}

interface Crush {
  id: string;
  status: string;
  created_at: string;
  crush_phone: string;
  label: string | null;
  user: CrushUser | null;
}

const AddACrush = ({ params }: { params: Promise<{ lang: Language }> }) => {
  const resolvedParams = use(params);
  const { t, format } = useTranslation();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [showAddCrushModal, setShowAddCrushModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [crushes, setCrushes] = useState<Crush[]>([]);
  const [isLoadingCrushes, setIsLoadingCrushes] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  const handleButtonClick = () => {
    if (isAuthenticated && user?.id) {
      setShowAddCrushModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const fetchCrushes = async () => {
    if (!user?.id) return;
    
    setIsLoadingCrushes(true);
    try {
      const response = await fetch(`/api/get-crushes?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setCrushes(data.crushes || []);
      } else {
        console.error("Error fetching crushes:", data.error);
      }
    } catch (error) {
      console.error("Error fetching crushes:", error);
    } finally {
      setIsLoadingCrushes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCrushes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Gérer l'affichage du contenu après le chargement
  useEffect(() => {
    if (!isAuthLoading && !isLoadingCrushes) {
      // Petit délai pour éviter le flash de contenu
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsContentReady(false);
    }
  }, [isAuthLoading, isLoadingCrushes]);

  return (
    <div className="w-full min-h-screen flex flex-col text-white">
      
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-20 xl:mb-0 overflow-y-auto">
        {/* Afficher le loader pendant que l'authentification se charge */}
  {isAuthLoading ? null : /* Si l'utilisateur est connecté et charge ses crushes */
  isAuthenticated && isLoadingCrushes ? (
          <PageTransition isLoading={isLoadingCrushes}>
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="h-10 bg-gray-700/40 rounded-lg w-64 mx-auto animate-pulse" />
                <div className="h-12 bg-[#FF5C8A]/20 rounded-xl w-48 mx-auto animate-pulse" />
              </div>
              <CrushListSkeleton count={6} />
            </div>
          </PageTransition>
        ) : /* Si l'utilisateur n'est pas connecté OU n'a pas de crushes, afficher l'état initial */
        !isAuthenticated || crushes.length === 0 ? (
          <PageTransition>
            <div className="flex flex-col items-center justify-center text-center min-h-[68vh]" style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              <div className="relative mb-8">
                <div className="absolute inset-0 blur-3xl bg-[#FF5C8A]/30 rounded-full" />
                <div className="relative h-24 w-24 rounded-full wlm-btn-gradient wlm-glow flex items-center justify-center animate-float">
                  <Heart size={44} className="text-white fill-white" />
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  {isAuthenticated
                    ? t.secrets.emptyTitle
                    : t.secrets.emptyTitleGuest}
                </h2>
                <p className="text-white/60 text-base sm:text-lg mb-8">
                  {isAuthenticated
                    ? t.secrets.emptyDesc
                    : t.secrets.emptyDescGuest}
                </p>
                <button
                  onClick={handleButtonClick}
                  className="inline-flex items-center justify-center gap-2 wlm-btn-gradient wlm-glow text-white font-semibold text-base sm:text-lg px-8 py-4 rounded-2xl transition active:scale-95 hover:brightness-110 cursor-pointer"
                >
                  <Heart size={20} className="fill-white" />
                  {t.secrets.addBtn}
                </button>
              </div>
            </div>
          </PageTransition>
        ) : (
          /* Afficher la liste des crushes uniquement si l'utilisateur est connecté ET a des crushes */
          <PageTransition>
            <div style={{ opacity: isContentReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Heart className="text-[#FF5C8A] fill-[#FF5C8A]" size={30} />
                  <h2 className="text-2xl sm:text-3xl font-bold wlm-gradient-text">
                    {t.secrets.sectionTitle}
                  </h2>
                </div>
                <p className="text-white/60 text-base sm:text-lg mb-6">
                  {format(crushes.length <= 1 ? t.secrets.count : t.secrets.countPlural, { count: crushes.length })}
                </p>

                <button
                  onClick={handleButtonClick}
                  className="inline-flex items-center justify-center gap-2 wlm-btn-gradient wlm-glow text-white font-semibold text-base sm:text-lg px-8 py-4 rounded-2xl transition active:scale-95 hover:brightness-110 cursor-pointer"
                >
                  <Heart size={20} className="fill-white" />
                  {t.secrets.addBtn}
                </button>
              </div>

              {/* Crushes List Section */}
              <div className="mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {crushes.map((crush, index) =>
                    crush.user ? (
                      <UserCard
                        key={crush.id}
                        user={crush.user}
                        status={crush.status}
                        statusLabel={{
                          matched: t.secrets.status.matched,
                          pending: t.secrets.status.pending,
                        }}
                        type="crush"
                        index={index}
                      />
                    ) : (
                      /* Secret vers une personne pas (encore) inscrite */
                      <div
                        key={crush.id}
                        className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] rounded-2xl p-6 border border-[#FF5C8A]/20 flex flex-col gap-3"
                        style={{ animation: `slideInUp 0.5s ease-out ${index * 0.1}s both` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-[#FF5C8A]/15 flex items-center justify-center text-2xl">
                            🤫
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold truncate">
                              {crush.label || crush.crush_phone}
                            </p>
                            <p className="text-white/40 text-xs">{crush.crush_phone}</p>
                          </div>
                        </div>
                        <p className="text-yellow-400 text-sm font-medium">
                          {t.secrets.pending}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </PageTransition>
        )}
      </main>

      
      {/* Modal de recherche et ajout de crush */}
      {isAuthenticated && user?.id && (
        <AddCrushModal
          showModal={showAddCrushModal}
          handleClose={() => setShowAddCrushModal(false)}
          currentUserId={user.id}
          onCrushAdded={fetchCrushes}
          existingPhones={crushes.map((c) => c.crush_phone)}
        />
      )}
      
      {/* Modal de connexion */}
      <LoginModal 
        showLoginModal={showLoginModal}
        handleCloseLoginModal={() => setShowLoginModal(false)}
        params={{ lang: resolvedParams.lang }}
      />
    </div>
  );
};

export default AddACrush;