/**
 * Custom hook for caffeine scheduling
 * Refactored to use generic persistence hook
 */

import { useState, useCallback } from "react";
import { CaffeineSchedule, CaffeineRotation } from "@/types/caffeine.types";
import { syncService } from "@/services/sync.service";
import { STORAGE_KEYS, CAFFEINE_CONFIG } from "@/config/constants";
import { useMultiPersistence } from "./usePersistence";

const caffeineRotation: CaffeineRotation[] = [
  { source: "Café", description: "Efeito rápido (30-45 min)", duration: 5 },
  { source: "Chá verde", description: "Efeito moderado e prolongado", duration: 3 },
  { source: "Chá preto", description: "Alternativa ao café", duration: 3 },
  { source: "Café", description: "Reforço vespertino", duration: 5 },
];

interface CaffeineState {
  wakeTime: string;
  schedule: CaffeineSchedule[];
}

export function useCaffeineScheduler() {
  // Use generic persistence hook for state management
  const { state, updateField, isLoaded } = useMultiPersistence<CaffeineState>({
    storageKeys: {
      wakeTime: STORAGE_KEYS.CAFFEINE_WAKE_TIME,
      schedule: STORAGE_KEYS.CAFFEINE_SCHEDULE,
    },
    initialValues: {
      wakeTime: "",
      schedule: [],
    },
    loadFromBackend: async () => {
      const settings = await syncService.loadCaffeineSettings();
      return settings ? {
        wakeTime: settings.wakeTime,
        schedule: settings.schedule || [],
      } : null;
    },
    syncToBackend: async (data) => {
      await syncService.syncCaffeineSettings(data);
    },
  });

  // Local UI state - not persisted
  const [openNotifications, setOpenNotifications] = useState<{ [key: number]: boolean }>({});

  // Calculation logic - pure function, no side effects
  const calculateSchedule = useCallback(() => {
    if (!state.wakeTime) return;

    const [hours, minutes] = state.wakeTime.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0);

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
        const rotation = caffeineRotation[index % caffeineRotation.length];
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

    updateField("schedule", scheduleItems);
  }, [state.wakeTime, updateField]);

  // Setter using updateField
  const setWakeTime = useCallback((time: string) => {
    updateField("wakeTime", time);
  }, [updateField]);

  return {
    wakeTime: state.wakeTime,
    schedule: state.schedule,
    openNotifications,
    setWakeTime,
    setOpenNotifications,
    calculateSchedule,
  };
}
