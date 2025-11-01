/**
 * Important tips card for caffeine consumption
 */

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const CaffeineTipsCard = () => {
  return (
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
  );
};
