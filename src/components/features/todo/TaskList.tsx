import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { TaskItem } from "./TaskItem";
import { Task, TodoMethod } from "@/schemas/todo.schemas";
import { haptics } from "@/lib/haptics";
import { TodoService } from "@/services/todo.service";
import { GripVertical, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskListProps {
  tasks: Task[];
  method: TodoMethod;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Task["category"]) => void;
  onReorder: (tasks: Task[]) => void;
}

/**
 * Lista de tarefas com funcionalidade de drag-and-drop
 */
export const TaskList = ({ tasks, method, onToggle, onDelete, onCategoryChange, onReorder }: TaskListProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Custom drop animation with spring physics (iOS-style)
  const dropAnimation: DropAnimation = {
    duration: 250,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)', // Spring bounce effect
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    haptics.light(); // Light haptic feedback on drag start
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);

    if (!over || active.id === over.id) return;

    haptics.medium(); // Medium haptic feedback on drop

    const oldIndex = tasks.findIndex((item) => item.id === active.id);
    const newIndex = tasks.findIndex((item) => item.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      onReorder(newTasks);
      haptics.success(); // Success haptic feedback after reorder
    }
  };

  const activeTask = tasks.find((task) => task.id === activeId);
  const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
  const activeTaskColor = activeTask && activeTaskIndex !== -1 
    ? TodoService.getTaskColor(method, activeTaskIndex, activeTask.category)
    : 'hsl(var(--primary))';

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <p>Adicione sua primeira tarefa para começar</p>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2" style={{ touchAction: 'none' }}>
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              method={method}
              onToggle={onToggle}
              onDelete={onDelete}
              onCategoryChange={onCategoryChange}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <Card className="p-4 shadow-2xl backdrop-blur-2xl bg-background/40 will-change-[filter,transform,opacity] [backface-visibility:hidden] animate-drag-blur-in">
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <div 
                className="w-1 h-12 rounded-full transition-colors flex-shrink-0" 
                style={{ backgroundColor: activeTaskColor }} 
              />
              <Checkbox
                checked={activeTask.completed}
                disabled
              />
              <div className="flex-1 min-w-0">
                <div className={activeTask.completed ? "line-through text-muted-foreground" : ""}>
                  {activeTask.text}
                </div>
              </div>
              <Trash2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
