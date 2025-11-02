import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TodoMethod } from "@/schemas/todo.schemas";
import { TodoService, CATEGORY_LABELS } from "@/services/todo.service";

interface TaskItemProps {
  task: Task;
  index: number;
  method: TodoMethod;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Task["category"]) => void;
}

/**
 * Componente individual de tarefa com suporte a drag-and-drop
 */
export const TaskItem = ({ task, index, method, onToggle, onDelete, onCategoryChange }: TaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform) ? `${CSS.Transform.toString(transform)} translateZ(0)` : undefined,
    transition: transition || 'transform 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)',
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const taskColor = TodoService.getTaskColor(method, index, task.category);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${task.completed ? "opacity-60" : ""} transition-all duration-200`}
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
          className="w-1 h-12 rounded-full transition-colors duration-300 ease-out flex-shrink-0"
          style={{ backgroundColor: taskColor }}
        />
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <div className="flex-1 min-w-0">
          <div className={task.completed ? "line-through text-muted-foreground" : ""}>
            {task.text}
          </div>
          {method === "eisenhower" && (
            <Select
              value={task.category}
              onValueChange={(value) => onCategoryChange(task.id, value as Task["category"])}
            >
              <SelectTrigger className="w-full mt-2 h-8 text-xs">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent-important">
                  {CATEGORY_LABELS["urgent-important"]}
                </SelectItem>
                <SelectItem value="urgent-not">
                  {CATEGORY_LABELS["urgent-not"]}
                </SelectItem>
                <SelectItem value="not-urgent-important">
                  {CATEGORY_LABELS["not-urgent-important"]}
                </SelectItem>
                <SelectItem value="not-urgent-not">
                  {CATEGORY_LABELS["not-urgent-not"]}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
