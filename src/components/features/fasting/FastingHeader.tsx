/**
 * Fasting page header with icon and info popup
 */

import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const FastingHeader = () => {
  const { t } = useTranslation("fasting");

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-fasting))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-xl md:text-3xl font-semibold">{t("header.title")}</h1>
            <InfoPopup
              title={t("infoTitle")}
              content={t("infoContent")}
              sources={[
                {
                  label: t("sources.autophagy"),
                  url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6257056/",
                },
                {
                  label: t("sources.metabolism"),
                  url: "https://www.nejm.org/doi/full/10.1056/NEJMra1905136",
                },
              ]}
            />
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">
            {t("header.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};
