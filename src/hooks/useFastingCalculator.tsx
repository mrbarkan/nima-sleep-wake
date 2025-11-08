/**
 * Hook for managing fasting calculations and state
 */

import { useState, useCallback } from "react";
import { usePersistence } from "./usePersistence";
import { fastingService } from "@/services/fasting.service";
import { FastingState, FastingCalculation } from "@/types/fasting.types";
import { STORAGE_KEYS } from "@/config/constants";

export const useFastingCalculator = () => {
  const lastMealTimePersistence = usePersistence<string>({
    storageKey: STORAGE_KEYS.FASTING_LAST_MEAL,
    initialValue: "12:00",
  });
  const targetDurationPersistence = usePersistence<number>({
    storageKey: STORAGE_KEYS.FASTING_TARGET_DURATION,
    initialValue: 16,
  });

  const lastMealTime = lastMealTimePersistence.data;
  const setLastMealTime = lastMealTimePersistence.setData;
  const targetDuration = targetDurationPersistence.data;
  const setTargetDuration = targetDurationPersistence.setData;
  const [calculation, setCalculation] = useState<FastingCalculation | null>(
    null
  );

  const calculateTimeline = useCallback(() => {
    if (!fastingService.isValidTimeFormat(lastMealTime)) {
      return;
    }

    const result = fastingService.calculateFastingTimeline(
      lastMealTime,
      targetDuration
    );
    setCalculation(result);
  }, [lastMealTime, targetDuration]);

  const resetCalculation = useCallback(() => {
    setCalculation(null);
  }, []);

  return {
    lastMealTime,
    targetDuration,
    calculation,
    setLastMealTime,
    setTargetDuration,
    calculateTimeline,
    resetCalculation,
  };
};
