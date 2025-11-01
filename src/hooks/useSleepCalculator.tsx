/**
 * Custom hook for sleep cycle calculations
 * Refactored to use generic persistence hook
 */

import { useCallback } from "react";
import { SleepMode } from "@/types/sleep.types";
import { syncService } from "@/services/sync.service";
import { STORAGE_KEYS, SLEEP_CONSTANTS } from "@/config/constants";
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

  // Calculation logic - pure function, no side effects
  const calculateTimes = useCallback(() => {
    if (!state.time) return;

    const [hours, minutes] = state.time.split(":").map(Number);
    const referenceDate = new Date();
    referenceDate.setHours(hours, minutes, 0);

    const times: string[] = [];
    const { CYCLE_MINUTES, FALL_ASLEEP_TIME, MAX_CYCLES } = SLEEP_CONSTANTS;

    if (state.mode === "wake") {
      // Calculate bedtimes based on wake time
      for (let cycles = MAX_CYCLES; cycles >= 1; cycles--) {
        const sleepTime = new Date(referenceDate);
        sleepTime.setMinutes(sleepTime.getMinutes() - (cycles * CYCLE_MINUTES + FALL_ASLEEP_TIME));
        
        times.push(sleepTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }));
      }
    } else {
      // Calculate wake times based on bedtime
      const bedTime = new Date(referenceDate);
      bedTime.setMinutes(bedTime.getMinutes() + FALL_ASLEEP_TIME);
      
      for (let cycles = MAX_CYCLES; cycles >= 1; cycles--) {
        const wakeTime = new Date(bedTime);
        wakeTime.setMinutes(wakeTime.getMinutes() + (cycles * CYCLE_MINUTES));
        
        times.push(wakeTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }));
      }
    }

    updateField("calculatedTimes", times);
  }, [state.time, state.mode, updateField]);

  // Helper to generate cycle labels
  const getCycleLabel = useCallback((index: number) => {
    const cycles = SLEEP_CONSTANTS.MAX_CYCLES - index;
    const hours = (cycles * 1.5).toFixed(1);
    return `${cycles} ciclos (${hours}h)`;
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
