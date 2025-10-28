import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export type NotificationType = "sleep" | "wake" | "caffeine";

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

    const delay = scheduledTime.getTime() - now.getTime();

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

    // Agenda a notificação
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

  return {
    permission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    getScheduledNotifications,
  };
};
