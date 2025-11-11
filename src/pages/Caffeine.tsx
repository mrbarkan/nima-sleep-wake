import { useCaffeineScheduler } from "@/hooks/useCaffeineScheduler";
import { CaffeineHeader, CaffeineTimeInput, CaffeineScheduleList } from "@/components/features/caffeine";

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

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <CaffeineHeader />
      
      {integrationActive && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
          ☕ Modo Jejum: Apenas café preto compatível com jejum intermitente
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
