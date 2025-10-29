import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useNotifications, NotificationType } from "@/hooks/useNotifications";

interface NotificationToggleProps {
  type: NotificationType;
  time: string;
  title: string;
  body: string;
  disabled?: boolean;
}

export const NotificationToggle = ({
  type,
  time,
  title,
  body,
  disabled = false,
}: NotificationToggleProps) => {
  const [enabled, setEnabled] = useState(false);
  const { permission, requestPermission, scheduleNotification, cancelNotification, getScheduledNotifications } = useNotifications();

  useEffect(() => {
    // Verifica se já tem notificação agendada para este tipo
    const scheduled = getScheduledNotifications(type);
    setEnabled(scheduled.length > 0);
  }, [type]);

  const handleToggle = async (checked: boolean) => {
    if (!time) return;

    if (checked) {
      // Se não tem permissão, solicita
      if (!permission.granted) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      scheduleNotification(type, time, title, body);
      setEnabled(true);
    } else {
      cancelNotification(type);
      setEnabled(false);
    }
  };

  if (!permission.supported) {
    return null;
  }

  return (
    <Card className="p-4 bg-accent/5 border-accent/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {enabled ? (
            <Bell className="h-5 w-5 text-accent" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <div className="flex-1">
            <Label htmlFor={`notification-${type}`} className="cursor-pointer">
              Notificar neste horário
            </Label>
            <p className="text-xs text-muted-foreground">
              {enabled ? "Você receberá um lembrete" : "Ative para receber lembretes"}
            </p>
          </div>
        </div>
        <Switch
          id={`notification-${type}`}
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={disabled || !time}
        />
      </div>
    </Card>
  );
};
