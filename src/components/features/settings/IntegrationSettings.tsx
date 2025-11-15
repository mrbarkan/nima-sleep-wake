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
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <h2 className="text-base md:text-lg font-semibold">{t("sections.integrations")}</h2>
        <InfoPopup
          title={t("sections.integrations")}
          content={t("integrations.info")}
        />
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sleep-fasting" className="flex-1 cursor-pointer">
            <span className="text-sm md:text-base">{t("integrations.sleepWithFasting.label")}</span>
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
            <span className="text-sm md:text-base">{t("integrations.sleepWithCaffeine.label")}</span>
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
            <span className="text-sm md:text-base">{t("integrations.fastingWithCaffeine.label")}</span>
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
