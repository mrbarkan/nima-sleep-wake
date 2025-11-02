/**
 * Synchronization service
 * Handles all sync operations between localStorage and backend (Lovable Cloud)
 */

import { supabase } from "@/integrations/supabase/client";
import { storageService } from "./storage.service";
import { STORAGE_KEYS } from "@/config/constants";

interface SyncStatus {
  syncing: boolean;
  lastSync: Date | null;
  error: string | null;
}

class SyncService {
  private syncStatus: SyncStatus = {
    syncing: false,
    lastSync: null,
    error: null,
  };

  private listeners: Set<(status: SyncStatus) => void> = new Set();

  /**
   * Subscribe to sync status changes
   */
  subscribe(callback: (status: SyncStatus) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of status changes
   */
  private notifyListeners() {
    this.listeners.forEach(callback => callback({ ...this.syncStatus }));
  }

  /**
   * Update sync status
   */
  private updateStatus(updates: Partial<SyncStatus>) {
    this.syncStatus = { ...this.syncStatus, ...updates };
    this.notifyListeners();
  }

  /**
   * Get current sync status
   */
  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Check if user is authenticated
   */
  private async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  /**
   * Sync tasks to backend
   */
  async syncTasks(tasks: any[], method: 'todo'): Promise<void> {
    if (!await this.isAuthenticated()) return;

    this.updateStatus({ syncing: true, error: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Delete existing tasks for this user
      await supabase
        .from("user_tasks")
        .delete()
        .eq("user_id", user.id);

      // Insert new tasks
      if (tasks.length > 0) {
        const tasksToInsert = tasks.map((task: any, index: number) => ({
          user_id: user.id,
          task_id: task.id,
          text: task.title,
          completed: task.completed || false,
          archived: task.archived || false,
          category: task.category || null,
          position: task.priority || index,
        }));

        const { error } = await supabase
          .from("user_tasks")
          .insert(tasksToInsert);

        if (error) throw error;
      }

      this.updateStatus({ 
        syncing: false, 
        lastSync: new Date(),
        error: null 
      });
    } catch (error) {
      console.error("Erro ao sincronizar tarefas:", error);
      this.updateStatus({ 
        syncing: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
      throw error;
    }
  }

  /**
   * Load tasks from backend
   */
  async loadTasks(): Promise<any[] | null> {
    if (!await this.isAuthenticated()) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true });

      if (error) throw error;

      if (!data) return null;

      // Transform backend data to app format
      return data.map((task: any) => ({
        id: task.task_id,
        title: task.text,
        completed: task.completed,
        archived: task.archived,
        category: task.category,
        priority: task.position,
      }));
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      return null;
    }
  }

  /**
   * Sync sleep preferences to backend
   */
  async syncSleepPreferences(preferences: any): Promise<void> {
    if (!await this.isAuthenticated()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("user_sleep_preferences")
        .upsert({
          user_id: user.id,
          mode: preferences.mode,
          time: preferences.time,
          calculated_times: preferences.calculatedTimes || [],
          selected_time: preferences.selectedTime || "",
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id"
        });

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao sincronizar preferências de sono:", error);
      throw error;
    }
  }

  /**
   * Load sleep preferences from backend
   */
  async loadSleepPreferences(): Promise<any | null> {
    if (!await this.isAuthenticated()) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_sleep_preferences")
        .select("mode, time, calculated_times, selected_time")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // No data found
        throw error;
      }

      if (!data) return null;

      return {
        mode: data.mode || "wake",
        time: data.time || "",
        calculatedTimes: data.calculated_times || [],
        selectedTime: data.selected_time || "",
      };
    } catch (error) {
      console.error("Erro ao carregar preferências de sono:", error);
      return null;
    }
  }

  /**
   * Sync caffeine settings to backend
   */
  async syncCaffeineSettings(settings: any): Promise<void> {
    if (!await this.isAuthenticated()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("user_caffeine_settings")
        .upsert({
          user_id: user.id,
          wake_time: settings.wakeTime,
          schedule: settings.schedule || [],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id"
        });

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao sincronizar configurações de cafeína:", error);
      throw error;
    }
  }

  /**
   * Load caffeine settings from backend
   */
  async loadCaffeineSettings(): Promise<any | null> {
    if (!await this.isAuthenticated()) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_caffeine_settings")
        .select("wake_time, schedule")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // No data found
        throw error;
      }

      if (!data) return null;

      return {
        wakeTime: data.wake_time || "",
        schedule: data.schedule || [],
      };
    } catch (error) {
      console.error("Erro ao carregar configurações de cafeína:", error);
      return null;
    }
  }

  /**
   * Migrate localStorage data to backend (one-time operation)
   */
  async migrateLocalStorageData(): Promise<void> {
    if (!await this.isAuthenticated()) return;

    // Check if migration was already done
    const migrationDone = storageService.getItem<boolean>(STORAGE_KEYS.SYNC_MIGRATION_DONE);
    if (migrationDone) return;

    try {
      console.log("Iniciando migração de dados do localStorage...");

      // Migrate tasks
      const todoDataStr = storageService.getItem(STORAGE_KEYS.TODO_DATA);
      if (todoDataStr) {
        const todoData = typeof todoDataStr === 'string' ? JSON.parse(todoDataStr) : todoDataStr;
        const tasks = todoData.tasks || [];
        const archivedTasks = todoData.archivedTasks || [];
        const allTasks = [...tasks, ...archivedTasks.map((t: any) => ({ ...t, archived: true }))];
        
        if (allTasks.length > 0) {
          await this.syncTasks(allTasks, 'todo');
          console.log("Tarefas migradas com sucesso");
        }
      }

      // Migrate sleep preferences
      const sleepMode = storageService.getItem(STORAGE_KEYS.SLEEP_MODE);
      const sleepTime = storageService.getItem(STORAGE_KEYS.SLEEP_TIME);
      const sleepCalculatedTimes = storageService.getItem(STORAGE_KEYS.SLEEP_CALCULATED_TIMES);
      const sleepSelectedTime = storageService.getItem(STORAGE_KEYS.SLEEP_SELECTED_TIME);

      if (sleepMode || sleepTime) {
        await this.syncSleepPreferences({
          mode: sleepMode || "wake",
          time: sleepTime || "",
          calculatedTimes: sleepCalculatedTimes || [],
          selectedTime: sleepSelectedTime || "",
        });
        console.log("Preferências de sono migradas com sucesso");
      }

      // Migrate caffeine settings
      const caffeineWakeTime = storageService.getItem(STORAGE_KEYS.CAFFEINE_WAKE_TIME);
      const caffeineSchedule = storageService.getItem(STORAGE_KEYS.CAFFEINE_SCHEDULE);

      if (caffeineWakeTime) {
        await this.syncCaffeineSettings({
          wakeTime: caffeineWakeTime,
          schedule: caffeineSchedule || [],
        });
        console.log("Configurações de cafeína migradas com sucesso");
      }

      // Mark migration as done
      storageService.setItem(STORAGE_KEYS.SYNC_MIGRATION_DONE, true);
      console.log("Migração concluída com sucesso");
    } catch (error) {
      console.error("Erro durante migração:", error);
      // Don't throw - allow app to continue even if migration fails
    }
  }
}

export const syncService = new SyncService();
