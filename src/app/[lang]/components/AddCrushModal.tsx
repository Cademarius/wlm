"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Heart, Loader2 } from "lucide-react";
import Toast from "./Toast";
import { useToast } from "@/hooks/useToast";
import { useParams, useRouter } from "next/navigation";
import { getTranslation } from '@/lib/i18n/getTranslation';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  age: number | null;
  location: string | null;
  bio: string | null;
}


interface CrushUser {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  age: number | null;
  location: string | null;
}

interface AddCrushModalProps {
  showModal: boolean;
  handleClose: () => void;
  currentUserId: string;
  onCrushAdded?: () => void;
  existingCrushes?: CrushUser[];
}

const AddCrushModal: React.FC<AddCrushModalProps> = ({ 
  showModal, 
  handleClose,
  currentUserId,
  onCrushAdded,
  existingCrushes = []
}) => {
  const { toast, success, error: showError, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search-users?query=${encodeURIComponent(searchQuery)}&currentUserId=${currentUserId}`);
      const data = await response.json();

      if (response.ok) {
        // Exclure les utilisateurs déjà crushés
        const existingIds = new Set(existingCrushes.map(u => u.id));
        setSearchResults((data.users || []).filter((u: User) => !existingIds.has(u.id)));
      } else {
        console.error("Error searching users:", data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Gestion de l'ESC pour fermer + prévention du scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleClose();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, handleClose]);

  const handleAddCrush = async (crushUserId: string) => {
    setIsAdding(crushUserId);

    try {
      const response = await fetch("/api/add-crush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          crushUserId: crushUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
          if (data.match) {
            success(t.addcrush.messages.match);
          } else {
            success(t.addcrush.messages.success);
          }
        // Retirer l'utilisateur des résultats
        setSearchResults(prev => prev.filter(user => user.id !== crushUserId));
        
        // Notifier le parent pour rafraîchir la liste
        if (onCrushAdded) {
          onCrushAdded();
        }
        
        // Déclencher le rafraîchissement des notifications
        window.dispatchEvent(new Event("refreshNotifications"));
      } else {
          showError(data.error || t.addcrush.messages.error);
      }
    } catch (error) {
      console.error("Error adding crush:", error);
        showError(t.addcrush.messages.error);
    } finally {
      setIsAdding(null);
    }
  };

  const params = useParams();
  const lang = params.lang as string;
  const t = getTranslation(lang as 'fr' | 'en');
  const router = useRouter();
  if (!showModal) return null;

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 modal-backdrop"
        onClick={handleClose}
      >
      <div
        className="bg-gradient-to-br from-[#1C1F3F]/95 to-[#252951]/95 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-white/10 modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#FF4F81]/5 to-transparent">
          <h2 className="text-white font-bold text-2xl flex items-center gap-3">
            <div className="bg-[#FF4F81]/20 p-2 rounded-xl">
              <Heart className="text-[#FF4F81]" size={24} />
            </div>
            {t.addcrush.modalTitle}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer rounded-full p-2"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-white/10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-[#FF4F81] transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.addcrush.searchPlaceholder}
              className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#FF4F81] focus:bg-white/10 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="text-[#FF4F81] animate-spin mb-4" size={48} />
              <p className="text-white/60">{t.addcrush.searching}</p>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="text-white/20 mb-4" size={64} />
              <p className="text-white/60 text-lg">
                {t.addcrush.searchHelpTitle}
              </p>
              <p className="text-white/40 text-sm mt-2">
                {t.addcrush.searchHelpSubtitle}
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-white/20 text-6xl mb-4">🔍</div>
              <p className="text-white/60 text-lg">
                {t.addcrush.noResults}
              </p>
              <p className="text-white/40 text-sm mt-2">
                {t.addcrush.tryAnotherSearch}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF4F81]/30 rounded-xl p-4 transition-all duration-200 cursor-pointer"
                  onClick={() => router.push(`/${lang}/user/${user.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF4F81]/50 flex-shrink-0">
                      <Image
                        src={user.image || "/images/users/avatar.webp"}
                        alt={user.name || "User"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {user.name}
                      </h3>
                      {/* Email masqué lors de la recherche */}
                      {(user.age || user.location) && (
                        <p className="text-white/40 text-xs mt-1">
                          {user.age && t.addcrush.age.replace("{{count}}", String(user.age))}
                          {user.age && user.location && " • "}
                          {user.location}
                        </p>
                      )}
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleAddCrush(user.id); }}
                      disabled={isAdding === user.id}
                      className="bg-gradient-to-r from-[#FF4F81] to-[#FF3D6D] hover:from-[#FF3D6D] hover:to-[#FF2B59] text-white px-6 py-2.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 flex-shrink-0 hover:scale-105 active:scale-95"
                    >
                      {isAdding === user.id ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span className="hidden sm:inline">Ajout...</span>
                        </>
                      ) : (
                        <>
                          <Heart size={16} />
                          <span className="hidden sm:inline">{t.addcrush.addButton}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-white/50 text-sm mt-3 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AddCrushModal;
