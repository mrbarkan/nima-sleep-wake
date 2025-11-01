/**
 * Caffeine page header with icon and info popup
 */

import { Coffee } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const CaffeineHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <Coffee className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-caffeine))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-xl md:text-3xl font-semibold">Cafeína</h1>
            <InfoPopup
              title="Timing da Cafeína"
              content="A cafeína tem meia-vida de 5-6 horas no organismo. Consumir após 15h pode interferir no sono. O momento ideal para a primeira dose é 90-120 minutos após acordar, quando o cortisol natural começa a declinar."
              sources={[
                {
                  label: "Sleep Foundation - Caffeine and Sleep",
                  url: "https://www.sleepfoundation.org/nutrition/caffeine-and-sleep",
                },
                {
                  label: "Huberman Lab - Caffeine Timing",
                  url: "https://hubermanlab.com/using-caffeine-to-optimize-mental-and-physical-performance/",
                },
              ]}
            />
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">
            Doses estratégicas ao longo do dia
          </p>
        </div>
      </div>
    </div>
  );
};
