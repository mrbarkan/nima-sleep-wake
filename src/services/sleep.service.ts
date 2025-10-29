/**
 * Sleep service - handles sleep cycle calculations
 */

import { SLEEP_CONSTANTS } from "@/config/constants";

export interface SleepCalculationParams {
  time: string;
  mode: "wake" | "sleep";
}

export interface SleepTime {
  time: string;
  cycles: number;
  hours: number;
  isRecommended?: boolean;
  recommendationType?: "minimum" | "ideal";
}

class SleepService {
  /**
   * Calculate sleep times based on input time and mode
   */
  calculateSleepTimes(params: SleepCalculationParams): SleepTime[] {
    const { time, mode } = params;
    
    if (!time) {
      throw new Error("Time is required for sleep calculation");
    }

    const [hours, minutes] = time.split(":").map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid time format");
    }

    const referenceDate = new Date();
    referenceDate.setHours(hours, minutes, 0, 0);

    const { CYCLE_MINUTES, FALL_ASLEEP_TIME, MAX_CYCLES } = SLEEP_CONSTANTS;
    const sleepTimes: SleepTime[] = [];

    if (mode === "wake") {
      // Calculate bedtimes based on wake time
      for (let cycles = MAX_CYCLES; cycles >= 1; cycles--) {
        const sleepTime = new Date(referenceDate);
        sleepTime.setMinutes(
          sleepTime.getMinutes() - (cycles * CYCLE_MINUTES + FALL_ASLEEP_TIME)
        );

        const calculatedTime = sleepTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const hoursOfSleep = (cycles * 1.5);

        sleepTimes.push({
          time: calculatedTime,
          cycles,
          hours: hoursOfSleep,
          isRecommended: hoursOfSleep === 7.5 || hoursOfSleep === 9,
          recommendationType: hoursOfSleep === 7.5 ? "minimum" : hoursOfSleep === 9 ? "ideal" : undefined,
        });
      }
    } else {
      // Calculate wake times based on bedtime
      const bedTime = new Date(referenceDate);
      bedTime.setMinutes(bedTime.getMinutes() + FALL_ASLEEP_TIME);

      for (let cycles = MAX_CYCLES; cycles >= 1; cycles--) {
        const wakeTime = new Date(bedTime);
        wakeTime.setMinutes(wakeTime.getMinutes() + cycles * CYCLE_MINUTES);

        const calculatedTime = wakeTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const hoursOfSleep = (cycles * 1.5);

        sleepTimes.push({
          time: calculatedTime,
          cycles,
          hours: hoursOfSleep,
          isRecommended: hoursOfSleep === 7.5 || hoursOfSleep === 9,
          recommendationType: hoursOfSleep === 7.5 ? "minimum" : hoursOfSleep === 9 ? "ideal" : undefined,
        });
      }
    }

    return sleepTimes;
  }

  /**
   * Get formatted cycle label
   */
  getCycleLabel(cycles: number): string {
    const hours = (cycles * 1.5).toFixed(1);
    return `${cycles} ciclos (${hours}h)`;
  }

  /**
   * Validate time format
   */
  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }
}

export const sleepService = new SleepService();
