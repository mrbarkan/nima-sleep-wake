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
    calculation: FastingCalculation | null;
  }>({
    storageKeys: {
      lastMealTime: STORAGE_KEYS.FASTING_LAST_MEAL,
      targetDuration: STORAGE_KEYS.FASTING_TARGET_DURATION,
      calculation: STORAGE_KEYS.FASTING_CALCULATION,
    },
    initialValues: {
      lastMealTime: "12:00",
      targetDuration: 16,
      calculation: null,
    },
    loadFromBackend: async () => {
      const data = await syncService.loadFastingData();
      return data;
    },
    syncToBackend: async (data) => {
      await syncService.syncFastingData(data);
    },
  });

  const [integrationSuggestion, setIntegrationSuggestion] = useState<string | null>(null);
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false);
  const [suggestedTime, setSuggestedTime] = useState<string | null>(null);

  // Apply integrations when enabled
  useEffect(() => {
    if (settings.integrations.sleepWithFasting) {
      const selectedTime = localStorage.getItem(STORAGE_KEYS.SLEEP_SELECTED_TIME);
      const sleepMode = localStorage.getItem(STORAGE_KEYS.SLEEP_MODE) as "sleep" | "wake";
      
      if (selectedTime && sleepMode) {
        const suggested = fastingService.suggestLastMealFromSleep(selectedTime, sleepMode);
        setSuggestedTime(suggested);
        
        if (sleepMode === "sleep") {
          setIntegrationSuggestion(`😴 Detectamos seu horário de sono. Sugestão: última refeição às ${suggested}`);
        } else {
          setIntegrationSuggestion(`😴 Detectamos seu horário de acordar. Sugestão: última refeição às ${suggested}`);
        }
        setShowSuggestionPopup(true);
      }
    } else {
      setIntegrationSuggestion(null);
      setShowSuggestionPopup(false);
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
    updateField("calculation", result);
  }, [state.lastMealTime, state.targetDuration, updateField]);

  // Auto-calculate on mount if we have saved data
  useEffect(() => {
    if (state.lastMealTime && state.targetDuration && !state.calculation) {
      calculateTimeline();
    }
  }, []);

  // Real-time recalculation every minute
  useEffect(() => {
    if (!state.calculation) return;

    const interval = setInterval(() => {
      calculateTimeline();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [state.calculation, calculateTimeline]);

  const resetCalculation = useCallback(() => {
    updateField("calculation", null);
  }, [updateField]);

  const setLastMealTime = useCallback((time: string) => {
    updateField("lastMealTime", time);
  }, [updateField]);

  const setTargetDuration = useCallback((duration: number) => {
    updateField("targetDuration", duration);
  }, [updateField]);

  const acceptSuggestion = useCallback(() => {
    if (suggestedTime) {
      setLastMealTime(suggestedTime);
      setShowSuggestionPopup(false);
    }
  }, [suggestedTime, setLastMealTime]);

  const ignoreSuggestion = useCallback(() => {
    setShowSuggestionPopup(false);
  }, []);

  return {
    lastMealTime: state.lastMealTime,
    targetDuration: state.targetDuration,
    calculation: state.calculation,
    integrationSuggestion,
    showSuggestionPopup,
    setLastMealTime,
    setTargetDuration,
    calculateTimeline,
    resetCalculation,
    acceptSuggestion,
    ignoreSuggestion,
  };
};
