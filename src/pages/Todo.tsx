import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ListTodo, Plus, Archive } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";
import { useTodoManager } from "@/hooks";
import { TodoService } from "@/services/todo.service";
import { TaskList, ArchivedTasksModal, TaskMethodInfo } from "@/components/features/todo";

/**
 * Página principal do Todo
 * Gerencia diferentes métodos de produtividade
 */
const Todo = () => {
  const {
    method,
    tasks,
    archivedTasks,
    newTask,
    setMethod,
    setNewTask,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskCategory,
    archiveCompletedTasks,
    deleteArchivedTask,
    restoreArchivedTask,
    reorderTasks,
  } = useTodoManager();

  const [showArchived, setShowArchived] = useState(false);
  const currentMethod = TodoService.getMethodInfo(method);

  const handleMethodChange = (value: string) => {
    setMethod(value as any);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <ListTodo className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-todo))]" />
          <div>
            <div className="flex items-center">
              <h1 className="text-xl md:text-3xl font-semibold">To-Do</h1>
              <InfoPopup
                title="Métodos de Produtividade"
                content="Cada método tem sua filosofia. O Ivy Lee foca em priorização rigorosa, o 1-3-5 equilibra volume, o Eat Frog destaca a tarefa mais difícil, e o Eisenhower separa urgente do importante."
                sources={[
                  {
                    label: "The Muse - Productivity Methods",
                    url: "https://www.themuse.com/advice/a-better-todo-list-the-135-rule",
                  },
                  {
                    label: "James Clear - Ivy Lee Method",
                    url: "https://jamesclear.com/ivy-lee",
                  },
                ]}
              />
            </div>
            <p className="text-muted-foreground text-xs md:text-sm">
              Escolha um método e experimente por 21 dias
            </p>
          </div>
        </div>
      </div>

      <Tabs value={method} onValueChange={handleMethodChange}>
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="ivy-lee" className="text-xs md:text-sm">Ivy Lee</TabsTrigger>
          <TabsTrigger value="1-3-5" className="text-xs md:text-sm">1-3-5</TabsTrigger>
          <TabsTrigger value="eat-frog" className="text-xs md:text-sm">Eat Frog</TabsTrigger>
          <TabsTrigger value="eisenhower" className="text-xs md:text-sm">Eisenhower</TabsTrigger>
        </TabsList>

        <TaskMethodInfo method={method} />

        <Card className="p-6 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            <Button onClick={addTask} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-muted-foreground">
              {tasks.length} de {currentMethod.maxTasks} tarefas
            </div>
            <div className="flex gap-2">
              {tasks.some(task => task.completed) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={archiveCompletedTasks}
                  title="Arquivar concluídas"
                  className="text-muted-foreground hover:text-foreground text-xs gap-1.5"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Arquivar</span>
                </Button>
              )}
              <ArchivedTasksModal
                open={showArchived}
                onOpenChange={setShowArchived}
                archivedTasks={archivedTasks}
                onRestore={restoreArchivedTask}
                onDelete={deleteArchivedTask}
              />
            </div>
          </div>
        </Card>

        <TaskList
          tasks={tasks}
          method={method}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onCategoryChange={updateTaskCategory}
          onReorder={reorderTasks}
        />
      </Tabs>
    </div>
  );
};

export default Todo;
