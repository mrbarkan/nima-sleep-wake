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
const CURRENT_VERSION = "1.0.0"; // Atualize isso quando houver mudanças importantes

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
                  <li>Nova paleta de cores</li>
                  <li>Interface otimizada para mobile</li>
                  <li>Melhorias de navegação</li>
                </ul>
              </>
            ) : (
              <>
                <p>
                  O Nima é seu assistente de produtividade e bem-estar, 
                  combinando ferramentas para melhorar seu sono, gerenciar 
                  cafeína, organizar tarefas e relaxar.
                </p>
                <p className="text-sm">
                  Explore as funcionalidades e comece sua jornada para dias 
                  mais produtivos e equilibrados! ✨
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
