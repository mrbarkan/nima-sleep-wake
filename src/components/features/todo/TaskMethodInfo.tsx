import InfoPopup from "@/components/common/InfoPopup";
import { TodoMethod } from "@/schemas/todo.schemas";
import { TodoService } from "@/services/todo.service";

interface TaskMethodInfoProps {
  method: TodoMethod;
}

/**
 * Componente que exibe informações sobre o método de produtividade selecionado
 */
export const TaskMethodInfo = ({ method }: TaskMethodInfoProps) => {
  const methodInfo = TodoService.getMethodInfo(method);

  return (
    <div className="mb-6 flex items-center gap-2">
      <h3 className="font-medium">{methodInfo.name}</h3>
      <InfoPopup
        title={methodInfo.name}
        content={`${methodInfo.description}\n\n💡 ${methodInfo.tip}`}
      />
    </div>
  );
};
