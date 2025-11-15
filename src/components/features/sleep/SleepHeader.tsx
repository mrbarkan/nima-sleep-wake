/**
 * Sleep page header with icon and info popup
 */

import { useTranslation } from "react-i18next";
import { Moon } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const SleepHeader = () => {
  const { t } = useTranslation('sleep');

  return (
    <div className="mb-4 md:mb-8">
      <div className="flex items-center gap-3">
        <Moon className="h-5 w-5 md:h-8 md:w-8 text-[hsl(var(--icon-sleep))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-lg md:text-3xl font-semibold">{t('title')}</h1>
            <InfoPopup
              title={t('infoTitle')}
              content={t('infoContent')}
              sources={[
                {
                  label: t('sources.sleepFoundation'),
                  url: "https://www.sleepfoundation.org/how-sleep-works/sleep-cycles",
                },
                {
                  label: t('sources.nih'),
                  url: "https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep",
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
