/**
 * Notification service - handles browser notification scheduling
 */

import { NotificationType, ScheduledNotification, NotificationConfig } from "@/types/notification.types";
import { storageService } from "./storage.service";
import { STORAGE_KEYS } from "@/config/constants";

class NotificationService {
  private scheduledNotifications: Map<string, number> = new Map();
  private recurringInterval: number | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initServiceWorker();
  }

  /**
   * Initialize Service Worker
   */
  private async initServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered successfully");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  /**
   * Get Service Worker registration
   */
  private async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (this.registration) {
      return this.registration;
    }

    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        return this.registration;
      } catch (error) {
        console.error("Failed to get Service Worker registration:", error);
        return null;
      }
    }

    return null;
  }

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
    console.log("🔐 Solicitando permissão para notificações");
    
    if (!this.isSupported()) {
      console.error("❌ Notificações não suportadas");
      throw new Error("Notifications are not supported in this browser");
    }

    if (Notification.permission === "granted") {
      console.log("✅ Permissão já concedida");
      return true;
    }

    const permission = await Notification.requestPermission();
    console.log(`📋 Resultado da permissão: ${permission}`);
    return permission === "granted";
  }

  /**
   * Schedule a notification for a specific time
   */
  async scheduleNotification(config: NotificationConfig): Promise<void> {
    console.log("📅 Agendando notificação:", config);
    
    if (!this.isGranted()) {
      console.error("❌ Permissão não concedida");
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
    console.log(`⏰ Notificação agendada para ${scheduledTime.toLocaleString()} (delay: ${Math.round(delay/1000)}s)`);

    // Schedule the notification
    const timeoutId = window.setTimeout(async () => {
      console.log("🔔 Disparando notificação:", title);
      await this.showNotification(title, body);
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
  async showNotification(title: string, body: string, icon?: string): Promise<void> {
    console.log("🔔 Mostrando notificação:", { title, body });
    
    if (!this.isGranted()) {
      console.error("❌ Permissão não concedida");
      throw new Error("Notification permission not granted");
    }

    const registration = await this.getRegistration();
    
    if (!registration) {
      console.warn("⚠️ Service Worker não disponível, usando notificação básica");
      // Fallback for environments where SW is not available
      new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
      });
      return;
    }

    console.log("✅ Usando Service Worker para notificação");
    // Use Service Worker notification for better mobile support
    await registration.showNotification(title, {
      body,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
      tag: `notification-${Date.now()}`,
      requireInteraction: false,
      vibrate: [200, 100, 200],
    } as NotificationOptions);
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
    this.recurringInterval = window.setInterval(async () => {
      await this.showNotification(title, body);
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
