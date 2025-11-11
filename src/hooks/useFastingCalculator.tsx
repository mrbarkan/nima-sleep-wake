/**
 * Hook for managing fasting calculations and state
 */

import { useState, useCallback, useEffect } from "react";
import { usePersistence, useMultiPersistence } from "./usePersistence";
import { fastingService } from "@/services/fasting.service";
import { syncService } from "@/services/sync.service";
import { FastingState, FastingCalculation } from "@/types/fasting.types";
import { STORAGE_KEYS } from "@/config/constants";
import { useSettings } from "./useSettings";
import { useSleepCalculator } from "./useSleepCalculator";

export const useFastingCalculator = () => {
  const { settings } = useSettings();
  
  const { state, updateField } = useMultiPersistence<{
    lastMealTime: string;
    targetDuration: number;
  }>({
    storageKeys: {
      lastMealTime: STORAGE_KEYS.FASTING_LAST_MEAL,
      targetDuration: STORAGE_KEYS.FASTING_TARGET_DURATION,
    },
    initialValues: {
      lastMealTime: "12:00",
      targetDuration: 16,
    },
    loadFromBackend: async () => {
      const data = await syncService.loadFastingData();
      return data;
    },
    syncToBackend: async (data) => {
      await syncService.syncFastingData(data);
    },
  });

  const [calculation, setCalculation] = useState<FastingCalculation | null>(
    null
  );
  const [integrationSuggestion, setIntegrationSuggestion] = useState<string | null>(null);

  // Apply integrations when enabled
  useEffect(() => {
    if (settings.integrations.sleepWithFasting) {
      const sleepTime = localStorage.getItem(STORAGE_KEYS.SLEEP_TIME);
      if (sleepTime) {
        const suggested = fastingService.suggestLastMealFromSleep(sleepTime);
        setIntegrationSuggestion(`💡 Sugestão: Última refeição às ${suggested} (2h antes de dormir)`);
      }
    } else {
      setIntegrationSuggestion(null);
    }
  }, [settings.integrations.sleepWithFasting]);

  const calculateTimeline = useCallback(() => {
    if (!fastingService.isValidTimeFormat(state.lastMealTime)) {
      return;
    }

    const result = fastingService.calculateFastingTimeline(
      state.lastMealTime,
      state.targetDuration
    );
    setCalculation(result);
  }, [state.lastMealTime, state.targetDuration]);

  const resetCalculation = useCallback(() => {
    setCalculation(null);
  }, []);

  const setLastMealTime = useCallback((time: string) => {
    updateField("lastMealTime", time);
  }, [updateField]);

  const setTargetDuration = useCallback((duration: number) => {
    updateField("targetDuration", duration);
  }, [updateField]);

  return {
    lastMealTime: state.lastMealTime,
    targetDuration: state.targetDuration,
    calculation,
    integrationSuggestion,
    setLastMealTime,
    setTargetDuration,
    calculateTimeline,
    resetCalculation,
  };
};
