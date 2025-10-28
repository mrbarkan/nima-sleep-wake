import { Instagram, Linkedin, Globe, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const AboutSection = () => {
  return (
    <div className="px-2 py-3 space-y-3">
      <div className="text-sm space-y-2">
        <p className="font-medium text-foreground">Sobre este App</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          App experimental desenvolvido por{" "}
          <span className="font-semibold text-foreground">MrBarkan</span> a partir de uma
          necessidade em organizar o sono e como exercício de uma mente inquieta.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open("https://instagram.com/mrbarkan", "_blank")}
        >
          <Instagram className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open("https://linkedin.com/in/mrbarkan", "_blank")}
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open("https://davidbarkan.com", "_blank")}
        >
          <Globe className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">Gostou do app?</p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={() => window.open("https://nubank.com.br/cobrar/4jija/68ff69c3-5e34-429b-87b2-e9c85c10d8d1", "_blank")}
        >
          <Coffee className="h-3 w-3 mr-1" />
          Considere uma gorjeta via Pix
        </Button>
      </div>

      <div className="pt-2 text-center">
        <p className="text-[10px] text-muted-foreground/60">v0.9.0.1 beta</p>
      </div>
    </div>
  );
};
