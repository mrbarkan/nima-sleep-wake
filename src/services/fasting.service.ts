/**
 * Fasting calculation service
 */

import { FastingPhase, FastingCalculation } from "@/types/fasting.types";

class FastingService {
  private readonly FASTING_PHASES: FastingPhase[] = [
    {
      id: "anabolic",
      name: "Fase Anabólica",
      description: "Digestão e absorção de nutrientes",
      startHour: 0,
      endHour: 4,
      color: "hsl(var(--fasting-phase-1))",
      benefits: ["Absorção de nutrientes", "Níveis de insulina elevados"],
      icon: "Utensils",
    },
    {
      id: "post-absorption",
      name: "Fase Pós-Absorção",
      description: "Queima de glicogênio",
      startHour: 4,
      endHour: 12,
      color: "hsl(var(--fasting-phase-2))",
      benefits: ["Uso de reservas de glicogênio", "Redução da insulina"],
      icon: "Battery",
    },
    {
      id: "ketosis",
      name: "Cetose Inicial",
      description: "Início da queima de gordura",
      startHour: 12,
      endHour: 16,
      color: "hsl(var(--fasting-phase-3))",
      benefits: ["Queima de gordura", "Clareza mental", "Produção de cetonas"],
      icon: "Flame",
    },
    {
      id: "autophagy",
      name: "Autofagia Ativa",
      description: "Renovação celular",
      startHour: 16,
      endHour: 24,
      color: "hsl(var(--fasting-phase-4))",
      benefits: [
        "Renovação celular",
        "Anti-envelhecimento",
        "Limpeza celular",
      ],
      icon: "Sparkles",
    },
    {
      id: "deep-autophagy",
      name: "Autofagia Profunda",
      description: "Regeneração máxima",
      startHour: 24,
      endHour: 72,
      color: "hsl(var(--fasting-phase-5))",
      benefits: [
        "Regeneração máxima",
        "Sistema imune forte",
        "Máximos benefícios",
      ],
      icon: "Zap",
    },
  ];

  /**
   * Suggests last meal time based on sleep time (2h before sleep) or wake time
   */
  suggestLastMealFromSleep(sleepTime: string, mode: "sleep" | "wake" = "sleep"): string {
    if (!this.isValidTimeFormat(sleepTime)) {
      return "20:00"; // Default fallback
    }

    const [hours, minutes] = sleepTime.split(":").map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    if (mode === "sleep") {
      // Subtract 2 hours for last meal before sleep
      const mealDate = new Date(targetDate);
      mealDate.setHours(mealDate.getHours() - 2);
      
      return mealDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // For wake mode, assume 8h sleep, subtract 10h total (8h sleep + 2h before)
      const mealDate = new Date(targetDate);
      mealDate.setHours(mealDate.getHours() - 10);
      
      return mealDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  /**
   * Calculates break fast time based on wake time and fasting duration
   */
  calculateBreakfastFromWake(wakeTime: string, fastingDuration: number): string {
    if (!this.isValidTimeFormat(wakeTime)) {
      return "";
    }

    const [hours, minutes] = wakeTime.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0, 0);
    
    // Calculate when to break fast (wake time + remaining fasting hours)
    const breakfastDate = new Date(wakeDate);
    // Assuming 8h of sleep, so fasting continues after waking
    const remainingFastingHours = Math.max(0, fastingDuration - 8);
    breakfastDate.setHours(breakfastDate.getHours() + remainingFastingHours);
    
    return breakfastDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  calculateFastingTimeline(
    lastMealTime: string,
    targetDuration: number
  ): FastingCalculation {
    const [hours, minutes] = lastMealTime.split(":").map(Number);
    const lastMeal = new Date();
    lastMeal.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeSinceLastMeal = (now.getTime() - lastMeal.getTime()) / 1000 / 60 / 60;

    // Se a última refeição foi "no futuro" (usuário colocou hora futura no mesmo dia), ajustar para dia anterior
    const hoursSinceMeal =
      timeSinceLastMeal < 0 ? timeSinceLastMeal + 24 : timeSinceLastMeal;

    // Calcular horário de quebra do jejum
    const fastingEndTime = new Date(lastMeal.getTime() + targetDuration * 60 * 60 * 1000);
    const breakfastHours = fastingEndTime.getHours();
    const breakfastMinutes = fastingEndTime.getMinutes();
    const breakfastTime = `${String(breakfastHours).padStart(2, "0")}:${String(
      breakfastMinutes
    ).padStart(2, "0")}`;

    // Determinar fase atual
    const currentPhase = this.getCurrentPhase(hoursSinceMeal);
    const nextPhase = this.getNextPhase(hoursSinceMeal);

    // Calcular tempo na fase atual
    const timeInCurrentPhase = currentPhase
      ? (hoursSinceMeal - currentPhase.startHour) * 60
      : 0;

    // Calcular tempo até próxima fase
    const timeToNextPhase = nextPhase
      ? (nextPhase.startHour - hoursSinceMeal) * 60
      : 0;

    // Calcular progresso percentual
    const progressPercentage = Math.min(
      (hoursSinceMeal / targetDuration) * 100,
      100
    );

    return {
      phases: this.FASTING_PHASES,
      currentPhase,
      timeInCurrentPhase,
      progressPercentage,
      nextPhaseName: nextPhase?.name || "Jejum completo",
      timeToNextPhase,
      breakfastTime,
      fastingEndTime,
    };
  }

  private getCurrentPhase(hoursSinceMeal: number): FastingPhase | null {
    for (const phase of this.FASTING_PHASES) {
      if (
        hoursSinceMeal >= phase.startHour &&
        hoursSinceMeal < phase.endHour
      ) {
        return phase;
      }
    }
    return this.FASTING_PHASES[this.FASTING_PHASES.length - 1]; // Última fase se passou de todas
  }

  private getNextPhase(hoursSinceMeal: number): FastingPhase | null {
    for (const phase of this.FASTING_PHASES) {
      if (hoursSinceMeal < phase.startHour) {
        return phase;
      }
    }
    return null;
  }

  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  getFastingPhases(): FastingPhase[] {
    return [...this.FASTING_PHASES];
  }
}

export const fastingService = new FastingService();
