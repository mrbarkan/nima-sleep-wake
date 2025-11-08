/**
 * Input component for fasting times and duration
 */

import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator } from "lucide-react";

interface FastingTimeInputProps {
  lastMealTime: string;
  targetDuration: number;
  onLastMealTimeChange: (time: string) => void;
  onTargetDurationChange: (duration: number) => void;
  onCalculate: () => void;
}

export const FastingTimeInput = ({
  lastMealTime,
  targetDuration,
  onLastMealTimeChange,
  onTargetDurationChange,
  onCalculate,
}: FastingTimeInputProps) => {
  const { t } = useTranslation("fasting");

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="lastMeal">{t("input.lastMealLabel")}</Label>
          <Input
            id="lastMeal"
            type="time"
            value={lastMealTime}
            onChange={(e) => onLastMealTimeChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="duration">{t("input.targetDurationLabel")}</Label>
          <Select
            value={String(targetDuration)}
            onValueChange={(value) => onTargetDurationChange(Number(value))}
          >
            <SelectTrigger id="duration" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">{t("input.durations.12")}</SelectItem>
              <SelectItem value="14">{t("input.durations.14")}</SelectItem>
              <SelectItem value="16">{t("input.durations.16")}</SelectItem>
              <SelectItem value="18">{t("input.durations.18")}</SelectItem>
              <SelectItem value="20">{t("input.durations.20")}</SelectItem>
              <SelectItem value="24">{t("input.durations.24")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onCalculate} className="w-full">
          <Calculator className="mr-2 h-4 w-4" />
          {t("input.calculateButton")}
        </Button>
      </div>
    </Card>
  );
};
