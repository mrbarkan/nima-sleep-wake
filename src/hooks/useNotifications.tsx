import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notification.service";
import type { NotificationType } from "@/types/notification.types";

interface NotificationPermission {
  granted: boolean;
  supported: boolean;
}

export type { NotificationType };

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: notificationService.isGranted(),
    supported: notificationService.isSupported(),
  });

  useEffect(() => {
    setPermission({
      granted: notificationService.isGranted(),
      supported: notificationService.isSupported(),
    });
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!notificationService.isSupported()) {
      toast({
        variant: "destructive",
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações push.",
      });
      return false;
    }

    try {
      const granted = await notificationService.requestPermission();
      
      setPermission({
        granted,
        supported: true,
      });

      if (granted) {
        toast({
          title: "Notificações ativadas!",
          description: "Você receberá lembretes nos horários agendados.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Permissão negada",
          description: "Para receber notificações, permita o acesso nas configurações do navegador.",
        });
      }

      return granted;
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível solicitar permissão para notificações.",
      });
      return false;
    }
  };

  const scheduleNotification = async (
    type: NotificationType,
    time: string,
    title: string,
    body: string
  ) => {
    if (!permission.granted) {
      toast({
        variant: "destructive",
        title: "Permissão necessária",
        description: "Primeiro permita as notificações.",
      });
      return;
    }

    try {
      await notificationService.scheduleNotification({
        type,
        time,
        title,
        body,
      });

      toast({
        title: "Notificação agendada!",
        description: `Você receberá um lembrete às ${time}.`,
      });
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível agendar a notificação.",
      });
    }
  };

  const cancelNotification = (type: NotificationType) => {
    try {
      notificationService.cancelNotification(type);
      
      toast({
        title: "Notificação cancelada",
        description: "O lembrete foi removido.",
      });
    } catch (error) {
      console.error("Erro ao cancelar notificação:", error);
    }
  };

  const getScheduledNotifications = (type?: NotificationType) => {
    return notificationService.getScheduledNotifications(type);
  };

  const scheduleRecurringReminder = (intervalMinutes: number) => {
    if (!permission.granted) {
      toast({
        variant: "destructive",
        title: "Permissão necessária",
        description: "Primeiro permita as notificações.",
      });
      return;
    }

    try {
      notificationService.scheduleRecurringReminder(
        intervalMinutes,
        "Lembrete de Tarefas",
        "Hora de checar sua lista de tarefas! 📝"
      );

      const hours = Math.floor(intervalMinutes / 60);
      const minutes = intervalMinutes % 60;
      let intervalText = "";
      if (hours > 0) {
        intervalText = `${hours}h`;
        if (minutes > 0) intervalText += ` ${minutes}min`;
      } else {
        intervalText = `${minutes}min`;
      }

      toast({
        title: "Lembretes ativados!",
        description: `Você receberá um lembrete a cada ${intervalText}.`,
      });
    } catch (error) {
      console.error("Erro ao agendar lembretes recorrentes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível agendar os lembretes.",
      });
    }
  };

  const cancelRecurringReminder = () => {
    try {
      notificationService.cancelRecurringReminder();
      
      toast({
        title: "Lembretes desativados",
        description: "Os lembretes recorrentes foram cancelados.",
      });
    } catch (error) {
      console.error("Erro ao cancelar lembretes recorrentes:", error);
    }
  };

  const getRecurringReminderInterval = (): number | null => {
    return notificationService.getRecurringReminderInterval();
  };

  return {
    permission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    getScheduledNotifications,
    scheduleRecurringReminder,
    cancelRecurringReminder,
    getRecurringReminderInterval,
  };
};
