/**
 * Visual timeline of fasting phases with progress
 */

import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FastingCalculation } from "@/types/fasting.types";
import { FastingPhaseCard } from "./FastingPhaseCard";
import { Clock, TrendingUp } from "lucide-react";

interface FastingTimelineProps {
  calculation: FastingCalculation;
}

export const FastingTimeline = ({ calculation }: FastingTimelineProps) => {
  const { t } = useTranslation("fasting");

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.floor(Math.abs(minutes) % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">
                {t("timeline.currentPhase")}
              </div>
              <div className="text-xl font-semibold">
                {calculation.currentPhase?.name || t("timeline.completed")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {t("timeline.progress")}
              </div>
              <div className="text-2xl font-bold text-accent">
                {Math.round(calculation.progressPercentage)}%
              </div>
            </div>
          </div>

          <Progress value={calculation.progressPercentage} className="h-3" />

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {t("timeline.timeInPhase")}: {formatTime(calculation.timeInCurrentPhase)}
              </span>
            </div>
            {calculation.timeToNextPhase > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {t("timeline.nextPhase")}: {formatTime(calculation.timeToNextPhase)}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {t("timeline.breakfastTime")}
            </div>
            <div className="text-lg font-semibold">{calculation.breakfastTime}</div>
          </div>
        </div>
      </Card>

      {/* Phase Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{t("timeline.phasesTitle")}</h2>
        {calculation.phases.map((phase) => (
          <FastingPhaseCard
            key={phase.id}
            phase={phase}
            isActive={calculation.currentPhase?.id === phase.id}
          />
        ))}
      </div>
    </div>
  );
};
