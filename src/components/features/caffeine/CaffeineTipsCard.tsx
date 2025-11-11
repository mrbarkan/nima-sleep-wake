/**
 * Important tips card for caffeine consumption
 */

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CaffeineTipsCard = () => {
  const { t } = useTranslation("caffeine");
  
  return (
    <Card className="p-4 bg-muted/50 border-muted">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>{t("tips.title")}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t("tips.items.cutoff")}</li>
            <li>{t("tips.items.halfLife")}</li>
            <li>{t("tips.items.tolerance")}</li>
            <li><strong>💧 {t("tips.items.hydration")}</strong></li>
            <li>{t("tips.items.fasting")}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
