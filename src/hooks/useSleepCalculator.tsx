/**
 * Custom hook for sleep cycle calculations
 * Refactored to use services and generic persistence
 */

import { useCallback } from "react";
import { SleepMode } from "@/types/sleep.types";
import { syncService } from "@/services/sync.service";
import { sleepService } from "@/services/sleep.service";
import { STORAGE_KEYS } from "@/config/constants";
import { useMultiPersistence } from "./usePersistence";

interface SleepState {
  mode: SleepMode;
  time: string;
  calculatedTimes: string[];
  selectedTime: string;
}

export function useSleepCalculator() {
  // Use generic persistence hook for state management
  const { state, updateField, isLoaded } = useMultiPersistence<SleepState>({
    storageKeys: {
      mode: STORAGE_KEYS.SLEEP_MODE,
      time: STORAGE_KEYS.SLEEP_TIME,
      calculatedTimes: STORAGE_KEYS.SLEEP_CALCULATED_TIMES,
      selectedTime: STORAGE_KEYS.SLEEP_SELECTED_TIME,
    },
    initialValues: {
      mode: "wake",
      time: "",
      calculatedTimes: [],
      selectedTime: "",
    },
    loadFromBackend: async () => {
      const preferences = await syncService.loadSleepPreferences();
      return preferences ? {
        mode: preferences.mode,
        time: preferences.time,
        calculatedTimes: preferences.calculatedTimes || [],
        selectedTime: preferences.selectedTime || "",
      } : null;
    },
    syncToBackend: async (data) => {
      await syncService.syncSleepPreferences(data);
    },
  });

  // Calculation logic - delegated to service
  const calculateTimes = useCallback(() => {
    if (!state.time) return;

    const sleepTimes = sleepService.calculateSleepTimes({
      time: state.time,
      mode: state.mode,
    });

    const times = sleepTimes.map(st => st.time);
    updateField("calculatedTimes", times);
  }, [state.time, state.mode, updateField]);

  // Helper to generate cycle labels - delegated to service
  const getCycleLabel = useCallback((index: number) => {
    const cycles = 6 - index; // MAX_CYCLES - index
    return sleepService.getCycleLabel(cycles);
  }, []);

  // Mode change handler - clears calculated times
  const changeMode = useCallback((newMode: SleepMode) => {
    updateField("mode", newMode);
    updateField("calculatedTimes", []);
  }, [updateField]);

  // Setters using updateField
  const setTime = useCallback((time: string) => {
    updateField("time", time);
  }, [updateField]);

  const setSelectedTime = useCallback((time: string) => {
    updateField("selectedTime", time);
  }, [updateField]);

  return {
    mode: state.mode,
    time: state.time,
    calculatedTimes: state.calculatedTimes,
    selectedTime: state.selectedTime,
    setTime,
    setSelectedTime,
    calculateTimes,
    getCycleLabel,
    changeMode,
  };
}
