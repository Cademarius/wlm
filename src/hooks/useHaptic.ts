/**
 * Haptic Feedback Utility
 * Provides haptic vibration feedback for touch interactions
 * Works on mobile devices that support the Vibration API
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

/**
 * Trigger a haptic feedback vibration
 * @param pattern - The type of haptic feedback pattern
 */
export const triggerHaptic = (pattern: HapticPattern = 'light'): void => {
  // Check if vibration API is supported
  if (!navigator.vibrate) {
    return;
  }

  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10], // Double tap
    error: [10, 30, 10, 30, 10], // Triple tap
    warning: [20, 50, 20], // Double strong tap
  };

  try {
    navigator.vibrate(patterns[pattern]);
  } catch (error) {
    // Silently fail if vibration is not available
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Hook for haptic feedback in React components
 */
export const useHaptic = () => {
  return {
    triggerHaptic,
    isSupported: isHapticSupported(),
  };
};

const hapticUtils = {
  triggerHaptic,
  isHapticSupported,
  useHaptic,
};

export default hapticUtils;
