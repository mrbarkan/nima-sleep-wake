/**
 * Synchronization service - handles data sync between localStorage and backend
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
   * Notify all listeners of status change
   */
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.syncStatus));
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
  async syncTasks(tasks: any[], method: 'todo') {
    if (!await this.isAuthenticated()) return;

    this.updateStatus({ syncing: true, error: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Delete all existing tasks for this user
      await supabase
        .from('user_tasks')
        .delete()
        .eq('user_id', user.id);

      // Insert all tasks
      if (tasks.length > 0) {
        const tasksToInsert = tasks.map((task, index) => ({
          user_id: user.id,
          task_id: task.id,
          text: task.text,
          completed: task.completed,
          archived: task.archived || false,
          category: task.category || null,
          position: index,
        }));

        const { error } = await supabase
          .from('user_tasks')
          .insert(tasksToInsert);

        if (error) throw error;
      }

      this.updateStatus({ syncing: false, lastSync: new Date(), error: null });
    } catch (error: any) {
      console.error('Error syncing tasks:', error);
      this.updateStatus({ syncing: false, error: error.message });
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
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;

      return data?.map(task => ({
        id: task.task_id,
        text: task.text,
        completed: task.completed,
        archived: task.archived,
        category: task.category,
      })) || [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return null;
    }
  }

  /**
   * Sync sleep preferences to backend
   */
  async syncSleepPreferences(preferences: any) {
    if (!await this.isAuthenticated()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('user_sleep_preferences')
        .upsert({
          user_id: user.id,
          mode: preferences.mode,
          time: preferences.time,
          calculated_times: preferences.calculatedTimes,
          selected_time: preferences.selectedTime,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing sleep preferences:', error);
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
        .from('user_sleep_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      return {
        mode: data.mode,
        time: data.time,
        calculatedTimes: data.calculated_times,
        selectedTime: data.selected_time,
      };
    } catch (error) {
      console.error('Error loading sleep preferences:', error);
      return null;
    }
  }

  /**
   * Sync caffeine settings to backend
   */
  async syncCaffeineSettings(settings: any) {
    if (!await this.isAuthenticated()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('user_caffeine_settings')
        .upsert({
          user_id: user.id,
          wake_time: settings.wakeTime,
          schedule: settings.schedule,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing caffeine settings:', error);
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
        .from('user_caffeine_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      return {
        wakeTime: data.wake_time,
        schedule: data.schedule,
      };
    } catch (error) {
      console.error('Error loading caffeine settings:', error);
      return null;
    }
  }

  /**
   * Migrate existing localStorage data to backend (one-time operation)
   */
  async migrateLocalStorageData() {
    if (!await this.isAuthenticated()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if migration has already been done
      const migrationKey = `${STORAGE_KEYS.SYNC_MIGRATION_DONE}_${user.id}`;
      const migrationDone = storageService.getItem<boolean>(migrationKey);
      
      if (migrationDone) return;

      console.log('Starting data migration from localStorage to backend...');

      // Migrate tasks from all methods
      const methods = ['ivy-lee', '1-3-5', 'eat-frog', 'eisenhower'];
      const allTasks: any[] = [];
      
      methods.forEach((method, methodIndex) => {
        const tasks = storageService.getItem<any[]>(`${STORAGE_KEYS.TODO_DATA}_${method}`);
        if (tasks && Array.isArray(tasks)) {
          tasks.forEach((task, taskIndex) => {
            allTasks.push({
              ...task,
              position: methodIndex * 1000 + taskIndex, // Ensure unique positions
              method,
            });
          });
        }
      });

      if (allTasks.length > 0) {
        await this.syncTasks(allTasks, 'todo');
      }

      // Migrate sleep preferences
      const sleepMode = storageService.getItem<string>(STORAGE_KEYS.SLEEP_MODE);
      const sleepTime = storageService.getItem<string>(STORAGE_KEYS.SLEEP_TIME);
      const sleepCalculatedTimes = storageService.getItem<string[]>(STORAGE_KEYS.SLEEP_CALCULATED_TIMES);
      
      if (sleepMode || sleepTime) {
        await this.syncSleepPreferences({
          mode: sleepMode || 'wake',
          time: sleepTime || '07:00',
          calculatedTimes: sleepCalculatedTimes || [],
          selectedTime: null,
        });
      }

      // Migrate caffeine settings
      const caffeineWakeTime = storageService.getItem<string>(STORAGE_KEYS.CAFFEINE_WAKE_TIME);
      const caffeineSchedule = storageService.getItem<any[]>(STORAGE_KEYS.CAFFEINE_SCHEDULE);
      
      if (caffeineWakeTime) {
        await this.syncCaffeineSettings({
          wakeTime: caffeineWakeTime,
          schedule: caffeineSchedule || [],
        });
      }

      // Mark migration as complete
      storageService.setItem(migrationKey, true);
      console.log('Data migration completed successfully!');
    } catch (error) {
      console.error('Error during data migration:', error);
    }
  }
}

export const syncService = new SyncService();
