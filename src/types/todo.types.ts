/**
 * Todo-related type definitions
 */

export type TodoMethod = "ivy-lee" | "1-3-5" | "eat-frog" | "eisenhower";

export type TaskCategory = 
  | "urgent-important" 
  | "urgent-not" 
  | "not-urgent-important" 
  | "not-urgent-not";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: number;
  category?: TaskCategory;
}

export interface TodoMethodInfo {
  name: string;
  description: string;
  maxTasks: number;
  tip: string;
}

export interface TodoState {
  method: TodoMethod;
  tasks: Task[];
}

export interface TodoData {
  method: TodoMethod;
  tasks: Task[];
}
