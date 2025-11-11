/**
 * Caffeine scheduling service
 * Contains all business logic for caffeine consumption scheduling
 */

import { CAFFEINE_CONFIG } from "@/config/constants";
import { CaffeineSchedule, CaffeineRotation } from "@/types/caffeine.types";

const CAFFEINE_ROTATION: CaffeineRotation[] = [
  { source: "Café", description: "Efeito rápido (30-45 min)", duration: 5 },
  { source: "Chá verde", description: "Efeito moderado e prolongado", duration: 3 },
  { source: "Chá preto", description: "Alternativa ao café", duration: 3 },
  { source: "Café", description: "Reforço vespertino", duration: 5 },
];

class CaffeineService {
  /**
   * Filters caffeine options for fasting compatibility
   */
  filterForFasting(
    schedule: CaffeineSchedule[],
    isFasting: boolean
  ): CaffeineSchedule[] {
    if (!isFasting) {
      return schedule;
    }

    // During fasting, only black coffee is allowed
    return schedule.map((item) => {
      if (item.source === "Café") {
        return {
          ...item,
          description: "☕ Café preto (compatível com jejum)",
        };
      }
      // Remove tea options during fasting
      return {
        ...item,
        source: "Café",
        description: "☕ Café preto (compatível com jejum)",
      };
    });
  }

  /**
   * Calculates caffeine schedule based on wake time
   */
  calculateSchedule(wakeTime: string): CaffeineSchedule[] {
    if (!wakeTime || !this.isValidTimeFormat(wakeTime)) {
      return [];
    }

    const [hours, minutes] = wakeTime.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0, 0);

    const scheduleItems: CaffeineSchedule[] = [];
    
    // First dose: configured minutes after waking
    const firstDose = new Date(wakeDate);
    firstDose.setMinutes(firstDose.getMinutes() + CAFFEINE_CONFIG.FIRST_DOSE_DELAY);

    // Add doses at configured intervals
    CAFFEINE_CONFIG.INTERVALS.forEach((interval, index) => {
      const doseTime = new Date(firstDose);
      doseTime.setMinutes(doseTime.getMinutes() + interval);
      
      // Don't suggest caffeine after max hour (default 3 PM)
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
   * Gets the caffeine rotation data
   */
  getCaffeineRotation(): CaffeineRotation[] {
    return [...CAFFEINE_ROTATION];
  }

  /**
   * Validates time format (HH:MM)
   */
  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Checks if a given time is within safe caffeine consumption window
   */
  isWithinSafeWindow(time: string): boolean {
    if (!this.isValidTimeFormat(time)) return false;
    
    const [hours] = time.split(":").map(Number);
    return hours < CAFFEINE_CONFIG.MAX_HOUR;
  }
}

export const caffeineService = new CaffeineService();
