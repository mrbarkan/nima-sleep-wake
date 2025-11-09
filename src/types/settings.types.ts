import { TodoMethod } from "@/schemas/todo.schemas";

/**
 * Configurações de integrações entre funcionalidades
 */
export interface IntegrationSettings {
  sleepWithFasting: boolean;
  sleepWithCaffeine: boolean;
  fastingWithCaffeine: boolean;
}

/**
 * Configurações de métodos de tarefas visíveis
 */
export interface TodoMethodSettings {
  visibleMethods: Record<TodoMethod, boolean>;
}

/**
 * Configurações de notificações
 */
export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

/**
 * Configurações gerais da aplicação
 */
export interface AppSettings {
  integrations: IntegrationSettings;
  todo: TodoMethodSettings;
  notifications: NotificationSettings;
}

/**
 * Valores padrão para as configurações
 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  integrations: {
    sleepWithFasting: false,
    sleepWithCaffeine: false,
    fastingWithCaffeine: false,
  },
  todo: {
    visibleMethods: {
      "ivy-lee": true,
      "1-3-5": true,
      "eat-frog": true,
      "eisenhower": true,
    },
  },
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
};
