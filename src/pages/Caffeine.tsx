import { useCaffeineScheduler } from "@/hooks/useCaffeineScheduler";
import { CaffeineHeader, CaffeineTimeInput, CaffeineScheduleList } from "@/components/features/caffeine";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/config/constants";

const Caffeine = () => {
  const {
    wakeTime,
    schedule,
    openNotifications,
    setWakeTime,
    setOpenNotifications,
    calculateSchedule,
    integrationActive,
  } = useCaffeineScheduler();

  const [fastingInfo, setFastingInfo] = useState<string | null>(null);

  useEffect(() => {
    if (integrationActive) {
      const fastingCalculation = localStorage.getItem(STORAGE_KEYS.FASTING_CALCULATION);
      if (fastingCalculation) {
        try {
          const calculation = JSON.parse(fastingCalculation);
          const breakfastTime = calculation?.breakfastTime;
          if (breakfastTime) {
            setFastingInfo(`🥗 Jejum ativo até ${breakfastTime}. Todas opções liberadas após esse horário.`);
            return;
          }
        } catch (e) {
          console.error("Error parsing fasting calculation:", e);
        }
      }
    }
    setFastingInfo(null);
  }, [integrationActive]);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <CaffeineHeader />
      
      {integrationActive && fastingInfo && (
        <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
          <p className="text-sm font-medium">{fastingInfo}</p>
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Durante o jejum:</strong> Sem leite, sem açúcar
          </p>
          <p className="text-xs text-muted-foreground">
            💧 Lembre-se de beber água com frequência
          </p>
        </div>
      )}

      <CaffeineTimeInput
        wakeTime={wakeTime}
        onWakeTimeChange={setWakeTime}
        onCalculate={calculateSchedule}
      />

      <CaffeineScheduleList
        schedule={schedule}
        openNotifications={openNotifications}
        onToggleNotification={(index, open) => 
          setOpenNotifications(prev => ({ ...prev, [index]: open }))
        }
      />
    </div>
  );
};

export default Caffeine;
