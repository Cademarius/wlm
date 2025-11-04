"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Composant de Skeleton pour une carte de crush (UserCard)
export const CrushCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-2xl p-6 border border-[#FF4F81]/20 overflow-hidden relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="relative">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar skeleton */}
          <div className="relative flex-shrink-0">
            <Skeleton variant="rounded" width={80} height={80} />
            {/* Online indicator skeleton */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600/40 rounded-full border-2 border-[#1C1F3F] animate-pulse" />
          </div>
          
          {/* User info skeleton */}
          <div className="flex-1 min-w-0 pt-1 space-y-2">
            <Skeleton width="70%" height={24} />
            <Skeleton width="90%" height={16} className="opacity-70" />
          </div>
        </div>

        {/* User details skeleton */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton width="40%" height={14} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton width="60%" height={14} />
          </div>
        </div>

        {/* Status badge skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Skeleton width={120} height={20} className="rounded-full" />
          <Skeleton width={60} height={12} />
        </div>
      </div>
    </div>
  );
};

// Composant de Skeleton pour liste de cards
interface CrushListSkeletonProps {
  count?: number;
}

export const CrushListSkeleton: React.FC<CrushListSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          <CrushCardSkeleton />
        </div>
      ))}
    </div>
  );
};

// Composant de Skeleton pour le header de profile
export const ProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#2A2E5A] to-[#1C1F3F] rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-4 sm:mb-6 border border-[#FF4F81]/30 shadow-2xl overflow-hidden relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-6">
        {/* Avatar skeleton */}
        <div className="relative group">
          <Skeleton variant="circular" width={128} height={128} className="border-4 border-[#FF4F81]/40" />
          <div className="absolute bottom-0 right-0 bg-[#FF4F81]/40 p-2 rounded-full w-10 h-10 animate-pulse" />
        </div>
        
        {/* User info skeleton */}
        <div className="flex-1 text-center md:text-left w-full space-y-3">
          <Skeleton width="40%" height={32} className="mx-auto md:mx-0 rounded-lg" />
          <Skeleton width="60%" height={20} className="mx-auto md:mx-0 opacity-70 rounded-lg" />
          
          {/* Stats skeleton */}
          <div className="flex justify-center md:justify-start gap-6 sm:gap-8 mt-4 sm:mt-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton width={40} height={32} className="mx-auto rounded-lg" />
                <Skeleton width={60} height={16} className="opacity-60 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="w-full md:w-auto md:self-start flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Skeleton width={140} height={44} className="rounded-full" />
          <Skeleton width={140} height={44} className="rounded-full hidden xl:block" />
        </div>
      </div>
    </div>
  );
};

// Composant de Skeleton pour les sections de profile
export const ProfileSectionSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-[#FF4F81]/20 overflow-hidden relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <Skeleton variant="circular" width={48} height={48} className="bg-[#FF4F81]/20" />
          <Skeleton width="50%" height={24} className="rounded-lg" />
        </div>
        <Skeleton width="80%" height={16} className="mb-3 opacity-60 rounded" />
        <Skeleton width={80} height={48} className="mt-3 sm:mt-4 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
