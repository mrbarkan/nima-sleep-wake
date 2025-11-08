/**
 * Fasting-related type definitions
 */

export interface FastingPhase {
  id: string;
  name: string;
  description: string;
  startHour: number;
  endHour: number;
  color: string;
  benefits: string[];
  icon: string;
}

export interface FastingState {
  lastMealTime: string;
  targetDuration: number;
  currentPhase: string | null;
  estimatedBreakTime: string;
}

export interface FastingCalculation {
  phases: FastingPhase[];
  currentPhase: FastingPhase | null;
  timeInCurrentPhase: number;
  progressPercentage: number;
  nextPhaseName: string;
  timeToNextPhase: number;
  breakfastTime: string;
  fastingEndTime: Date;
}
