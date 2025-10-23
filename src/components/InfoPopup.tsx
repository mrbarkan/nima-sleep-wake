import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InfoPopupProps {
  title: string;
  content: string;
  sources?: { label: string; url: string }[];
}

const InfoPopup = ({ title, content, sources }: InfoPopupProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content}
          </p>
          {sources && sources.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-2">Fontes:</p>
              <ul className="space-y-1">
                {sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InfoPopup;
