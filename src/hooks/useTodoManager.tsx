import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { syncService } from "@/services/sync.service";
import { TodoService } from "@/services/todo.service";
import { Task, TodoMethod, todoDataSchema } from "@/schemas/todo.schemas";
import { z } from "zod";
import { STORAGE_KEYS } from "@/config/constants";

const STORAGE_KEY = STORAGE_KEYS.TODO_DATA;

/**
 * Hook customizado para gerenciar toda lógica do Todo
 */
export const useTodoManager = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState<TodoMethod>("ivy-lee");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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
      const dataToSave = TodoService.normalizeForSave(method, tasks, archivedTasks);
      const validated = todoDataSchema.parse(dataToSave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Erro de validação Zod:", error.errors);
        console.error("Dados que falharam:", JSON.stringify({ method, tasks, archivedTasks }, null, 2));
      } else {
        console.error("Erro ao salvar tarefas:", error);
      }
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

  /**
   * Adiciona uma nova tarefa
   */
  const addTask = useCallback(() => {
    const validation = TodoService.validateTaskLength(newTask);
    
    if (!validation.isValid) {
      if (validation.length === 0) return;
      toast.error(`Tarefa muito longa (máximo ${validation.maxLength} caracteres)`);
      return;
    }
    
    const { canAdd, maxTasks } = TodoService.canAddTask(tasks.length, method);
    
    if (!canAdd) {
      toast.error(`Máximo de ${maxTasks} tarefas para este método`);
      return;
    }

    const task = TodoService.createTask(newTask, tasks.length + 1);
    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("Tarefa adicionada");
  }, [newTask, tasks, method]);

  /**
   * Alterna o estado de conclusão de uma tarefa
   */
  const toggleTask = useCallback((id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, [tasks]);

  /**
   * Remove uma tarefa da lista ativa
   */
  const deleteTask = useCallback((id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast("Tarefa removida");
  }, [tasks]);

  /**
   * Atualiza a categoria de uma tarefa (Eisenhower)
   */
  const updateTaskCategory = useCallback((id: string, category: Task["category"]) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, category } : task
    ));
  }, [tasks]);

  /**
   * Arquiva todas as tarefas concluídas
   */
  const archiveCompletedTasks = useCallback(() => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) {
      toast.error("Nenhuma tarefa concluída para arquivar");
      return;
    }
    
    setArchivedTasks([...archivedTasks, ...completedTasks]);
    setTasks(tasks.filter(task => !task.completed));
    toast.success(`${completedTasks.length} tarefa(s) arquivada(s)`);
  }, [tasks, archivedTasks]);

  /**
   * Remove uma tarefa arquivada permanentemente
   */
  const deleteArchivedTask = useCallback((id: string) => {
    setArchivedTasks(archivedTasks.filter(task => task.id !== id));
    toast("Tarefa removida definitivamente");
  }, [archivedTasks]);

  /**
   * Restaura uma tarefa arquivada para a lista ativa
   */
  const restoreArchivedTask = useCallback((id: string) => {
    const taskToRestore = archivedTasks.find(task => task.id === id);
    if (!taskToRestore) return;

    const { canAdd, maxTasks } = TodoService.canAddTask(tasks.length, method);
    
    if (!canAdd) {
      toast.error(`Máximo de ${maxTasks} tarefas atingido. Remova uma tarefa antes de restaurar.`);
      return;
    }

    setTasks([...tasks, { ...taskToRestore, completed: false, archived: false }]);
    setArchivedTasks(archivedTasks.filter(task => task.id !== id));
    toast.success("Tarefa restaurada");
  }, [archivedTasks, tasks, method]);

  /**
   * Reordena as tarefas após drag-and-drop
   */
  const reorderTasks = useCallback((newTasks: Task[]) => {
    const tasksWithPriority = newTasks.map((task, i) => ({ ...task, priority: i + 1 }));
    setTasks(tasksWithPriority);
  }, []);

  return {
    // State
    method,
    tasks,
    archivedTasks,
    newTask,
    isLoaded,
    
    // Setters
    setMethod,
    setNewTask,
    
    // Actions
    addTask,
    toggleTask,
    deleteTask,
    updateTaskCategory,
    archiveCompletedTasks,
    deleteArchivedTask,
    restoreArchivedTask,
    reorderTasks,
  };
};
