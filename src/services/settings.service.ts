import { AppSettings, DEFAULT_APP_SETTINGS } from "@/types/settings.types";
import { STORAGE_KEYS } from "@/config/constants";

/**
 * Service para gerenciar configurações da aplicação
 */
class SettingsService {
  private readonly SETTINGS_KEY = STORAGE_KEYS.APP_SETTINGS;

  /**
   * Carrega as configurações do localStorage
   */
  loadSettings(): AppSettings {
    try {
      const saved = localStorage.getItem(this.SETTINGS_KEY);
      if (!saved) return DEFAULT_APP_SETTINGS;

      const parsed = JSON.parse(saved) as AppSettings;
      
      // Merge com defaults para garantir que novos campos existam
      return {
        integrations: { ...DEFAULT_APP_SETTINGS.integrations, ...parsed.integrations },
        todo: { ...DEFAULT_APP_SETTINGS.todo, ...parsed.todo },
        notifications: { ...DEFAULT_APP_SETTINGS.notifications, ...parsed.notifications },
      };
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      return DEFAULT_APP_SETTINGS;
    }
  }

  /**
   * Salva as configurações no localStorage
   */
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      throw error;
    }
  }

  /**
   * Reseta as configurações para os valores padrão
   */
  resetSettings(): AppSettings {
    this.saveSettings(DEFAULT_APP_SETTINGS);
    return DEFAULT_APP_SETTINGS;
  }

  /**
   * Valida se pelo menos um método de TODO está visível
   */
  validateTodoMethods(visibleMethods: Record<string, boolean>): boolean {
    return Object.values(visibleMethods).some((visible) => visible);
  }
}

export const settingsService = new SettingsService();
