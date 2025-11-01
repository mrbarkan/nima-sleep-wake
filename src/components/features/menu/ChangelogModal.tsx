import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { APP_VERSION } from "@/config/constants";

interface ChangelogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const changelog = [
  {
    version: "0.13.0",
    date: "2025-01-30",
    changes: [
      "🔧 Refatoração de Hooks - Eliminação de Duplicação (Fase 3)",
      "Criado hook genérico usePersistence para localStorage + sync",
      "Criado hook useMultiPersistence para múltiplos valores relacionados",
      "useSleepCalculator refatorado: separação entre cálculo e persistência",
      "useCaffeineScheduler refatorado: lógica de negócio isolada",
      "Eliminação de ~100 linhas duplicadas entre hooks",
      "Pattern reutilizável para futuros recursos com persistência",
      "Melhor separação de responsabilidades (SRP)",
    ],
  },
  {
    version: "0.12.0",
    date: "2025-01-30",
    changes: [
      "🏗️ Refatoração completa de Sleep, Caffeine e Blog (Fase 2)",
      "Criadas features folders para cada módulo principal",
      "Sleep: componentes SleepHeader, SleepTimeInput, SleepResultsList (163→41 linhas)",
      "Caffeine: componentes CaffeineHeader, CaffeineTimeInput, CaffeineScheduleList (146→36 linhas)",
      "Blog: componentes BlogHeader, ArticleCard, ArticleList (177→99 linhas)",
      "Arquitetura consistente com separação clara de responsabilidades",
      "Melhoria significativa na reutilização de componentes",
      "Redução de 280+ linhas de código total nas páginas",
    ],
  },
  {
    version: "0.11.0",
    date: "2025-01-30",
    changes: [
      "🏗️ Refatoração completa do módulo Todo (Fase 1)",
      "Criada camada de schemas (src/schemas/todo.schemas.ts) para validações",
      "Criado TodoService com toda lógica de negócio centralizada",
      "Implementado hook customizado useTodoManager para gestão de estado",
      "Componentes modulares: TaskItem, TaskList, ArchivedTasksModal, TaskMethodInfo",
      "Redução de 615 → 135 linhas no Todo.tsx (78% menos código)",
      "Arquitetura limpa com separação de responsabilidades",
      "Melhor testabilidade e manutenibilidade do código",
    ],
  },
  {
    version: "0.10.2",
    date: "2025-01-30",
    changes: [
      "Corrigido erro de validação ao salvar tarefas (propriedade archived)",
      "Melhorado logging de erros para facilitar debugging",
      "Garantida consistência de estado entre tarefas ativas e arquivadas",
    ],
  },
  {
    version: "0.10.1",
    date: "2025-01-30",
    changes: [
      "Corrigido erro de validação ao salvar tarefas",
      "Corrigida inconsistência no nome do método Eat That Frog",
      "Melhorias na estabilidade da sincronização",
    ],
  },
  {
    version: APP_VERSION,
    date: "2025-01-30",
    changes: [
      "🔄 Sincronização multi-dispositivo implementada!",
      "📱 Dados sincronizam automaticamente entre desktop e mobile",
      "☁️ Backend integrado para persistência na nuvem",
      "📊 Sincronização de tarefas (Todo), preferências de sono e configurações de cafeína",
      "🔐 Sistema seguro com RLS policies para proteção de dados",
      "💾 Estratégia offline-first: dados salvos localmente primeiro, depois sincronizados",
      "🔄 Sincronização periódica automática a cada 30 segundos",
      "📤 Migração automática de dados do localStorage para o backend",
      "👁️ Indicador visual de status de sincronização no header",
      "⚡ Performance otimizada com polling inteligente",
    ],
  },
  {
    version: "0.9.1.2",
    date: "2025-01-30",
    changes: [
      "Drag and drop super otimizado - animações fluídas com hardware acceleration",
      "Botão de arquivar mais discreto e com label no desktop",
      "Performance melhorada no mobile ao arrastar tarefas",
      "Corrigido z-index do modal de login no desktop",
    ],
  },
  {
    version: "0.9.0.109",
    date: "2025-01-30",
    changes: [
      "Corrigido sistema de notificações recorrentes que não estava funcionando após reload",
      "Implementada inicialização assíncrona do serviço de notificações",
      "Service Worker agora aguarda registro completo antes de restaurar notificações",
      "Melhorado tratamento de erros e logs de debug para notificações",
      "Sistema de verificação de prontidão do serviço implementado",
    ],
  },
  {
    version: "0.9.0.108",
    date: "2025-01-30",
    changes: [
      "Sistema de arquivamento de tarefas concluídas implementado",
      "Botão para arquivar todas as tarefas concluídas de uma vez",
      "Modal de tarefas arquivadas com visualização completa",
      "Opção de restaurar tarefas arquivadas (desmarca como concluída)",
      "Opção de deletar permanentemente tarefas arquivadas",
      "Contador de tarefas arquivadas no botão de acesso",
      "Persistência de tarefas arquivadas no localStorage",
      "Limite de 100 tarefas arquivadas para otimização",
    ],
  },
  {
    version: "0.9.0.107",
    date: "2025-01-30",
    changes: [
      "Botão de teste de notificação corrigido para exibir notificação imediata",
      "Sistema de persistência de notificações agendadas implementado",
      "Restauração automática de notificações após recarregar página",
      "Restauração automática de lembretes recorrentes configurados",
      "Melhorias na confiabilidade do serviço de notificações",
    ],
  },
  {
    version: "0.9.0.106",
    date: "2025-01-30",
    changes: [
      "Sistema de tipos TypeScript centralizado (sleep, caffeine, todo, auth, notifications)",
      "Implementação do AuthContext para gerenciamento de autenticação",
      "Hooks customizados: useSleepCalculator e useCaffeineScheduler",
      "Serviços especializados: sleep, caffeine, notifications, blog, suggestions, storage",
      "Separação completa de lógica de negócio em camada de serviços",
      "Arquitetura modular e escalável finalizada",
      "Redução de 50%+ nas linhas de código dos componentes",
    ],
  },
  {
    version: "0.9.0.105",
    date: "2025-01-30",
    changes: [
      "Refatoração completa da arquitetura do código",
      "Criação de camada de serviços para operações de backend",
      "Reorganização de componentes por domínio (layout, features, common)",
      "Centralização de constantes e rotas em arquivos de configuração",
      "Melhoria na manutenibilidade e escalabilidade do código",
    ],
  },
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
