/**
 * Custom hook for caffeine scheduling
 * Refactored to use services and generic persistence
 */

import { useState, useCallback } from "react";
import { CaffeineSchedule } from "@/types/caffeine.types";
import { syncService } from "@/services/sync.service";
import { caffeineService } from "@/services/caffeine.service";
import { STORAGE_KEYS } from "@/config/constants";
import { useMultiPersistence } from "./usePersistence";

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

  // Calculation logic - delegated to service
  const calculateSchedule = useCallback(() => {
    if (!state.wakeTime) return;

    const scheduleItems = caffeineService.calculateSchedule(state.wakeTime);
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
