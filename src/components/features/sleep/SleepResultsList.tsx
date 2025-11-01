/**
 * List of calculated sleep times with recommendations
 */

import { Sparkles } from "lucide-react";
import { SleepMode } from "@/types/sleep.types";
import { SleepResultCard } from "./SleepResultCard";

interface SleepResultsListProps {
  calculatedTimes: string[];
  selectedTime: string;
  mode: SleepMode;
  getCycleLabel: (index: number) => string;
  onSelectTime: (time: string) => void;
}

export const SleepResultsList = ({
  calculatedTimes,
  selectedTime,
  mode,
  getCycleLabel,
  onSelectTime,
}: SleepResultsListProps) => {
  if (calculatedTimes.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>
          {mode === "wake" 
            ? "Horários recomendados para dormir:" 
            : "Horários recomendados para acordar:"}
        </span>
      </div>
      {calculatedTimes.map((timeStr, index) => {
        const cycles = 6 - index;
        const isMinimum = cycles === 5; // 7.5h - mínimo recomendado
        const isIdeal = cycles === 6; // 9h - ideal
        
        return (
          <SleepResultCard
            key={index}
            time={timeStr}
            cycles={cycles}
            isMinimum={isMinimum}
            isIdeal={isIdeal}
            isSelected={selectedTime === timeStr}
            mode={mode}
            cycleLabel={getCycleLabel(index)}
            onSelect={() => onSelectTime(timeStr)}
          />
        );
      })}
      <p className="text-xs text-muted-foreground mt-4 p-4 bg-muted/50 rounded">
        <strong>Baseado em Recomendações Médicas:</strong> Adultos precisam de 7-9 horas de sono por noite (5-6 ciclos). Menos de 7 horas está associado a problemas de saúde. Adicione 15 minutos ao horário escolhido para considerar o tempo de adormecer.
      </p>
    </div>
  );
};
