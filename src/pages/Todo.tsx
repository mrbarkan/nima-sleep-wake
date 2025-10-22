import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Trash2, Plus, Info } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Schema de validação para garantir segurança dos dados
const taskSchema = z.object({
  id: z.string().max(50),
  text: z.string().trim().min(1).max(500),
  completed: z.boolean(),
  priority: z.number().optional(),
  category: z.string().max(100).optional(),
});

const todoDataSchema = z.object({
  method: z.enum(["ivy-lee", "1-3-5", "eat-frog", "eisenhower"]),
  tasks: z.array(taskSchema).max(20),
});

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: number;
  category?: string;
}

const STORAGE_KEY = "sleepflow-todo-data";

const Todo = () => {
  const [method, setMethod] = useState("ivy-lee");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const validated = todoDataSchema.parse(parsed);
        setMethod(validated.method);
        setTasks(validated.tasks as Task[]);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      // Se houver erro de validação, limpa os dados corrompidos
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (!isLoaded) return; // Não salvar durante o carregamento inicial
    
    try {
      const dataToSave = { method, tasks };
      const validated = todoDataSchema.parse(dataToSave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.error("Erro ao salvar tarefas:", error);
      toast.error("Erro ao salvar tarefas");
    }
  }, [method, tasks, isLoaded]);

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

  const movePriority = (id: string, direction: "up" | "down") => {
    const index = tasks.findIndex(t => t.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === tasks.length - 1)
    )
      return;

    const newTasks = [...tasks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newTasks[index], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[index]];
    
    setTasks(newTasks.map((task, i) => ({ ...task, priority: i + 1 })));
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-semibold">Sistema To-Do</h1>
        </div>
        <p className="text-muted-foreground">
          Escolha um método e experimente por pelo menos 21 dias
        </p>
      </div>

      <Tabs value={method} onValueChange={(v) => { setMethod(v); setTasks([]); }}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="ivy-lee">Ivy Lee</TabsTrigger>
          <TabsTrigger value="1-3-5">1-3-5</TabsTrigger>
          <TabsTrigger value="eat-frog">Eat Frog</TabsTrigger>
          <TabsTrigger value="eisenhower">Eisenhower</TabsTrigger>
        </TabsList>

        <Card className="p-6 mb-6 bg-accent/5 border-accent/20">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">{currentMethod.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {currentMethod.description}
              </p>
              <p className="text-xs text-muted-foreground italic">
                💡 {currentMethod.tip}
              </p>
            </div>
          </div>
        </Card>

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
          <div className="text-xs text-muted-foreground mt-2">
            {tasks.length} de {currentMethod.maxTasks} tarefas
          </div>
        </Card>

        <div className="space-y-2">
          {tasks.map((task, index) => (
            <Card
              key={task.id}
              className={`p-4 transition-all ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1">
                  <div className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.text}
                  </div>
                </div>
                <div className="flex gap-1">
                  {method === "ivy-lee" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriority(task.id, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePriority(task.id, "down")}
                        disabled={index === tasks.length - 1}
                      >
                        ↓
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
