/**
 * Caffeine service - handles caffeine scheduling calculations
 */

import { CaffeineSchedule, CaffeineRotation } from "@/types/caffeine.types";
import { CAFFEINE_CONFIG } from "@/config/constants";

const CAFFEINE_ROTATION: CaffeineRotation[] = [
  { source: "Café", description: "Efeito rápido (30-45 min)", duration: 5 },
  { source: "Chá verde", description: "Efeito moderado e prolongado", duration: 3 },
  { source: "Chá preto", description: "Alternativa ao café", duration: 3 },
  { source: "Café", description: "Reforço vespertino", duration: 5 },
];

class CaffeineService {
  /**
   * Calculate caffeine schedule based on wake time
   */
  calculateSchedule(wakeTime: string): CaffeineSchedule[] {
    if (!wakeTime) {
      throw new Error("Wake time is required for caffeine calculation");
    }

    const [hours, minutes] = wakeTime.split(":").map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid time format");
    }

    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0, 0);

    const scheduleItems: CaffeineSchedule[] = [];

    // First dose: 30-60 min after waking
    const firstDose = new Date(wakeDate);
    firstDose.setMinutes(firstDose.getMinutes() + CAFFEINE_CONFIG.FIRST_DOSE_DELAY);

    // Add doses at intervals
    CAFFEINE_CONFIG.INTERVALS.forEach((interval, index) => {
      const doseTime = new Date(firstDose);
      doseTime.setMinutes(doseTime.getMinutes() + interval);

      // Don't suggest caffeine after max hour (3 PM)
      if (doseTime.getHours() < CAFFEINE_CONFIG.MAX_HOUR) {
        const rotation = CAFFEINE_ROTATION[index % CAFFEINE_ROTATION.length];
        scheduleItems.push({
          time: doseTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          source: rotation.source,
          description: rotation.description,
        });
      }
    });

    return scheduleItems;
  }

  /**
   * Get caffeine rotation data
   */
  getCaffeineRotation(): CaffeineRotation[] {
    return [...CAFFEINE_ROTATION];
  }

  /**
   * Validate time format
   */
  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Check if a given time is within safe caffeine consumption window
   */
  isWithinSafeWindow(time: string): boolean {
    const [hours] = time.split(":").map(Number);
    return hours < CAFFEINE_CONFIG.MAX_HOUR;
  }
}

export const caffeineService = new CaffeineService();
