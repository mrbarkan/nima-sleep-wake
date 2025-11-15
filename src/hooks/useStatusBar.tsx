import { useEffect } from "react";
import { useTheme } from "next-themes";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

/**
 * Hook para gerenciar a status bar do dispositivo
 * Adapta o estilo (escuro/claro) automaticamente com base no tema
 */
export const useStatusBar = () => {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Só funciona em plataformas nativas (iOS/Android)
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    // Tema claro → ícones escuros (Style.Dark)
    // Tema escuro → ícones claros (Style.Light)
    StatusBar.setStyle({ style: isDark ? Style.Light : Style.Dark }).catch(
      (error) => {
        console.error("Error setting status bar style:", error);
      }
    );
  }, [theme, systemTheme]);

  return null;
};
