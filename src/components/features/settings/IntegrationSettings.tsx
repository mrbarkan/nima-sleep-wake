import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hooks/useSettings";
import InfoPopup from "@/components/common/InfoPopup";

/**
 * Componente para configurar integrações entre funcionalidades
 */
export const IntegrationSettings = () => {
  const { t } = useTranslation("settings");
  const { settings, updateIntegrations } = useSettings();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">{t("sections.integrations")}</h2>
        <InfoPopup
          title={t("sections.integrations")}
          content={t("integrations.info")}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sleep-fasting" className="flex-1 cursor-pointer">
            {t("integrations.sleepWithFasting.label")}
            <p className="text-xs text-muted-foreground font-normal">
              {t("integrations.sleepWithFasting.description")}
            </p>
          </Label>
          <Switch
            id="sleep-fasting"
            checked={settings.integrations.sleepWithFasting}
            onCheckedChange={(checked) =>
              updateIntegrations({ sleepWithFasting: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sleep-caffeine" className="flex-1 cursor-pointer">
            {t("integrations.sleepWithCaffeine.label")}
            <p className="text-xs text-muted-foreground font-normal">
              {t("integrations.sleepWithCaffeine.description")}
            </p>
          </Label>
          <Switch
            id="sleep-caffeine"
            checked={settings.integrations.sleepWithCaffeine}
            onCheckedChange={(checked) =>
              updateIntegrations({ sleepWithCaffeine: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="fasting-caffeine" className="flex-1 cursor-pointer">
            {t("integrations.fastingWithCaffeine.label")}
            <p className="text-xs text-muted-foreground font-normal">
              {t("integrations.fastingWithCaffeine.description")}
            </p>
          </Label>
          <Switch
            id="fasting-caffeine"
            checked={settings.integrations.fastingWithCaffeine}
            onCheckedChange={(checked) =>
              updateIntegrations({ fastingWithCaffeine: checked })
            }
          />
        </div>
      </div>
    </Card>
  );
};
