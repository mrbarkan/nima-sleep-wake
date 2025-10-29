/**
 * Caffeine-related type definitions
 */

export interface CaffeineSchedule {
  time: string;
  source: string;
  description: string;
}

export interface CaffeineRotation {
  source: string;
  description: string;
  duration: number;
}

export interface CaffeineState {
  wakeTime: string;
  schedule: CaffeineSchedule[];
}
