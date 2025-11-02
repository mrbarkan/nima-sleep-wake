/**
 * Sleep calculation service
 * Contains all business logic for sleep cycle calculations
 */

import { SLEEP_CONSTANTS } from "@/config/constants";
import { SleepMode } from "@/types/sleep.types";

interface SleepCalculationParams {
  time: string;
  mode: SleepMode;
}

interface SleepTime {
  time: string;
  cycles: number;
  hours: number;
  recommended: boolean;
}

class SleepService {
  /**
   * Calculates optimal sleep/wake times based on sleep cycles
   */
  calculateSleepTimes(params: SleepCalculationParams): SleepTime[] {
    const { time, mode } = params;
    
    if (!time || !this.isValidTimeFormat(time)) {
      return [];
    }

    const [hours, minutes] = time.split(":").map(Number);
    const referenceDate = new Date();
    referenceDate.setHours(hours, minutes, 0, 0);

    const times: SleepTime[] = [];
    const { CYCLE_MINUTES, FALL_ASLEEP_TIME, MAX_CYCLES, MIN_CYCLES, RECOMMENDED_MIN_HOURS, RECOMMENDED_MAX_HOURS } = SLEEP_CONSTANTS;

    if (mode === "wake") {
      // Calculate bedtimes based on wake time
      for (let cycles = MAX_CYCLES; cycles >= MIN_CYCLES; cycles--) {
        const sleepTime = new Date(referenceDate);
        sleepTime.setMinutes(sleepTime.getMinutes() - (cycles * CYCLE_MINUTES + FALL_ASLEEP_TIME));
        
        const totalHours = (cycles * CYCLE_MINUTES) / 60;
        const isRecommended = totalHours >= RECOMMENDED_MIN_HOURS && totalHours <= RECOMMENDED_MAX_HOURS;
        
        times.push({
          time: sleepTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cycles,
          hours: totalHours,
          recommended: isRecommended,
        });
      }
    } else {
      // Calculate wake times based on bedtime
      const bedTime = new Date(referenceDate);
      bedTime.setMinutes(bedTime.getMinutes() + FALL_ASLEEP_TIME);
      
      for (let cycles = MAX_CYCLES; cycles >= MIN_CYCLES; cycles--) {
        const wakeTime = new Date(bedTime);
        wakeTime.setMinutes(wakeTime.getMinutes() + (cycles * CYCLE_MINUTES));
        
        const totalHours = (cycles * CYCLE_MINUTES) / 60;
        const isRecommended = totalHours >= RECOMMENDED_MIN_HOURS && totalHours <= RECOMMENDED_MAX_HOURS;
        
        times.push({
          time: wakeTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cycles,
          hours: totalHours,
          recommended: isRecommended,
        });
      }
    }

    return times;
  }

  /**
   * Gets the label for a given number of sleep cycles
   */
  getCycleLabel(cycles: number): string {
    const hours = (cycles * 1.5).toFixed(1);
    return `${cycles} ciclos (${hours}h)`;
  }

  /**
   * Validates time format (HH:MM)
   */
  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }
}

export const sleepService = new SleepService();
