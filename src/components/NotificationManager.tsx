import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { RecurringReminders } from "./RecurringReminders";
import { Separator } from "@/components/ui/separator";

export const NotificationManager = () => {
  const { permission, requestPermission, getScheduledNotifications, cancelNotification } = useNotifications();

  const allNotifications = getScheduledNotifications();

  if (!permission.supported) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Notificações não são suportadas neste navegador.
        </p>
      </Card>
    );
  }

  if (!permission.granted) {
    return (
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Permissão necessária</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Permita notificações para receber lembretes.
          </p>
          <Button onClick={requestPermission} size="sm" className="w-full">
            Permitir Notificações
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <RecurringReminders />
      
      <Separator />
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5" />
          <h3 className="font-medium">Notificações Agendadas</h3>
        </div>
        
        {allNotifications.length === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Nenhuma notificação agendada
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {allNotifications.map((notification) => (
              <Card key={notification.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notification.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Horário: {notification.time}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelNotification(notification.type)}
                    className="flex-shrink-0 h-8 px-2"
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
