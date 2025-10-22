import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Clock, Sparkles } from "lucide-react";

const Sleep = () => {
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTimes, setSleepTimes] = useState<string[]>([]);

  const calculateSleepTimes = () => {
    if (!wakeTime) return;

    const [hours, minutes] = wakeTime.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0);

    const times: string[] = [];
    const cycleMinutes = 90;
    const fallAsleepTime = 15; // Tempo para adormecer

    // Calcula 6 ciclos (9h, 7.5h, 6h, 4.5h, 3h, 1.5h antes do despertar)
    for (let cycles = 6; cycles >= 1; cycles--) {
      const sleepTime = new Date(wakeDate);
      sleepTime.setMinutes(sleepTime.getMinutes() - (cycles * cycleMinutes + fallAsleepTime));
      
      const timeString = sleepTime.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      times.push(timeString);
    }

    setSleepTimes(times);
  };

  const getCycleLabel = (index: number) => {
    const cycles = 6 - index;
    const hours = (cycles * 1.5).toFixed(1);
    return `${cycles} ciclos (${hours}h)`;
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Moon className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-semibold">Calculadora de Sono</h1>
        </div>
        <p className="text-muted-foreground">
          Baseado em ciclos de 90 minutos para um despertar mais natural
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wake-time">Que horas você precisa acordar?</Label>
            <Input
              id="wake-time"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="text-lg"
            />
          </div>
          <Button onClick={calculateSleepTimes} className="w-full" size="lg">
            <Clock className="mr-2 h-4 w-4" />
            Calcular Horários
          </Button>
        </div>
      </Card>

      {sleepTimes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Horários recomendados para dormir:</span>
          </div>
          {sleepTimes.map((time, index) => (
            <Card
              key={index}
              className={`p-4 transition-all hover:shadow-md ${
                index === 2 || index === 3
                  ? "border-accent bg-accent/5"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-medium">{time}</div>
                  <div className="text-sm text-muted-foreground">
                    {getCycleLabel(index)}
                  </div>
                </div>
                {(index === 2 || index === 3) && (
                  <div className="text-xs font-medium text-accent">
                    Recomendado
                  </div>
                )}
              </div>
            </Card>
          ))}
          <p className="text-xs text-muted-foreground mt-4 p-4 bg-muted/50 rounded">
            <strong>Dica:</strong> Adicione 15 minutos ao horário escolhido para considerar o tempo de adormecer. Os ciclos de 4-6 (6-9 horas) são ideais para a maioria dos adultos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Sleep;
