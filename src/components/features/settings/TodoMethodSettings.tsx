import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hooks/useSettings";
import { TodoMethod } from "@/schemas/todo.schemas";
import { TodoService } from "@/services/todo.service";
import InfoPopup from "@/components/common/InfoPopup";

/**
 * Componente para configurar métodos de tarefas visíveis
 */
export const TodoMethodSettings = () => {
  const { t } = useTranslation("settings");
  const { settings, updateTodoMethods } = useSettings();

  const methods: TodoMethod[] = ["ivy-lee", "1-3-5", "eat-frog", "eisenhower"];

  const handleMethodToggle = (method: TodoMethod, checked: boolean) => {
    updateTodoMethods({ [method]: checked });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">{t("sections.todoMethods")}</h2>
        <InfoPopup
          title={t("sections.todoMethods")}
          content={t("todoMethods.info")}
        />
      </div>

      <div className="space-y-4">
        {methods.map((method) => {
          const methodInfo = TodoService.getMethodInfo(method);
          const isChecked = settings.todo.visibleMethods[method];

          return (
            <div key={method} className="flex items-start space-x-3">
              <Checkbox
                id={method}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleMethodToggle(method, checked as boolean)
                }
              />
              <Label htmlFor={method} className="flex-1 cursor-pointer">
                <span className="font-medium">{methodInfo.name}</span>
                <p className="text-xs text-muted-foreground font-normal">
                  {methodInfo.description}
                </p>
              </Label>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        {t("todoMethods.minOneRequired")}
      </p>
    </Card>
  );
};
