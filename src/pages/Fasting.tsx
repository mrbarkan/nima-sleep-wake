/**
 * Fasting page - Intermittent fasting calculator
 */

import { useFastingCalculator } from "@/hooks/useFastingCalculator";
import {
  FastingHeader,
  FastingTimeInput,
  FastingTimeline,
} from "@/components/features/fasting";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Fasting = () => {
  const {
    lastMealTime,
    targetDuration,
    calculation,
    integrationSuggestion,
    showSuggestionPopup,
    setLastMealTime,
    setTargetDuration,
    calculateTimeline,
    acceptSuggestion,
    ignoreSuggestion,
  } = useFastingCalculator();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-4 pb-20 md:py-8 md:pb-8">
      <FastingHeader />

      {showSuggestionPopup && integrationSuggestion && (
        <div className="mb-3 p-3 md:mb-4 md:p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium mb-3">{integrationSuggestion}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={acceptSuggestion}>
                  Aceitar
                </Button>
                <Button size="sm" variant="outline" onClick={ignoreSuggestion}>
                  Ignorar
                </Button>
              </div>
            </div>
            <button
              onClick={ignoreSuggestion}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
