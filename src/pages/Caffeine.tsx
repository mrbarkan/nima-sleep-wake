import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";
import { NotificationToggle } from "@/components/features/notifications/NotificationToggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCaffeineScheduler } from "@/hooks/useCaffeineScheduler";

const Caffeine = () => {
  const {
    wakeTime,
    schedule,
    openNotifications,
    setWakeTime,
    setOpenNotifications,
    calculateSchedule,
  } = useCaffeineScheduler();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Coffee className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-caffeine))]" />
          <div>
            <div className="flex items-center">
              <h1 className="text-xl md:text-3xl font-semibold">Cafeína</h1>
              <InfoPopup
                title="Timing da Cafeína"
                content="A cafeína tem meia-vida de 5-6 horas no organismo. Consumir após 15h pode interferir no sono. O momento ideal para a primeira dose é 90-120 minutos após acordar, quando o cortisol natural começa a declinar."
                sources={[
                  {
                    label: "Sleep Foundation - Caffeine and Sleep",
                    url: "https://www.sleepfoundation.org/nutrition/caffeine-and-sleep",
                  },
                  {
                    label: "Huberman Lab - Caffeine Timing",
                    url: "https://hubermanlab.com/using-caffeine-to-optimize-mental-and-physical-performance/",
                  },
                ]}
              />
            </div>
            <p className="text-muted-foreground text-xs md:text-sm">
              Doses estratégicas ao longo do dia
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wake-time-caffeine">Que horas você acorda?</Label>
            <Input
              id="wake-time-caffeine"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="text-lg"
            />
          </div>
          <Button onClick={calculateSchedule} className="w-full" size="lg">
            <Clock className="mr-2 h-4 w-4" />
            Gerar Cronograma
          </Button>
        </div>
      </Card>

      {schedule.length > 0 && (
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <Collapsible 
              key={index}
              open={openNotifications[index]} 
              onOpenChange={(open) => 
                setOpenNotifications(prev => ({ ...prev, [index]: open }))
              }
            >
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
                          {openNotifications[index] ? (
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
          ))}
          
          <Card className="p-4 bg-muted/50 border-muted">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Dicas importantes:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Evite cafeína após 15h para não afetar o sono</li>
                  <li>A vida média da cafeína é de 5-6 horas</li>
                  <li>Alternar fontes ajuda a evitar tolerância</li>
                  <li>Hidrate-se: 1 copo de água para cada café</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Caffeine;
