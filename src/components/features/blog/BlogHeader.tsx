/**
 * Blog page header with icon and info popup
 */

import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const BlogHeader = () => {
  const { t } = useTranslation('blog');

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-blog))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-xl md:text-3xl font-semibold">{t('title')}</h1>
            <InfoPopup
              title={t('infoTitle')}
              content={t('infoContent')}
              sources={[
                {
                  label: t('sources.sleepFoundation'),
                  url: "https://www.sleepfoundation.org/",
                },
                {
                  label: t('sources.nih'),
                  url: "https://www.nhlbi.nih.gov/health/sleep",
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
