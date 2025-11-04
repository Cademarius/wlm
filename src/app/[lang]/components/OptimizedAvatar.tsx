"use client";

import React from 'react';
import Image from 'next/image';

interface OptimizedAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
  onImageClick?: () => void;
}

const sizeMap = {
  sm: { container: 'w-12 h-12', image: 64 },
  md: { container: 'w-20 h-20', image: 128 },
  lg: { container: 'w-24 h-24 sm:w-32 sm:h-32', image: 256 },
  xl: { container: 'w-32 h-32 sm:w-40 sm:h-40', image: 320 }
};

export const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  src,
  alt,
  size = 'lg',
  className = '',
  priority = false,
  onImageClick
}) => {
  const { container, image } = sizeMap[size];

  return (
    <div 
      className={`${container} rounded-full overflow-hidden bg-gradient-to-br from-[#2A2E5A] to-[#1C1F3F] ${className}`}
      onClick={onImageClick}
    >
      <Image
        src={src}
        alt={alt}
        width={image}
        height={image}
        quality={95}
        priority={priority}
        sizes={`${image}px`}
        className="object-cover w-full h-full"
        style={{
          imageRendering: '-webkit-optimize-contrast',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0) scale(1.001)',
          WebkitFontSmoothing: 'subpixel-antialiased',
        }}
        unoptimized={false}
      />
    </div>
  );
};

export default OptimizedAvatar;
