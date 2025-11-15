/**
 * Individual fasting phase card with details
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { FastingPhase } from "@/types/fasting.types";
import {
  Utensils,
  Battery,
  Flame,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FastingPhaseCardProps {
  phase: FastingPhase;
  isActive: boolean;
}

const iconMap = {
  Utensils,
  Battery,
  Flame,
  Sparkles,
  Zap,
};

export const FastingPhaseCard = ({ phase, isActive }: FastingPhaseCardProps) => {
  const { t } = useTranslation("fasting");
  const [isExpanded, setIsExpanded] = useState(isActive);

  const Icon = iconMap[phase.icon as keyof typeof iconMap];

  return (
    <Card
      className={`p-3 md:p-4 transition-all cursor-pointer ${
        isActive ? "border-accent bg-accent/5" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 md:gap-3 flex-1">
          <div
            className="p-1.5 md:p-2 rounded-lg"
            style={{ backgroundColor: phase.color, opacity: 0.2 }}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: phase.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-semibold">{phase.name}</h3>
              {isActive && (
                <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                  {t("timeline.active")}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{phase.description}</p>
            <div className="text-xs text-muted-foreground mt-1">
              {phase.startHour}h - {phase.endHour}h
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                <div className="text-sm font-medium">{t("phases.benefits")}:</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {phase.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="text-muted-foreground">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </div>
    </Card>
  );
};
