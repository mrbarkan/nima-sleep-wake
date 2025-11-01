/**
 * Individual caffeine schedule item with collapsible notification toggle
 */

import { Card } from "@/components/ui/card";
import { Coffee, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NotificationToggle } from "@/components/features/notifications/NotificationToggle";
import { CaffeineSchedule } from "@/types/caffeine.types";

interface CaffeineScheduleItemProps {
  item: CaffeineSchedule;
  index: number;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const CaffeineScheduleItem = ({
  item,
  isOpen,
  onToggle,
}: CaffeineScheduleItemProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="p-4">
        <CollapsibleTrigger asChild>
          <div className="flex items-start gap-4 cursor-pointer group">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Coffee className="h-6 w-6 text-[hsl(var(--icon-caffeine))]" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div className="text-xl font-medium">{item.time}</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-accent">
                    {item.source}
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.description}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
      </Card>
      <CollapsibleContent className="pt-2">
        <NotificationToggle
          type={`caffeine-${item.time}` as any}
          time={item.time}
          title="Hora da cafeína!"
          body={`Está na hora de tomar seu ${item.source}. ${item.description}`}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
