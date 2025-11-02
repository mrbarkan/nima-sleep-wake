/**
 * Caffeine page header with icon and info popup
 */

import { useTranslation } from "react-i18next";
import { Coffee } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const CaffeineHeader = () => {
  const { t } = useTranslation('caffeine');

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <Coffee className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-caffeine))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-xl md:text-3xl font-semibold">{t('title')}</h1>
            <InfoPopup
              title={t('infoTitle')}
              content={t('infoContent')}
              sources={[
                {
                  label: t('sources.sleepFoundation'),
                  url: "https://www.sleepfoundation.org/nutrition/caffeine-and-sleep",
                },
                {
                  label: t('sources.huberman'),
                  url: "https://hubermanlab.com/using-caffeine-to-optimize-mental-and-physical-performance/",
                },
              ]}
            />
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">
            {t('subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};
