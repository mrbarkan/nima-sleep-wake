/**
 * Application-wide constants and configuration
 */

export const APP_VERSION = "0.14.3";
export const APP_NAME = "Nima";
export const APP_BETA = true;

// Storage keys
export const STORAGE_KEYS = {
  SLEEP_MODE: "sleep-mode",
  SLEEP_TIME: "sleep-time",
  SLEEP_CALCULATED_TIMES: "sleep-calculatedTimes",
  SLEEP_SELECTED_TIME: "sleep-selected-time",
  CAFFEINE_WAKE_TIME: "caffeine-wakeTime",
  CAFFEINE_SCHEDULE: "caffeine-schedule",
  TODO_DATA: "sleepflow-todo-data",
  USER_IDENTIFIER: "user_identifier",
  WELCOME_MODAL_SHOWN: "welcome-modal-shown",
  SCHEDULED_NOTIFICATIONS: "scheduled-notifications",
  RECURRING_REMINDER_INTERVAL: "recurring-reminder-interval",
  SYNC_MIGRATION_DONE: "sync-migration-done",
} as const;

// Sleep calculation constants
export const SLEEP_CONSTANTS = {
  CYCLE_MINUTES: 90,
  FALL_ASLEEP_TIME: 15,
  MIN_CYCLES: 1,
  MAX_CYCLES: 6,
  RECOMMENDED_MIN_HOURS: 7,
  RECOMMENDED_MAX_HOURS: 9,
} as const;

// Caffeine configuration
export const CAFFEINE_CONFIG = {
  MAX_HOUR: 15, // No caffeine after 3 PM
  FIRST_DOSE_DELAY: 45, // Minutes after waking
  INTERVALS: [0, 180, 240, 300], // Minutes between doses
} as const;

// Todo limits
export const TODO_LIMITS = {
  "ivy-lee": 6,
  "1-3-5": 9,
  "eat-frog": 6,
  "eisenhower": 12,
} as const;

export const MAX_TASK_LENGTH = 500;
export const MAX_TASKS_PER_METHOD = 20;
