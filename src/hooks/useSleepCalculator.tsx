/**
 * Custom hook for sleep cycle calculations
 * Extracts business logic from Sleep component
 */

import { useState, useEffect, useCallback } from "react";
import { SleepMode } from "@/types/sleep.types";
import { storageService } from "@/services/storage.service";
import { syncService } from "@/services/sync.service";
import { STORAGE_KEYS, SLEEP_CONSTANTS } from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";

export function useSleepCalculator() {
  const { user } = useAuth();
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from backend when user logs in
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const preferences = await syncService.loadSleepPreferences();
        if (preferences) {
          setMode(preferences.mode);
          setTime(preferences.time);
          setCalculatedTimes(preferences.calculatedTimes || []);
          setSelectedTime(preferences.selectedTime || "");
        }
      } catch (error) {
        console.error('Error loading sleep preferences:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user]);

  // Sync to backend
  const syncToBackend = useCallback(async () => {
    if (!user || !isLoaded) return;
    
    await syncService.syncSleepPreferences({
      mode,
      time,
      calculatedTimes,
      selectedTime,
    });
  }, [user, mode, time, calculatedTimes, selectedTime, isLoaded]);

  // Persist mode
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.SLEEP_MODE, mode);
    if (isLoaded) syncToBackend();
  }, [mode, isLoaded, syncToBackend]);

  // Persist time
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.SLEEP_TIME, time);
    if (isLoaded) syncToBackend();
  }, [time, isLoaded, syncToBackend]);

  // Persist calculated times
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.SLEEP_CALCULATED_TIMES, calculatedTimes);
    if (isLoaded) syncToBackend();
  }, [calculatedTimes, isLoaded, syncToBackend]);

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
