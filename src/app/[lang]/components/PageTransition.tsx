"use client";

import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  delay?: number;
}

export default function PageTransition({ 
  children, 
  isLoading = false,
  className = '',
  delay = 0
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(true); // Commence visible par défaut
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Activer l'animation seulement après le premier render
    setShouldAnimate(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
  }, [isLoading, delay]);

  return (
    <div 
      className={`${shouldAnimate ? 'transition-opacity duration-300' : ''} ${
        isLoading 
          ? 'opacity-50 pointer-events-none' 
          : isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
