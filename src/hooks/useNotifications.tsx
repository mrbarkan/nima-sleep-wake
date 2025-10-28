import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type NotificationType = "sleep" | "wake" | "caffeine" | string;

interface NotificationPermission {
  granted: boolean;
  supported: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    supported: "Notification" in window,
  });

  useEffect(() => {
    if ("Notification" in window) {
      setPermission({
        granted: Notification.permission === "granted",
        supported: true,
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      toast({
        variant: "destructive",
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações push.",
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === "granted";
      
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
      return false;
    }
  };

  const scheduleNotification = (
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

    // Calcula o delay até o horário especificado
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Se o horário já passou hoje, agenda para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Salva no localStorage
    const notificationId = `notification_${type}_${Date.now()}`;
    const notificationData = {
      id: notificationId,
      type,
      time,
      title,
      body,
      scheduledFor: scheduledTime.toISOString(),
    };

    const storedNotifications = JSON.parse(
      localStorage.getItem("scheduledNotifications") || "[]"
    );
    storedNotifications.push(notificationData);
    localStorage.setItem(
      "scheduledNotifications",
      JSON.stringify(storedNotifications)
    );

    // Envia mensagem para o Service Worker agendar a notificação
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        id: notificationId,
        title,
        body,
        icon: '/placeholder.svg',
        scheduledTime: scheduledTime.toISOString(),
      });
    } else {
      // Fallback para navegadores sem Service Worker
      const delay = scheduledTime.getTime() - now.getTime();
      setTimeout(() => {
        if (permission.granted) {
          new Notification(title, {
            body,
            icon: "/placeholder.svg",
            badge: "/placeholder.svg",
          });
        }

        // Remove do localStorage após disparar
        const notifications = JSON.parse(
          localStorage.getItem("scheduledNotifications") || "[]"
        );
        const filtered = notifications.filter(
          (n: any) => n.id !== notificationId
        );
        localStorage.setItem("scheduledNotifications", JSON.stringify(filtered));
      }, delay);
    }

    toast({
      title: "Notificação agendada!",
      description: `Você receberá um lembrete às ${time}.`,
    });
  };

  const cancelNotification = (type: NotificationType) => {
    const notifications = JSON.parse(
      localStorage.getItem("scheduledNotifications") || "[]"
    );
    const filtered = notifications.filter((n: any) => n.type !== type);
    localStorage.setItem("scheduledNotifications", JSON.stringify(filtered));

    toast({
      title: "Notificação cancelada",
      description: "O lembrete foi removido.",
    });
  };

  const getScheduledNotifications = (type?: NotificationType) => {
    const notifications = JSON.parse(
      localStorage.getItem("scheduledNotifications") || "[]"
    );
    
    if (type) {
      return notifications.filter((n: any) => n.type === type);
    }
    
    return notifications;
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

    // Salva a preferência no localStorage
    localStorage.setItem("recurringReminderInterval", intervalMinutes.toString());

    // Função para agendar o próximo lembrete
    const scheduleNext = () => {
      const nextTime = new Date(Date.now() + intervalMinutes * 60 * 1000);
      
      // Envia para o Service Worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          id: `recurring_${Date.now()}`,
          title: 'Lembrete de Tarefas',
          body: 'Hora de checar sua lista de tarefas! 📝',
          icon: '/placeholder.svg',
          scheduledTime: nextTime.toISOString(),
        });
      } else {
        // Fallback
        const timeoutId = setTimeout(() => {
          if (permission.granted) {
            new Notification("Lembrete de Tarefas", {
              body: "Hora de checar sua lista de tarefas! 📝",
              icon: "/placeholder.svg",
              badge: "/placeholder.svg",
            });
          }

          const currentInterval = localStorage.getItem("recurringReminderInterval");
          if (currentInterval) {
            scheduleNext();
          }
        }, intervalMinutes * 60 * 1000);

        localStorage.setItem("recurringReminderTimeoutId", timeoutId.toString());
      }
    };

    // Cancela qualquer lembrete anterior
    const oldTimeoutId = localStorage.getItem("recurringReminderTimeoutId");
    if (oldTimeoutId) {
      clearTimeout(Number(oldTimeoutId));
    }

    scheduleNext();

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
  };

  const cancelRecurringReminder = () => {
    const timeoutId = localStorage.getItem("recurringReminderTimeoutId");
    if (timeoutId) {
      clearTimeout(Number(timeoutId));
      localStorage.removeItem("recurringReminderTimeoutId");
    }
    localStorage.removeItem("recurringReminderInterval");

    toast({
      title: "Lembretes desativados",
      description: "Os lembretes recorrentes foram cancelados.",
    });
  };

  const getRecurringReminderInterval = (): number | null => {
    const interval = localStorage.getItem("recurringReminderInterval");
    return interval ? Number(interval) : null;
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
