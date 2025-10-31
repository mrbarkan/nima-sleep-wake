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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { TaskItem } from "./TaskItem";
import { Task, TodoMethod } from "@/schemas/todo.schemas";

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
      const oldIndex = tasks.findIndex((item) => item.id === active.id);
      const newIndex = tasks.findIndex((item) => item.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      onReorder(newTasks);
    }
  };

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
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
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
    </DndContext>
  );
};
