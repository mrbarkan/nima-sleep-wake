import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChangelogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const changelog = [
  {
    version: "0.9.0.104",
    date: "2025-01-29",
    changes: [
      "Calculadora de sono: ordem corrigida no modo 'hora que estou indo dormir'",
      "Botão de teste de notificações adicionado",
      "Modal de changelog implementado",
    ],
  },
  {
    version: "0.9.0.103",
    date: "2025-01-28",
    changes: [
      "Notificações Android corrigidas com Service Worker",
      "Notificações individuais de cafeína implementadas",
      "Persistência de dados ao trocar de aba",
      "Lembretes de tarefas personalizáveis (30min, 1h, 3h)",
    ],
  },
  {
    version: "0.9.0.100",
    date: "2025-01-20",
    changes: [
      "Lançamento inicial do Nima",
      "Calculadora de sono inteligente",
      "Gerenciador de cafeína",
      "Lista de tarefas com lembretes",
      "Sistema de notificações",
      "Autenticação de usuários",
    ],
  },
];

export const ChangelogModal = ({ open, onOpenChange }: ChangelogModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Histórico de Atualizações 📋</DialogTitle>
          <DialogDescription>
            Todas as mudanças e melhorias do Nima
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {changelog.map((entry, index) => (
              <div key={entry.version}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">v{entry.version}</h3>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="text-muted-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
                {index < changelog.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
