import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Trash2, Plus, Info, GripVertical, Archive, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { syncService } from "@/services/sync.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import InfoPopup from "@/components/common/InfoPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Schema de validação para garantir segurança dos dados
const taskSchema = z.object({
  id: z.string().max(50),
  text: z.string().trim().min(1).max(500),
  completed: z.boolean(),
  archived: z.boolean().optional(),
  priority: z.number().optional(),
  category: z.string().max(100).optional(),
});

const todoDataSchema = z.object({
  method: z.enum(["ivy-lee", "1-3-5", "eat-frog", "eisenhower"]),
  tasks: z.array(taskSchema).max(20),
  archivedTasks: z.array(taskSchema).max(100).optional(),
});

interface Task {
  id: string;
  text: string;
  completed: boolean;
  archived?: boolean;
  priority?: number;
  category?: "urgent-important" | "urgent-not" | "not-urgent-important" | "not-urgent-not";
}

interface SortableTaskItemProps {
  task: Task;
  index: number;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  method: string;
  totalTasks: number;
  updateTaskCategory: (id: string, category: Task["category"]) => void;
}

const SortableTaskItem = ({ task, index, toggleTask, deleteTask, method, totalTasks, updateTaskCategory }: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.5 : 1,
    willChange: 'transform',
  };

  // Calculate color based on method and priority
  const getTaskColor = () => {
    if (method === "ivy-lee") {
      return `hsl(var(--todo-ivy-${index + 1}))`;
    } else if (method === "1-3-5") {
      if (index === 0) return "hsl(var(--todo-135-big))";
      if (index <= 3) return "hsl(var(--todo-135-medium))";
      return "hsl(var(--todo-135-small))";
    } else if (method === "eat-frog") {
      return `hsl(var(--todo-frog-${index + 1}))`;
    } else if (method === "eisenhower" && task.category) {
      return `hsl(var(--todo-eisenhower-${task.category}))`;
    }
    return "transparent";
  };

  const categoryLabels = {
    "urgent-important": "Urgente e Importante",
    "urgent-not": "Urgente, não Importante",
    "not-urgent-important": "Importante, não Urgente",
    "not-urgent-not": "Não Urgente, não Importante",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${
        task.completed ? "opacity-60" : ""
      } ${isDragging ? "cursor-grabbing shadow-lg scale-105" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing touch-none"
          style={{ touchAction: "none" }}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div 
          className="w-1 h-12 rounded-full transition-colors flex-shrink-0"
          style={{ backgroundColor: getTaskColor() }}
        />
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
        />
        <div className="flex-1 min-w-0">
          <div className={task.completed ? "line-through text-muted-foreground" : ""}>
            {task.text}
          </div>
          {method === "eisenhower" && (
            <Select
              value={task.category}
              onValueChange={(value) => updateTaskCategory(task.id, value as Task["category"])}
            >
              <SelectTrigger className="w-full mt-2 h-8 text-xs">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent-important">
                  {categoryLabels["urgent-important"]}
                </SelectItem>
                <SelectItem value="urgent-not">
                  {categoryLabels["urgent-not"]}
                </SelectItem>
                <SelectItem value="not-urgent-important">
                  {categoryLabels["not-urgent-important"]}
                </SelectItem>
                <SelectItem value="not-urgent-not">
                  {categoryLabels["not-urgent-not"]}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

const STORAGE_KEY = "sleepflow-todo-data";

const Todo = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState("ivy-lee");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Load data from backend when user logs in
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // Load from localStorage for non-logged users
        try {
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            const validated = todoDataSchema.parse(parsed);
            setMethod(validated.method);
            setTasks(validated.tasks as Task[]);
            setArchivedTasks((validated.archivedTasks as Task[]) || []);
          }
        } catch (error) {
          console.error("Erro ao carregar tarefas:", error);
          localStorage.removeItem(STORAGE_KEY);
        } finally {
          setIsLoaded(true);
        }
        return;
      }

      // For logged users, try to load from backend
      try {
        // First, attempt data migration
        await syncService.migrateLocalStorageData();
        
        // Then load from backend
        const backendTasks = await syncService.loadTasks();
        
        if (backendTasks && backendTasks.length > 0) {
          // Separate active and archived tasks
          const active = backendTasks.filter((t: Task) => !t.archived);
          const archived = backendTasks.filter((t: Task) => t.archived);
          setTasks(active);
          setArchivedTasks(archived);
        } else {
          // If no backend data, load from localStorage
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            const validated = todoDataSchema.parse(parsed);
            setMethod(validated.method);
            setTasks(validated.tasks as Task[]);
            setArchivedTasks((validated.archivedTasks as Task[]) || []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [user]);

  // Sync data to backend when it changes (for logged users)
  const syncToBackend = useCallback(async () => {
    if (!user || !isLoaded) return;
    
    const allTasks = [...tasks, ...archivedTasks.map(t => ({ ...t, archived: true }))];
    await syncService.syncTasks(allTasks, 'todo');
  }, [user, tasks, archivedTasks, isLoaded]);

  // Save to localStorage (for non-logged users) and sync to backend (for logged users)
  useEffect(() => {
    if (!isLoaded) return;
    
    // Always save to localStorage for offline-first approach
    try {
      const dataToSave = { method, tasks, archivedTasks };
      const validated = todoDataSchema.parse(dataToSave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.error("Erro ao salvar tarefas:", error);
      toast.error("Erro ao salvar tarefas");
    }

    // Sync to backend if user is logged in
    syncToBackend();
  }, [method, tasks, archivedTasks, isLoaded, syncToBackend]);

  // Periodic sync (every 30 seconds)
  useEffect(() => {
    if (!user || !isLoaded) return;

    const interval = setInterval(() => {
      syncToBackend();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, isLoaded, syncToBackend]);

  const methodInfo = {
    "ivy-lee": {
      name: "Método Ivy Lee",
      description: "Escolha 6 tarefas, priorize-as e execute na ordem. Faça apenas o que conseguir completar.",
      maxTasks: 6,
      tip: "Criado há 100 anos, ainda é um dos métodos mais eficazes. Foque em completar, não em começar.",
    },
    "1-3-5": {
      name: "Regra 1-3-5",
      description: "1 tarefa grande, 3 médias e 5 pequenas. Total de 9 tarefas balanceadas.",
      maxTasks: 9,
      tip: "Equilibra ambição com realismo. A tarefa grande é sua prioridade máxima do dia.",
    },
    "eat-frog": {
      name: "Eat That Frog",
      description: "Identifique sua tarefa mais difícil e faça-a primeiro. As outras ficam mais fáceis.",
      maxTasks: 6,
      tip: "Se tem que comer um sapo, faça isso logo pela manhã. Se tem dois, coma o maior primeiro.",
    },
    "eisenhower": {
      name: "Matriz Eisenhower",
      description: "Organize tarefas por urgente/importante. Foque no importante, não apenas no urgente.",
      maxTasks: 12,
      tip: "Urgente vs Importante é a chave. O importante constrói seu futuro, o urgente apenas apaga incêndios.",
    },
  };

  const currentMethod = methodInfo[method as keyof typeof methodInfo];

  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) return;
    
    // Validação de tamanho
    if (trimmedTask.length > 500) {
      toast.error("Tarefa muito longa (máximo 500 caracteres)");
      return;
    }
    
    if (tasks.length >= currentMethod.maxTasks) {
      toast.error(`Máximo de ${currentMethod.maxTasks} tarefas para este método`);
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      text: trimmedTask,
      completed: false,
      priority: tasks.length + 1,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("Tarefa adicionada");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast("Tarefa removida");
  };

  const updateTaskCategory = (id: string, category: Task["category"]) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, category } : task
    ));
  };

  const archiveCompletedTasks = () => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) {
      toast.error("Nenhuma tarefa concluída para arquivar");
      return;
    }
    
    setArchivedTasks([...archivedTasks, ...completedTasks]);
    setTasks(tasks.filter(task => !task.completed));
    toast.success(`${completedTasks.length} tarefa(s) arquivada(s)`);
  };

  const deleteArchivedTask = (id: string) => {
    setArchivedTasks(archivedTasks.filter(task => task.id !== id));
    toast("Tarefa removida definitivamente");
  };

  const restoreArchivedTask = (id: string) => {
    const taskToRestore = archivedTasks.find(task => task.id === id);
    if (!taskToRestore) return;

    if (tasks.length >= currentMethod.maxTasks) {
      toast.error(`Máximo de ${currentMethod.maxTasks} tarefas atingido. Remova uma tarefa antes de restaurar.`);
      return;
    }

    setTasks([...tasks, { ...taskToRestore, completed: false }]);
    setArchivedTasks(archivedTasks.filter(task => task.id !== id));
    toast.success("Tarefa restaurada");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newTasks = arrayMove(items, oldIndex, newIndex);
        return newTasks.map((task, i) => ({ ...task, priority: i + 1 }));
      });
    }
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

      <Tabs value={method} onValueChange={setMethod}>
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="ivy-lee" className="text-xs md:text-sm">Ivy Lee</TabsTrigger>
          <TabsTrigger value="1-3-5" className="text-xs md:text-sm">1-3-5</TabsTrigger>
          <TabsTrigger value="eat-frog" className="text-xs md:text-sm">Eat Frog</TabsTrigger>
          <TabsTrigger value="eisenhower" className="text-xs md:text-sm">Eisenhower</TabsTrigger>
        </TabsList>

        <div className="mb-6 flex items-center gap-2">
          <h3 className="font-medium">{currentMethod.name}</h3>
          <InfoPopup
            title={currentMethod.name}
            content={`${currentMethod.description}\n\n💡 ${currentMethod.tip}`}
          />
        </div>

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
              <Dialog open={showArchived} onOpenChange={setShowArchived}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Archive className="h-3 w-3 mr-1" />
                    Arquivadas ({archivedTasks.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
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
                          <Card key={task.id} className="p-4">
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
                                  onClick={() => restoreArchivedTask(task.id)}
                                  title="Restaurar tarefa"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteArchivedTask(task.id)}
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
            </div>
          </div>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  method={method}
                  totalTasks={tasks.length}
                  updateTaskCategory={updateTaskCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {tasks.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            <p>Adicione sua primeira tarefa para começar</p>
          </Card>
        )}
      </Tabs>
    </div>
  );
};

export default Todo;
