/**
 * Wake time input form for caffeine scheduler
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface CaffeineTimeInputProps {
  wakeTime: string;
  onWakeTimeChange: (time: string) => void;
  onCalculate: () => void;
}

export const CaffeineTimeInput = ({
  wakeTime,
  onWakeTimeChange,
  onCalculate,
}: CaffeineTimeInputProps) => {
  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wake-time-caffeine">Que horas você acorda?</Label>
          <Input
            id="wake-time-caffeine"
            type="time"
            value={wakeTime}
            onChange={(e) => onWakeTimeChange(e.target.value)}
            className="text-lg"
          />
        </div>
        <Button onClick={onCalculate} className="w-full" size="lg">
          <Clock className="mr-2 h-4 w-4" />
          Gerar Cronograma
        </Button>
      </div>
    </Card>
  );
};
