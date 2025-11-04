"use client";

import { Loader2, Heart } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'compact' | 'full';
  icon?: 'spinner' | 'heart';
}

export default function LoadingState({ 
  message = "Chargement...",
  variant = 'default',
  icon = 'spinner'
}: LoadingStateProps) {
  const Icon = icon === 'heart' ? Heart : Loader2;
  const iconAnimation = icon === 'heart' ? 'animate-bounce' : 'animate-spin';
  
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        <Icon className="text-[#FF4F81] animate-spin" size={24} />
        <span className="text-white/60 text-sm">{message}</span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className="fixed inset-0 bg-[#1C1F3F]/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-8 border border-[#FF4F81]/30 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <Icon className={`text-[#FF4F81] ${iconAnimation}`} size={48} />
            <p className="text-white font-medium text-lg">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Icon className={`text-[#FF4F81] ${iconAnimation} mb-4`} size={48} />
      <p className="text-white/60">{message}</p>
    </div>
  );
}
