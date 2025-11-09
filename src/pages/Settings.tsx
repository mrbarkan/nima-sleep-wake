import { Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SettingsHeader, IntegrationSettings, TodoMethodSettings } from "@/components/features/settings";

/**
 * Página de configurações da aplicação
 */
const Settings = () => {
  const { t } = useTranslation("settings");

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <SettingsHeader />

      <div className="space-y-6">
        <IntegrationSettings />
        <TodoMethodSettings />
      </div>
    </div>
  );
};

export default Settings;
