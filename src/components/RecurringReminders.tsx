import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import InfoPopup from "./InfoPopup";

export const RecurringReminders = () => {
  const { 
    permission, 
    requestPermission, 
    scheduleRecurringReminder, 
    cancelRecurringReminder,
    getRecurringReminderInterval 
  } = useNotifications();
  
  const [selectedInterval, setSelectedInterval] = useState<string>("none");

  useEffect(() => {
    const currentInterval = getRecurringReminderInterval();
    if (currentInterval) {
      setSelectedInterval(currentInterval.toString());
    }
  }, []);

  if (!permission.supported) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Lembretes Recorrentes</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Permita notificações para receber lembretes periódicos.
          </p>
          <Button onClick={requestPermission} size="sm" className="w-full">
            Permitir Notificações
          </Button>
        </div>
      </Card>
    );
  }

  const handleIntervalChange = (value: string) => {
    setSelectedInterval(value);
    
    if (value === "none") {
      cancelRecurringReminder();
    } else {
      scheduleRecurringReminder(Number(value));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h3 className="font-medium">Lembretes Recorrentes</h3>
        <InfoPopup
          title="Por que usar lembretes?"
          content="Ao longo do dia sempre esqueço de checar a lista de tarefas, portanto um lembrete constante, talvez ajude. E talvez ajudará você também. - MrBarkan"
        />
      </div>

      <Card className="p-4">
        <RadioGroup value={selectedInterval} onValueChange={handleIntervalChange}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className="cursor-pointer">
                Desativado
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30" id="30min" />
              <Label htmlFor="30min" className="cursor-pointer">
                A cada 30 minutos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60" id="1h" />
              <Label htmlFor="1h" className="cursor-pointer">
                A cada 1 hora
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="180" id="3h" />
              <Label htmlFor="3h" className="cursor-pointer">
                A cada 3 horas
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </div>
  );
};
