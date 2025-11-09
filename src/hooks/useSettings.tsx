import { useState, useEffect, useCallback } from "react";
import { AppSettings } from "@/types/settings.types";
import { settingsService } from "@/services/settings.service";
import { toast } from "sonner";

/**
 * Hook para gerenciar configurações da aplicação
 */
export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => 
    settingsService.loadSettings()
  );

  /**
   * Atualiza as configurações e salva
   */
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    
    // Validação: pelo menos um método de TODO deve estar visível
    if (newSettings.todo?.visibleMethods) {
      const isValid = settingsService.validateTodoMethods(newSettings.todo.visibleMethods);
      if (!isValid) {
        toast.error("Pelo menos um método de tarefas deve estar visível");
        return;
      }
    }
    
    setSettings(updated);
    settingsService.saveSettings(updated);
    toast.success("Configurações salvas");
  }, [settings]);

  /**
   * Atualiza apenas integrações
   */
  const updateIntegrations = useCallback((integrations: Partial<AppSettings["integrations"]>) => {
    updateSettings({
      integrations: { ...settings.integrations, ...integrations },
    });
  }, [settings, updateSettings]);

  /**
   * Atualiza apenas métodos de TODO visíveis
   */
  const updateTodoMethods = useCallback((visibleMethods: Partial<AppSettings["todo"]["visibleMethods"]>) => {
    updateSettings({
      todo: {
        ...settings.todo,
        visibleMethods: { ...settings.todo.visibleMethods, ...visibleMethods },
      },
    });
  }, [settings, updateSettings]);

  /**
   * Atualiza apenas notificações
   */
  const updateNotifications = useCallback((notifications: Partial<AppSettings["notifications"]>) => {
    updateSettings({
      notifications: { ...settings.notifications, ...notifications },
    });
  }, [settings, updateSettings]);

  /**
   * Reseta todas as configurações
   */
  const resetSettings = useCallback(() => {
    const defaults = settingsService.resetSettings();
    setSettings(defaults);
    toast.success("Configurações resetadas");
  }, []);

  return {
    settings,
    updateSettings,
    updateIntegrations,
    updateTodoMethods,
    updateNotifications,
    resetSettings,
  };
};
