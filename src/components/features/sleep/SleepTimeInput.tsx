/**
 * Time input form for sleep calculator
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { SleepMode } from "@/types/sleep.types";
import { SleepModeToggle } from "./SleepModeToggle";

interface SleepTimeInputProps {
  mode: SleepMode;
  time: string;
  onModeChange: (mode: SleepMode) => void;
  onTimeChange: (time: string) => void;
  onCalculate: () => void;
}

export const SleepTimeInput = ({
  mode,
  time,
  onModeChange,
  onTimeChange,
  onCalculate,
}: SleepTimeInputProps) => {
  return (
    <Card className="p-4 mb-4 md:p-6 md:mb-6">
      <div className="space-y-3 md:space-y-4">
        <SleepModeToggle mode={mode} onModeChange={onModeChange} />
        
        <div className="space-y-2">
          <Label htmlFor="time">
            {mode === "wake" 
              ? "Que horas você precisa acordar?" 
              : "Que horas você está indo dormir?"}
          </Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="text-base md:text-lg h-11"
          />
        </div>
        <Button onClick={onCalculate} className="w-full" size="lg">
          <Clock className="mr-2 h-4 w-4" />
          Calcular Horários
        </Button>
      </div>
    </Card>
  );
};
