/**
 * Haptic feedback utility for mobile and desktop
 * Uses Vibration API for mobile devices
 */

export const haptics = {
  /**
   * Check if vibration is supported by the device
   */
  isSupported: (): boolean => {
    return 'vibrate' in navigator;
  },

  /**
   * Light haptic feedback - ideal for drag start
   * Duration: 10ms
   */
  light: (): void => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium haptic feedback - ideal for drop action
   * Duration: 20ms
   */
  medium: (): void => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Success haptic feedback - ideal for successful reorder
   * Pattern: [10ms vibrate, 50ms pause, 10ms vibrate]
   */
  success: (): void => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Generic trigger for custom patterns
   * @param pattern - Single duration or array of durations [vibrate, pause, vibrate, ...]
   */
  trigger: (pattern: number | number[]): void => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },
};
