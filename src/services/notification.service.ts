/**
 * Notification service - handles both native (Capacitor) and web notifications
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationType, ScheduledNotification, NotificationConfig } from "@/types/notification.types";
import { storageService } from "./storage.service";
import { STORAGE_KEYS } from "@/config/constants";

class NotificationService {
  private scheduledNotifications: Map<string, { timeoutId: number; config: NotificationConfig }> = new Map();
  private recurringInterval: number | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private isReady: boolean = false;
  private readyPromise: Promise<void>;

  constructor() {
    // Initialize asynchronously
    this.readyPromise = this.initialize();
  }

  /**
   * Initialize the service - must be called and awaited before using
   */
  private async initialize(): Promise<void> {
    console.log("🚀 Iniciando NotificationService...");
    
    try {
      // First, initialize Service Worker and wait for it
      await this.initServiceWorker();
      console.log("✅ Service Worker inicializado");
      
      // Only restore after SW is ready
      await this.restoreScheduledNotifications();
      console.log("✅ Notificações agendadas restauradas");
      
      await this.restoreRecurringReminder();
      console.log("✅ Lembretes recorrentes restaurados");
      
      this.isReady = true;
      console.log("✅ NotificationService pronto");
    } catch (error) {
      console.error("❌ Erro ao inicializar NotificationService:", error);
      this.isReady = true; // Mark as ready even on error to prevent blocking
    }
  }

  /**
   * Ensure service is ready before operations
   */
  private async ensureReady(): Promise<void> {
    if (!this.isReady) {
      console.log("⏳ Aguardando inicialização do NotificationService...");
      await this.readyPromise;
    }
  }

  /**
   * Initialize Service Worker
   */
  private async initServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register("/sw.js");
        console.log("✅ Service Worker registrado com sucesso");
      } catch (error) {
        console.error("❌ Falha ao registrar Service Worker:", error);
      }
    } else {
      console.warn("⚠️ Service Worker não disponível neste navegador");
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
    // Native Capacitor always supports notifications
    if (Capacitor.isNativePlatform()) {
      return true;
    }
    // Web fallback
    return "Notification" in window && "serviceWorker" in navigator;
  }

  /**
   * Check if notification permission is granted
   */
  async isGranted(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const permission = await LocalNotifications.checkPermissions();
      return permission.display === 'granted';
    }
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

    // Native Capacitor
    if (Capacitor.isNativePlatform()) {
      const permission = await LocalNotifications.requestPermissions();
      const granted = permission.display === 'granted';
      console.log(`📋 Resultado da permissão (Capacitor): ${granted}`);
      return granted;
    }

    // Web fallback
    if (Notification.permission === "granted") {
      console.log("✅ Permissão já concedida");
      return true;
    }

    const permission = await Notification.requestPermission();
    console.log(`📋 Resultado da permissão (Web): ${permission}`);
    return permission === "granted";
  }

  /**
   * Schedule a notification for a specific time
   */
  async scheduleNotification(config: NotificationConfig): Promise<void> {
    await this.ensureReady();
    console.log("📅 Agendando notificação:", config);
    
    const granted = await this.isGranted();
    if (!granted) {
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

    // Native Capacitor scheduling
    if (Capacitor.isNativePlatform()) {
      const notificationId = this.getNotificationId(type);
      
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title,
            body,
            schedule: { at: scheduledTime },
            sound: 'beep.wav',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF',
          }
        ]
      });

      console.log(`✅ Notificação nativa agendada com ID ${notificationId}`);
      
      // Store metadata for tracking
      this.scheduledNotifications.set(type, { 
        timeoutId: notificationId, 
        config 
      });
      this.saveScheduledNotifications();
      return;
    }

    // Web fallback - use setTimeout
    const timeoutId = window.setTimeout(async () => {
      console.log("🔔 Disparando notificação:", title);
      await this.showNotification(title, body);
      this.scheduledNotifications.delete(type);
      this.saveScheduledNotifications();
    }, delay);

    // Store the scheduled notification with full config
    this.scheduledNotifications.set(type, { timeoutId, config });
    this.saveScheduledNotifications();
  }

  /**
   * Generate consistent notification ID from type
   */
  private getNotificationId(type: NotificationType): number {
    // Convert type string to consistent numeric ID
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      const char = type.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(type: NotificationType): Promise<void> {
    const scheduled = this.scheduledNotifications.get(type);
    if (!scheduled) return;

    // Native Capacitor
    if (Capacitor.isNativePlatform()) {
      const notificationId = this.getNotificationId(type);
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
      console.log(`🗑️ Notificação nativa cancelada (ID ${notificationId})`);
    } else {
      // Web fallback
      window.clearTimeout(scheduled.timeoutId);
    }

    this.scheduledNotifications.delete(type);
    this.saveScheduledNotifications();
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
    await this.ensureReady();
    console.log("🔔 Mostrando notificação:", { title, body });
    
    const granted = await this.isGranted();
    if (!granted) {
      console.error("❌ Permissão não concedida");
      throw new Error("Notification permission not granted");
    }

    // Native Capacitor
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title,
            body,
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
            sound: 'beep.wav',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF',
          }
        ]
      });
      console.log("✅ Notificação nativa disparada");
      return;
    }

    // Web fallback
    const registration = await this.getRegistration();
    
    if (!registration) {
      console.warn("⚠️ Service Worker não disponível, usando notificação básica");
      new Notification(title, {
        body,
        icon: icon || "/favicon.ico",
        badge: "/favicon.ico",
      });
      return;
    }

    console.log("✅ Usando Service Worker para notificação");
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
  async scheduleRecurringReminder(intervalMinutes: number, title: string, body: string): Promise<void> {
    await this.ensureReady();
    console.log("🔄 Agendando lembrete recorrente:", intervalMinutes, "minutos");
    
    const granted = await this.isGranted();
    if (!granted) {
      console.error("❌ Permissão não concedida para lembretes recorrentes");
      throw new Error("Notification permission not granted");
    }

    // Cancel existing recurring reminder
    await this.cancelRecurringReminder();

    // Note: Capacitor LocalNotifications doesn't support true recurring notifications
    // So we use setInterval for both native and web
    this.recurringInterval = window.setInterval(async () => {
      console.log("⏰ Disparando lembrete recorrente");
      await this.showNotification(title, body);
    }, intervalMinutes * 60 * 1000);

    // Store interval setting
    storageService.setItem(STORAGE_KEYS.RECURRING_REMINDER_INTERVAL, intervalMinutes);
    console.log("✅ Lembrete recorrente agendado com sucesso");
  }

  /**
   * Cancel recurring reminder
   */
  async cancelRecurringReminder(): Promise<void> {
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
    
    this.scheduledNotifications.forEach(({ config }, type) => {
      notifications.push({
        id: type as string,
        type: config.type,
        time: config.time,
        title: config.title,
        body: config.body,
      });
    });

    storageService.setItem(STORAGE_KEYS.SCHEDULED_NOTIFICATIONS, notifications);
  }

  /**
   * Restore scheduled notifications from localStorage
   */
  private async restoreScheduledNotifications(): Promise<void> {
    try {
      const stored = storageService.getItem<ScheduledNotification[]>(
        STORAGE_KEYS.SCHEDULED_NOTIFICATIONS
      );

      if (!stored || stored.length === 0) {
        console.log("ℹ️ Nenhuma notificação agendada para restaurar");
        return;
      }

      console.log("🔄 Restaurando notificações agendadas:", stored);

      // Check permission before restoring
      if (!this.isGranted()) {
        console.warn("⚠️ Permissão não concedida, ignorando restauração de notificações");
        return;
      }

      for (const notification of stored) {
        try {
          // Re-schedule each notification (without awaiting ensureReady since we're already in init)
          await this.scheduleNotification({
            type: notification.type,
            time: notification.time,
            title: notification.title,
            body: notification.body,
          });
        } catch (error) {
          console.error("❌ Erro ao restaurar notificação:", notification, error);
        }
      }
    } catch (error) {
      console.error("❌ Erro ao restaurar notificações agendadas:", error);
    }
  }

  /**
   * Restore recurring reminder from localStorage
   */
  private async restoreRecurringReminder(): Promise<void> {
    try {
      const interval = this.getRecurringReminderInterval();
      
      if (!interval) {
        console.log("ℹ️ Nenhum lembrete recorrente para restaurar");
        return;
      }

      console.log("🔄 Tentando restaurar lembrete recorrente:", interval, "minutos");
      
      // Check permission AFTER service worker is ready
      if (!this.isGranted()) {
        console.warn("⚠️ Permissão não concedida, ignorando restauração de lembrete recorrente");
        return;
      }

      await this.scheduleRecurringReminder(
        interval,
        "Lembrete de Tarefas",
        "Hora de checar sua lista de tarefas! 📝"
      );
      console.log("✅ Lembrete recorrente restaurado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao restaurar lembrete recorrente:", error);
    }
  }

  /**
   * Clear all notifications and scheduled timers
   */
  clearAll(): void {
    // Cancel all scheduled notifications
    this.scheduledNotifications.forEach(({ timeoutId }) => {
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
