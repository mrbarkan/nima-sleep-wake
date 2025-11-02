/**
 * Generic hook for handling localStorage persistence and backend sync
 * Eliminates code duplication across feature hooks
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { storageService } from "@/services/storage.service";

interface UsePersistenceOptions<T> {
  storageKey: string;
  initialValue: T;
  loadFromBackend?: () => Promise<T | null>;
  syncToBackend?: (data: T) => Promise<void>;
}

/**
 * Generic persistence hook that handles:
 * - Initial load from localStorage
 * - Load from backend when user logs in
 * - Persist to localStorage on changes
 * - Sync to backend when authenticated
 */
export function usePersistence<T>({
  storageKey,
  initialValue,
  loadFromBackend,
  syncToBackend,
}: UsePersistenceOptions<T>) {
  const { user } = useAuth();
  
  // Initialize from localStorage
  const [data, setData] = useState<T>(() => {
    return storageService.getItem<T>(storageKey) ?? initialValue;
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from backend when user logs in (only once)
  useEffect(() => {
    if (isLoaded) return; // Evita recarregamentos múltiplos

    const loadData = async () => {
      if (!user || !loadFromBackend) {
        setIsLoaded(true);
        return;
      }

      try {
        const backendData = await loadFromBackend();
        if (backendData !== null) {
          setData(backendData);
        }
      } catch (error) {
        console.error(`Error loading data from backend (${storageKey}):`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user, storageKey, loadFromBackend, isLoaded]);

  // Persist to localStorage and sync to backend
  useEffect(() => {
    storageService.setItem(storageKey, data);
    
    if (isLoaded && user && syncToBackend) {
      syncToBackend(data).catch((error) => {
        console.error(`Error syncing data to backend (${storageKey}):`, error);
      });
    }
  }, [data, storageKey, isLoaded, user, syncToBackend]);

  return {
    data,
    setData,
    isLoaded,
  };
}

/**
 * Variant for managing multiple related pieces of state
 * Useful when you need to sync multiple values together
 */
export function useMultiPersistence<T extends Record<string, any>>({
  storageKeys,
  initialValues,
  loadFromBackend,
  syncToBackend,
}: {
  storageKeys: Record<keyof T, string>;
  initialValues: T;
  loadFromBackend?: () => Promise<Partial<T> | null>;
  syncToBackend?: (data: T) => Promise<void>;
}) {
  const { user } = useAuth();
  
  // Initialize each value from localStorage
  const [state, setState] = useState<T>(() => {
    const initial = { ...initialValues };
    for (const key in storageKeys) {
      const stored = storageService.getItem(storageKeys[key]);
      if (stored !== null) {
        initial[key] = stored as T[Extract<keyof T, string>];
      }
    }
    return initial;
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from backend when user logs in (only once)
  useEffect(() => {
    if (isLoaded) return; // Evita recarregamentos múltiplos

    const loadData = async () => {
      if (!user || !loadFromBackend) {
        setIsLoaded(true);
        return;
      }

      try {
        const backendData = await loadFromBackend();
        if (backendData) {
          setState(prev => ({ ...prev, ...backendData }));
        }
      } catch (error) {
        console.error('Error loading data from backend:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user, loadFromBackend, isLoaded]);

  // Persist to localStorage and sync to backend
  useEffect(() => {
    // Persist each value to its storage key
    for (const key in storageKeys) {
      storageService.setItem(storageKeys[key], state[key]);
    }
    
    if (isLoaded && user && syncToBackend) {
      syncToBackend(state).catch((error) => {
        console.error('Error syncing data to backend:', error);
      });
    }
  }, [state, storageKeys, isLoaded, user, syncToBackend]);

  // Helper to update a single field
  const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    state,
    setState,
    updateField,
    isLoaded,
  };
}
