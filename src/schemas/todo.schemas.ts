import { z } from "zod";

/**
 * Schema de validação para uma tarefa individual
 */
export const taskSchema = z.object({
  id: z.string().max(50),
  text: z.string().trim().min(1).max(500),
  completed: z.boolean(),
  archived: z.boolean().default(false),
  priority: z.number().default(1),
  category: z.string().max(100).optional(),
});

/**
 * Schema de validação para o conjunto completo de dados do Todo
 */
export const todoDataSchema = z.object({
  method: z.enum(["ivy-lee", "1-3-5", "eat-frog", "eisenhower"]),
  tasks: z.array(taskSchema).max(20),
  archivedTasks: z.array(taskSchema).max(100).optional(),
});

/**
 * Type inference a partir dos schemas
 */
export type Task = z.infer<typeof taskSchema>;
export type TodoData = z.infer<typeof todoDataSchema>;
export type TodoMethod = TodoData["method"];
export type TaskCategory = "urgent-important" | "urgent-not" | "not-urgent-important" | "not-urgent-not";
