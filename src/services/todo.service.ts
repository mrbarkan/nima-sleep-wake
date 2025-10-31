import { Task, TodoMethod, taskSchema, todoDataSchema } from "@/schemas/todo.schemas";
import { z } from "zod";

/**
 * Configuração dos métodos de produtividade
 */
export const METHOD_INFO = {
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
} as const;

/**
 * Labels para as categorias da Matriz Eisenhower
 */
export const CATEGORY_LABELS = {
  "urgent-important": "Urgente e Importante",
  "urgent-not": "Urgente, não Importante",
  "not-urgent-important": "Importante, não Urgente",
  "not-urgent-not": "Não Urgente, não Importante",
} as const;

/**
 * Service para lógica de negócio do Todo
 */
export class TodoService {
  /**
   * Valida uma tarefa usando o schema Zod
   */
  static validateTask(task: unknown): Task {
    return taskSchema.parse(task);
  }

  /**
   * Valida um conjunto completo de dados do Todo
   */
  static validateTodoData(data: unknown) {
    return todoDataSchema.parse(data);
  }

  /**
   * Retorna a cor apropriada para uma tarefa baseada no método e índice
   */
  static getTaskColor(method: TodoMethod, index: number, category?: Task["category"]): string {
    if (method === "ivy-lee") {
      return `hsl(var(--todo-ivy-${index + 1}))`;
    } else if (method === "1-3-5") {
      if (index === 0) return "hsl(var(--todo-135-big))";
      if (index <= 3) return "hsl(var(--todo-135-medium))";
      return "hsl(var(--todo-135-small))";
    } else if (method === "eat-frog") {
      return `hsl(var(--todo-frog-${index + 1}))`;
    } else if (method === "eisenhower" && category) {
      return `hsl(var(--todo-eisenhower-${category}))`;
    }
    return "transparent";
  }

  /**
   * Verifica se pode adicionar uma nova tarefa
   */
  static canAddTask(currentCount: number, method: TodoMethod): { canAdd: boolean; maxTasks: number } {
    const maxTasks = METHOD_INFO[method].maxTasks;
    return {
      canAdd: currentCount < maxTasks,
      maxTasks,
    };
  }

  /**
   * Valida o tamanho de uma tarefa
   */
  static validateTaskLength(text: string): { isValid: boolean; length: number; maxLength: number } {
    const maxLength = 500;
    const trimmed = text.trim();
    return {
      isValid: trimmed.length > 0 && trimmed.length <= maxLength,
      length: trimmed.length,
      maxLength,
    };
  }

  /**
   * Cria uma nova tarefa com valores padrão
   */
  static createTask(text: string, priority: number): Task {
    return {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      priority,
    };
  }

  /**
   * Normaliza dados antes de salvar (garante propriedade archived)
   */
  static normalizeForSave(method: TodoMethod, tasks: Task[], archivedTasks: Task[]) {
    return {
      method,
      tasks: tasks.map(t => ({ ...t, archived: false })),
      archivedTasks: archivedTasks.map(t => ({ ...t, archived: true })),
    };
  }

  /**
   * Retorna informações sobre um método específico
   */
  static getMethodInfo(method: TodoMethod) {
    return METHOD_INFO[method];
  }
}
