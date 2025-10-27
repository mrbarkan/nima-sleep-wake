import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Clock, Sparkles, Sunrise, Sunset } from "lucide-react";
import InfoPopup from "@/components/InfoPopup";

const Sleep = () => {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("");
  const [calculatedTimes, setCalculatedTimes] = useState<string[]>([]);

  const calculateTimes = () => {
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const referenceDate = new Date();
    referenceDate.setHours(hours, minutes, 0);

    const times: string[] = [];
    const cycleMinutes = 90;
    const fallAsleepTime = 15;

    if (mode === "wake") {
      // Calcula horários para dormir baseado na hora de acordar
      for (let cycles = 6; cycles >= 1; cycles--) {
        const sleepTime = new Date(referenceDate);
        sleepTime.setMinutes(sleepTime.getMinutes() - (cycles * cycleMinutes + fallAsleepTime));
        
        const timeString = sleepTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        times.push(timeString);
      }
    } else {
      // Calcula horários para acordar baseado na hora de dormir
      const bedTime = new Date(referenceDate);
      bedTime.setMinutes(bedTime.getMinutes() + fallAsleepTime);
      
      for (let cycles = 1; cycles <= 6; cycles++) {
        const wakeTime = new Date(bedTime);
        wakeTime.setMinutes(wakeTime.getMinutes() + (cycles * cycleMinutes));
        
        const timeString = wakeTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        times.push(timeString);
      }
    }

    setCalculatedTimes(times);
  };

  const getCycleLabel = (index: number) => {
    const cycles = mode === "wake" ? 6 - index : index + 1;
    const hours = (cycles * 1.5).toFixed(1);
    return `${cycles} ciclos (${hours}h)`;
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Moon className="h-8 w-8 text-accent" />
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-semibold">Calculadora do Sono</h1>
              <InfoPopup
                title="Ciclos do Sono"
                content="O sono é organizado em ciclos de aproximadamente 90 minutos. Cada ciclo passa por diferentes estágios: sono leve, sono profundo e REM. Acordar ao final de um ciclo completo nos faz sentir mais descansados."
                sources={[
                  {
                    label: "Sleep Foundation - Sleep Stages",
                    url: "https://www.sleepfoundation.org/stages-of-sleep",
                  },
                  {
                    label: "NIH - Sleep Science",
                    url: "https://www.nhlbi.nih.gov/health/sleep",
                  },
                ]}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Baseado em ciclos de 90 minutos
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={mode === "wake" ? "default" : "ghost"}
              className="flex-1"
              onClick={() => {
                setMode("wake");
                setCalculatedTimes([]);
              }}
            >
              <Sunrise className="mr-2 h-4 w-4" />
              Acordar
            </Button>
            <Button
              variant={mode === "sleep" ? "default" : "ghost"}
              className="flex-1"
              onClick={() => {
                setMode("sleep");
                setCalculatedTimes([]);
              }}
            >
              <Sunset className="mr-2 h-4 w-4" />
              Dormir
            </Button>
          </div>
          
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
              onChange={(e) => setTime(e.target.value)}
              className="text-lg"
            />
          </div>
          <Button onClick={calculateTimes} className="w-full" size="lg">
            <Clock className="mr-2 h-4 w-4" />
            Calcular Horários
          </Button>
        </div>
      </Card>

      {calculatedTimes.length > 0 && (
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
            const cycles = mode === "wake" ? 6 - index : index + 1;
            const isMinimum = cycles === 4;
            const isIdeal = cycles === 5;
            const isHighlighted = isMinimum || isIdeal;
            
            return (
              <Card
                key={index}
                className={`p-4 transition-all hover:shadow-md ${
                  isHighlighted
                    ? "border-accent bg-accent/5"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-medium">{timeStr}</div>
                    <div className="text-sm text-muted-foreground">
                      {getCycleLabel(index)}
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
            );
          })}
          <p className="text-xs text-muted-foreground mt-4 p-4 bg-muted/50 rounded">
            <strong>Dica:</strong> Adicione 15 minutos ao horário escolhido para considerar o tempo de adormecer. Os ciclos de 4-6 (6-9 horas) são ideais para a maioria dos adultos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Sleep;
