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
const CURRENT_VERSION = "1.1.1"; // Atualize isso quando houver mudanças importantes

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
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Interface mais limpa nas notificações de cafeína</li>
                  <li>Clique na caixa de horário para expandir/recolher notificações</li>
                  <li>Persistência de cálculos ao navegar entre abas</li>
                  <li>Melhorias na experiência de uso</li>
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
