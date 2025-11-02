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
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
    duration: 200,
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
          <Card className="p-4 shadow-2xl scale-[1.03] backdrop-blur-md bg-background/80 border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 rounded-full transition-colors flex-shrink-0" 
                   style={{ backgroundColor: tasks.find(t => t.id === activeTask.id) ? 
                     (() => {
                       const index = tasks.findIndex(t => t.id === activeTask.id);
                       const { getTaskColor } = require('@/services/todo.service').TodoService;
                       return getTaskColor(method, index, activeTask.category);
                     })() : 'hsl(var(--primary))' 
                   }} 
              />
              <div className="h-5 w-5 rounded border-2 border-muted-foreground/50 flex items-center justify-center flex-shrink-0">
                {activeTask.completed && (
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                    <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={activeTask.completed ? "line-through text-muted-foreground" : ""}>
                  {activeTask.text}
                </div>
              </div>
              <div className="h-9 w-9 flex items-center justify-center text-muted-foreground flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
