"use client";

import Image from "next/image";
import { Heart, MapPin, Calendar, Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    age: number | null;
    location: string | null;
  } | null;
  status: string;
  statusLabel: {
    matched: string;
    pending?: string;
    admires?: string;
  };
  type: "crush" | "admirer";
  index?: number;
}

export default function UserCard({ user, status, statusLabel, type, index = 0 }: UserCardProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-[#2A2E5A]/60 to-[#1C1F3F]/60 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
        <div className="text-white/40 text-center py-8">
          Utilisateur non trouvé
        </div>
      </div>
    );
  }

  const isMatched = status === "matched";
  // Les admirateurs sont floutés tant qu'il n'y a pas de match
  const isBlurred = type === "admirer" && !isMatched;
  // La card n'est cliquable que si c'est un crush OU si c'est un admirer avec match
  const isClickable = type === "crush" || isMatched;

  const handleClick = () => {
    if (!isClickable) return; // Empêcher le clic si la card est bloquée
    router.push(`/${lang}/user/${user.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className={`group relative bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-2xl overflow-hidden border border-[#FF4F81]/20 transition-all duration-500 transform ${
        isClickable 
          ? "hover:border-[#FF4F81]/60 hover:shadow-2xl hover:shadow-[#FF4F81]/30 hover:scale-[1.03] active:scale-[0.98] cursor-pointer" 
          : "cursor-not-allowed opacity-90"
      }`}
      style={{
        animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Gradient overlay effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#FF4F81]/0 via-[#FF4F81]/0 to-[#FF4F81]/0 transition-all duration-500 pointer-events-none ${
        isClickable ? "group-hover:from-[#FF4F81]/5 group-hover:via-[#FF4F81]/10 group-hover:to-[#FF4F81]/5" : ""
      }`} />
      
      <div className="relative p-6">
        {/* Avatar and main info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#FF4F81]/50 transition-all duration-300 shadow-lg ${
              isClickable ? "group-hover:border-[#FF4F81] group-hover:shadow-[#FF4F81]/50" : ""
            }`}>
              <Image
                src={user.image || "/images/users/avatar.webp"}
                alt={user.name || "User"}
                width={80}
                height={80}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isBlurred ? "blur-xl" : isClickable ? "group-hover:scale-110" : ""
                }`}
              />
              {/* Icône de cadenas pour les admirateurs non-matchés */}
              {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Lock size={24} className="text-white" />
                </div>
              )}
            </div>
            {/* Online indicator - masqué si blurred */}
            {!isBlurred && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-[#1C1F3F] shadow-lg" />
            )}
          </div>
          
          <div className="flex-1 min-w-0 pt-1">
            <h4 className={`text-white font-bold text-xl mb-1 truncate transition-colors duration-300 ${
              isBlurred ? "blur-sm" : isClickable ? "group-hover:text-[#FF4F81]" : ""
            }`}>
              {isBlurred ? "••••••" : user.name}
            </h4>
            <p className={`text-white/50 text-sm truncate mb-2 ${isBlurred ? "blur-sm" : ""}`}>
              {isBlurred ? "••••••@••••.•••" : user.email}
            </p>
          </div>
        </div>

        {/* User details */}
        <div className="space-y-2 mb-4">
          {user.age && (
            <div className={`flex items-center gap-2 text-white/70 ${isBlurred ? "blur-sm" : ""}`}>
              <Calendar size={16} className="text-[#FF4F81]/70 flex-shrink-0" />
              <span className="text-sm">{isBlurred ? "•• ans" : `${user.age} ans`}</span>
            </div>
          )}
          {user.location && (
            <div className={`flex items-center gap-2 text-white/70 ${isBlurred ? "blur-sm" : ""}`}>
              <MapPin size={16} className="text-[#FF4F81]/70 flex-shrink-0" />
              <span className="text-sm truncate">{isBlurred ? "••••••, ••••••" : user.location}</span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Heart 
              size={16} 
              className={isMatched ? "text-green-400 fill-green-400" : "text-yellow-400"} 
            />
            <span
              className={`text-sm font-semibold ${
                isMatched
                  ? "text-green-400"
                  : type === "crush"
                  ? "text-yellow-400"
                  : "text-blue-400"
              }`}
            >
              {isMatched 
                ? statusLabel.matched 
                : type === "crush" 
                ? statusLabel.pending 
                : statusLabel.admires}
            </span>
          </div>
          
          {/* Action hint */}
          {isClickable ? (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-[#FF4F81] font-medium">
                Voir plus →
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Lock size={12} className="text-white/40" />
              <span className="text-xs text-white/40 font-medium">
                Verrouillé
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient decoration */}
      <div className={`h-1 bg-gradient-to-r from-transparent via-[#FF4F81] to-transparent transition-opacity duration-500 ${
        isClickable ? "opacity-0 group-hover:opacity-100" : "opacity-0"
      }`} />
    </div>
  );
}