import { useState } from "react";
import { X, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SuggestionsFormProps {
  onClose: () => void;
}

export const SuggestionsForm = ({ onClose }: SuggestionsFormProps) => {
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!suggestion.trim()) {
      toast({
        variant: "destructive",
        title: "Campo vazio",
        description: "Por favor, escreva sua sugestão antes de enviar.",
      });
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual submission to backend
    setTimeout(() => {
      toast({
        title: "Sugestão enviada!",
        description: "Obrigado pelo seu feedback. Vamos analisar com carinho! 💙",
      });
      setSuggestion("");
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle>Envie sua Sugestão</CardTitle>
          <CardDescription>
            Sua opinião é muito importante para melhorar este app!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Conte-nos sua ideia, sugestão ou feedback..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
