import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { Task } from "@/schemas/todo.schemas";

interface ArchivedTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archivedTasks: Task[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Modal para visualizar e gerenciar tarefas arquivadas
 */
export const ArchivedTasksModal = ({ 
  open, 
  onOpenChange, 
  archivedTasks, 
  onRestore, 
  onDelete 
}: ArchivedTasksModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Archive className="h-3 w-3 mr-1" />
          Arquivadas ({archivedTasks.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] m-4">
        <DialogHeader>
          <DialogTitle>Tarefas Arquivadas</DialogTitle>
          <DialogDescription>
            Gerencie suas tarefas arquivadas. Você pode restaurá-las ou deletá-las permanentemente.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {archivedTasks.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Archive className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma tarefa arquivada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {archivedTasks.map((task) => (
                <Card key={task.id} className="p-3 md:p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="line-through text-muted-foreground">
                        {task.text}
                      </div>
                      {task.category && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Categoria: {task.category}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRestore(task.id)}
                        title="Restaurar tarefa"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(task.id)}
                        title="Deletar permanentemente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
