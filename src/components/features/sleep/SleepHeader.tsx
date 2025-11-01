/**
 * Sleep page header with icon and info popup
 */

import { Moon } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const SleepHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <Moon className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-sleep))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-xl md:text-3xl font-semibold">Calculadora</h1>
            <InfoPopup
              title="Recomendações Clínicas"
              content="Adultos saudáveis precisam de 7-9 horas de sono por noite, segundo a American Academy of Sleep Medicine. O sono é organizado em ciclos de 90 minutos. Acordar ao final de um ciclo completo nos faz sentir mais descansados. Esta calculadora ajuda você a encontrar horários que se alinham com esses ciclos naturais."
              sources={[
                {
                  label: "Sleep Foundation - Recommended Sleep Hours",
                  url: "https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need",
                },
                {
                  label: "American Academy of Sleep Medicine",
                  url: "https://aasm.org/clinical-resources/practice-standards/practice-guidelines/",
                },
              ]}
            />
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">
            Baseado em ciclos de 90 minutos
          </p>
        </div>
      </div>
    </div>
  );
};
