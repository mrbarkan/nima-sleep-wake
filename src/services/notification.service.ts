/**
 * Notification service - handles browser notification scheduling
 */

import { NotificationType, ScheduledNotification, NotificationConfig } from "@/types/notification.types";
import { storageService } from "./storage.service";
import { STORAGE_KEYS } from "@/config/constants";

class NotificationService {
  private scheduledNotifications: Map<string, number> = new Map();
  private recurringInterval: number | null = null;

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  /**
   * Check if notification permission is granted
   */
  isGranted(): boolean {
    return this.isSupported() && Notification.permission === "granted";
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error("Notifications are not supported in this browser");
    }

    if (Notification.permission === "granted") {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  /**
   * Schedule a notification for a specific time
   */
  scheduleNotification(config: NotificationConfig): void {
    if (!this.isGranted()) {
      throw new Error("Notification permission not granted");
    }

    const { type, time, title, body } = config;

    // Cancel existing notification of the same type
    this.cancelNotification(type);

    // Calculate delay until notification time
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    // Schedule the notification
    const timeoutId = window.setTimeout(() => {
      this.showNotification(title, body);
      this.scheduledNotifications.delete(type);
      this.saveScheduledNotifications();
    }, delay);

    // Store the scheduled notification
    this.scheduledNotifications.set(type, timeoutId);
    this.saveScheduledNotifications();
  }

  /**
   * Cancel a scheduled notification
   */
  cancelNotification(type: NotificationType): void {
    const timeoutId = this.scheduledNotifications.get(type);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      this.scheduledNotifications.delete(type);
      this.saveScheduledNotifications();
    }
  }

  /**
   * Get all scheduled notifications
   */
  getScheduledNotifications(type?: NotificationType): ScheduledNotification[] {
    const stored = storageService.getItem<ScheduledNotification[]>(
      STORAGE_KEYS.SCHEDULED_NOTIFICATIONS
    ) || [];

    if (type) {
      return stored.filter((n) => n.type === type);
    }

    return stored;
  }

  /**
   * Show a notification immediately
   */
  showNotification(title: string, body: string, icon?: string): void {
    if (!this.isGranted()) {
      throw new Error("Notification permission not granted");
    }

    new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
    });
  }

  /**
   * Schedule recurring reminder
   */
  scheduleRecurringReminder(intervalMinutes: number, title: string, body: string): void {
    if (!this.isGranted()) {
      throw new Error("Notification permission not granted");
    }

    // Cancel existing recurring reminder
    this.cancelRecurringReminder();

    // Set up new recurring reminder
    this.recurringInterval = window.setInterval(() => {
      this.showNotification(title, body);
    }, intervalMinutes * 60 * 1000);

    // Store interval setting
    storageService.setItem(STORAGE_KEYS.RECURRING_REMINDER_INTERVAL, intervalMinutes);
  }

  /**
   * Cancel recurring reminder
   */
  cancelRecurringReminder(): void {
    if (this.recurringInterval) {
      window.clearInterval(this.recurringInterval);
      this.recurringInterval = null;
    }
    storageService.removeItem(STORAGE_KEYS.RECURRING_REMINDER_INTERVAL);
  }

  /**
   * Get recurring reminder interval
   */
  getRecurringReminderInterval(): number | null {
    return storageService.getItem<number>(STORAGE_KEYS.RECURRING_REMINDER_INTERVAL);
  }

  /**
   * Save scheduled notifications to localStorage
   */
  private saveScheduledNotifications(): void {
    const notifications: ScheduledNotification[] = [];
    
    this.scheduledNotifications.forEach((_, type) => {
      // We can't store the actual timeout ID, so we just store metadata
      notifications.push({
        id: type as string,
        type: type as NotificationType,
        time: "", // Time would need to be passed from the config
        title: "",
        body: "",
      });
    });

    storageService.setItem(STORAGE_KEYS.SCHEDULED_NOTIFICATIONS, notifications);
  }

  /**
   * Clear all notifications and scheduled timers
   */
  clearAll(): void {
    // Cancel all scheduled notifications
    this.scheduledNotifications.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();

    // Cancel recurring reminder
    this.cancelRecurringReminder();

    // Clear storage
    storageService.removeItem(STORAGE_KEYS.SCHEDULED_NOTIFICATIONS);
  }
}

export const notificationService = new NotificationService();
