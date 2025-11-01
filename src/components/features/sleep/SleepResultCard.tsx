/**
 * Individual sleep time result card
 */

import { Card } from "@/components/ui/card";
import { NotificationToggle } from "@/components/features/notifications/NotificationToggle";
import { SleepMode } from "@/types/sleep.types";

interface SleepResultCardProps {
  time: string;
  cycles: number;
  isMinimum: boolean;
  isIdeal: boolean;
  isSelected: boolean;
  mode: SleepMode;
  cycleLabel: string;
  onSelect: () => void;
}

export const SleepResultCard = ({
  time,
  isMinimum,
  isIdeal,
  isSelected,
  mode,
  cycleLabel,
  onSelect,
}: SleepResultCardProps) => {
  const isHighlighted = isMinimum || isIdeal;

  return (
    <div className="space-y-2">
      <Card
        className={`p-4 transition-all hover:shadow-md cursor-pointer ${
          isHighlighted ? "border-accent bg-accent/5" : ""
        } ${isSelected ? "ring-2 ring-accent" : ""}`}
        onClick={onSelect}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-medium">{time}</div>
            <div className="text-sm text-muted-foreground">
              {cycleLabel}
            </div>
          </div>
          {isMinimum && (
            <div className="text-xs font-medium text-accent">
              Mínimo
            </div>
          )}
          {isIdeal && (
            <div className="text-xs font-medium text-accent">
              Ideal
            </div>
          )}
        </div>
      </Card>
      {isSelected && (
        <NotificationToggle
          type={mode === "wake" ? "sleep" : "wake"}
          time={time}
          title={mode === "wake" ? "Hora de dormir!" : "Hora de acordar!"}
          body={mode === "wake" 
            ? `Está na hora de se preparar para dormir. Horário ideal: ${time}`
            : `Bom dia! Hora de acordar para começar o dia bem. Horário: ${time}`
          }
        />
      )}
    </div>
  );
};
