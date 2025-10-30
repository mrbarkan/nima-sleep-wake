/**
 * Custom hook for caffeine scheduling
 * Extracts business logic from Caffeine component
 */

import { useState, useEffect, useCallback } from "react";
import { CaffeineSchedule, CaffeineRotation } from "@/types/caffeine.types";
import { storageService } from "@/services/storage.service";
import { syncService } from "@/services/sync.service";
import { STORAGE_KEYS, CAFFEINE_CONFIG } from "@/config/constants";
import { useAuth } from "@/contexts/AuthContext";

const caffeineRotation: CaffeineRotation[] = [
  { source: "Café", description: "Efeito rápido (30-45 min)", duration: 5 },
  { source: "Chá verde", description: "Efeito moderado e prolongado", duration: 3 },
  { source: "Chá preto", description: "Alternativa ao café", duration: 3 },
  { source: "Café", description: "Reforço vespertino", duration: 5 },
];

export function useCaffeineScheduler() {
  const { user } = useAuth();
  const [wakeTime, setWakeTime] = useState(() => {
    return storageService.getItem<string>(STORAGE_KEYS.CAFFEINE_WAKE_TIME) || "";
  });
  
  const [schedule, setSchedule] = useState<CaffeineSchedule[]>(() => {
    return storageService.getItem<CaffeineSchedule[]>(STORAGE_KEYS.CAFFEINE_SCHEDULE) || [];
  });
  
  const [openNotifications, setOpenNotifications] = useState<{ [key: number]: boolean }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from backend when user logs in
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const settings = await syncService.loadCaffeineSettings();
        if (settings) {
          setWakeTime(settings.wakeTime);
          setSchedule(settings.schedule || []);
        }
      } catch (error) {
        console.error('Error loading caffeine settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user]);

  // Sync to backend
  const syncToBackend = useCallback(async () => {
    if (!user || !isLoaded) return;
    
    await syncService.syncCaffeineSettings({
      wakeTime,
      schedule,
    });
  }, [user, wakeTime, schedule, isLoaded]);

  // Persist wake time
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.CAFFEINE_WAKE_TIME, wakeTime);
    if (isLoaded) syncToBackend();
  }, [wakeTime, isLoaded, syncToBackend]);

  // Persist schedule
  useEffect(() => {
    storageService.setItem(STORAGE_KEYS.CAFFEINE_SCHEDULE, schedule);
    if (isLoaded) syncToBackend();
  }, [schedule, isLoaded, syncToBackend]);

  const calculateSchedule = () => {
    if (!wakeTime) return;

    const [hours, minutes] = wakeTime.split(":").map(Number);
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

    setSchedule(scheduleItems);
  };

  return {
    wakeTime,
    schedule,
    openNotifications,
    setWakeTime,
    setOpenNotifications,
    calculateSchedule,
  };
}
