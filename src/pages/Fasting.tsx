/**
 * Fasting page - Intermittent fasting calculator
 */

import { useFastingCalculator } from "@/hooks/useFastingCalculator";
import {
  FastingHeader,
  FastingTimeInput,
  FastingTimeline,
} from "@/components/features/fasting";

const Fasting = () => {
  const {
    lastMealTime,
    targetDuration,
    calculation,
    setLastMealTime,
    setTargetDuration,
    calculateTimeline,
  } = useFastingCalculator();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <FastingHeader />

      <FastingTimeInput
        lastMealTime={lastMealTime}
        targetDuration={targetDuration}
        onLastMealTimeChange={setLastMealTime}
        onTargetDurationChange={setTargetDuration}
        onCalculate={calculateTimeline}
      />

      {calculation && <FastingTimeline calculation={calculation} />}
    </div>
  );
};

export default Fasting;
