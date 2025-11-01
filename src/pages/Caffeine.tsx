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
  } = useCaffeineScheduler();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <CaffeineHeader />
      
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
