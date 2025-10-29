import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WELCOME_KEY = "flowday-welcome-shown";
const LAST_UPDATE_KEY = "flowday-last-update";
const CURRENT_VERSION = "1.1.2";

interface WelcomeModalProps {
  isLoggedIn?: boolean;
}

const WelcomeModal = ({ isLoggedIn = false }: WelcomeModalProps) => {
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // Para usuários logados, verificar se há atualizações
      const lastVersion = localStorage.getItem(LAST_UPDATE_KEY);
      if (lastVersion !== CURRENT_VERSION) {
        setIsUpdate(true);
        setOpen(true);
      }
    } else {
      // Para novos usuários, mostrar boas-vindas
      const hasSeenWelcome = localStorage.getItem(WELCOME_KEY);
      if (!hasSeenWelcome) {
        setOpen(true);
      }
    }
  }, [isLoggedIn]);

  const handleClose = () => {
    if (isUpdate) {
      localStorage.setItem(LAST_UPDATE_KEY, CURRENT_VERSION);
    } else {
      localStorage.setItem(WELCOME_KEY, "true");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Novidades no Nima! 🎉" : "Bem-vindo ao Nima! 👋"}
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-4">
            {isUpdate ? (
              <>
                <p>Confira as últimas melhorias:</p>
                <ul className="list-disc list-inside space-y-1.5 text-sm">
                  <li><strong>Notificações Android corrigidas:</strong> Agora as notificações funcionam em background no Android graças ao Service Worker</li>
                  <li><strong>Notificações individuais de cafeína:</strong> Ative lembretes para cada horário separadamente</li>
                  <li><strong>Persistência de dados:</strong> Seus cálculos são salvos ao trocar de aba</li>
                  <li><strong>Lembretes de tarefas personalizáveis:</strong> Configure intervalos de 30min, 1h ou 3h</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  O Nima é seu assistente de produtividade e bem-estar, 
                  ajudando você a otimizar seu sono, controlar sua cafeína 
                  e organizar suas tarefas diárias.
                </p>
                <p className="text-sm">
                  Comece sua jornada para dias mais produtivos e equilibrados! ✨
                </p>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleClose}>
            {isUpdate ? "Entendi!" : "Começar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
