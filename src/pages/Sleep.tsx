import { useSleepCalculator } from "@/hooks/useSleepCalculator";
import { SleepHeader, SleepTimeInput, SleepResultsList } from "@/components/features/sleep";

const Sleep = () => {
  const {
    mode,
    time,
    calculatedTimes,
    selectedTime,
    setTime,
    setSelectedTime,
    calculateTimes,
    getCycleLabel,
    changeMode,
  } = useSleepCalculator();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-4 pb-20 md:py-8 md:pb-8">
      <SleepHeader />
      
      <SleepTimeInput
        mode={mode}
        time={time}
        onModeChange={changeMode}
        onTimeChange={setTime}
        onCalculate={calculateTimes}
      />

      <SleepResultsList
        calculatedTimes={calculatedTimes}
        selectedTime={selectedTime}
        mode={mode}
        getCycleLabel={getCycleLabel}
        onSelectTime={setSelectedTime}
      />
    </div>
  );
};

export default Sleep;
