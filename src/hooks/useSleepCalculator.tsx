/**
 * Custom hook for sleep cycle calculations
 * Extracts business logic from Sleep component
 */

import { useState, useEffect } from "react";
import { SleepMode } from "@/types/sleep.types";
import { storageService } from "@/services/storage.service";
import { STORAGE_KEYS, SLEEP_CONSTANTS } from "@/config/constants";

export function useSleepCalculator() {
  const [mode, setMode] = useState<SleepMode>(() => {
    return storageService.getItem<SleepMode>(STORAGE_KEYS.SLEEP_MODE) || "wake";
  });
  
  const [time, setTime] = useState(() => {
    return storageService.getItem<string>(STORAGE_KEYS.SLEEP_TIME) || "";
  });
  
  const [calculatedTimes, setCalculatedTimes] = useState<string[]>(() => {
    return storageService.getItem<string[]>(STORAGE_KEYS.SLEEP_CALCULATED_TIMES) || [];
  });
  
  const [selectedTime, setSelectedTime] = useState("");

  // Persist mode
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.SLEEP_MODE, mode);
  }, [mode]);

  // Persist time
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.SLEEP_TIME, time);
  }, [time]);

  // Persist calculated times
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.SLEEP_CALCULATED_TIMES, calculatedTimes);
  }, [calculatedTimes]);

  const calculateTimes = () => {
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const referenceDate = new Date();
    referenceDate.setHours(hours, minutes, 0);

    const times: string[] = [];
    const { CYCLE_MINUTES, FALL_ASLEEP_TIME, MAX_CYCLES } = SLEEP_CONSTANTS;

    if (mode === "wake") {
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

    setCalculatedTimes(times);
  };

  const getCycleLabel = (index: number) => {
    const cycles = SLEEP_CONSTANTS.MAX_CYCLES - index;
    const hours = (cycles * 1.5).toFixed(1);
    return `${cycles} ciclos (${hours}h)`;
  };

  const changeMode = (newMode: SleepMode) => {
    setMode(newMode);
    setCalculatedTimes([]);
  };

  return {
    mode,
    time,
    calculatedTimes,
    selectedTime,
    setTime,
    setSelectedTime,
    calculateTimes,
    getCycleLabel,
    changeMode,
  };
}
