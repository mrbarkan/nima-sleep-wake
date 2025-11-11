/**
 * Custom hook for caffeine scheduling
 * Refactored to use services and generic persistence
 */

import { useState, useCallback, useEffect } from "react";
import { CaffeineSchedule } from "@/types/caffeine.types";
import { syncService } from "@/services/sync.service";
import { caffeineService } from "@/services/caffeine.service";
import { STORAGE_KEYS } from "@/config/constants";
import { useMultiPersistence } from "./usePersistence";
import { useSettings } from "./useSettings";

interface CaffeineState {
  wakeTime: string;
  schedule: CaffeineSchedule[];
}

export function useCaffeineScheduler() {
  const { settings } = useSettings();
  
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
  const [filteredSchedule, setFilteredSchedule] = useState<CaffeineSchedule[]>([]);

  // Apply fasting filter when integration is enabled
  useEffect(() => {
    if (settings.integrations.fastingWithCaffeine && state.schedule.length > 0) {
      const lastMealTime = localStorage.getItem(STORAGE_KEYS.FASTING_LAST_MEAL);
      const targetDuration = localStorage.getItem(STORAGE_KEYS.FASTING_TARGET_DURATION);
      
      // Simple check: if fasting is active (within target duration)
      const isFasting = lastMealTime && targetDuration;
      
      const filtered = caffeineService.filterForFasting(state.schedule, !!isFasting);
      setFilteredSchedule(filtered);
    } else {
      setFilteredSchedule(state.schedule);
    }
  }, [settings.integrations.fastingWithCaffeine, state.schedule]);

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
    schedule: filteredSchedule,
    openNotifications,
    setWakeTime,
    setOpenNotifications,
    calculateSchedule,
    integrationActive: settings.integrations.fastingWithCaffeine,
  };
}
