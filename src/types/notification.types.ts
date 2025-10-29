/**
 * Notification-related type definitions
 */

export type NotificationType = 
  | "sleep" 
  | "wake" 
  | "test" 
  | `caffeine-${string}`;

export interface NotificationPermission {
  supported: boolean;
  granted: boolean;
}

export interface ScheduledNotification {
  id: string;
  type: NotificationType;
  time: string;
  title: string;
  body: string;
}

export interface NotificationConfig {
  type: NotificationType;
  time: string;
  title: string;
  body: string;
}
