/**
 * Sleep-related type definitions
 */

export type SleepMode = "wake" | "sleep";

export interface SleepTime {
  hours: number;
  minutes: number;
}

export interface SleepCalculation {
  time: string;
  cycles: number;
  hours: number;
}

export interface SleepState {
  mode: SleepMode;
  time: string;
  calculatedTimes: string[];
  selectedTime: string;
}
