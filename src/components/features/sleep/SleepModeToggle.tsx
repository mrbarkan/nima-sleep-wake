/**
 * Toggle between wake and sleep modes
 */

import { Button } from "@/components/ui/button";
import { Sunrise, Sunset } from "lucide-react";
import { SleepMode } from "@/types/sleep.types";

interface SleepModeToggleProps {
  mode: SleepMode;
  onModeChange: (mode: SleepMode) => void;
}

export const SleepModeToggle = ({ mode, onModeChange }: SleepModeToggleProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={mode === "wake" ? "default" : "ghost"}
        className="flex-1"
        onClick={() => onModeChange("wake")}
      >
        <Sunrise className="mr-2 h-4 w-4" />
        Acordar
      </Button>
      <Button
        variant={mode === "sleep" ? "default" : "ghost"}
        className="flex-1"
        onClick={() => onModeChange("sleep")}
      >
        <Sunset className="mr-2 h-4 w-4" />
        Dormir
      </Button>
    </div>
  );
};
