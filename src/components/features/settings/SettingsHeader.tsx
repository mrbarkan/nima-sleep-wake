import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Cabeçalho da página de configurações
 */
export const SettingsHeader = () => {
  const { t } = useTranslation("settings");

  return (
    <div className="mb-4 md:mb-8">
      <div className="flex items-center gap-3">
        <Settings className="h-5 w-5 md:h-8 md:w-8 text-[hsl(var(--icon-settings))]" />
        <div>
          <h1 className="text-lg md:text-3xl font-semibold">
            {t("header.title")}
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            {t("header.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};
