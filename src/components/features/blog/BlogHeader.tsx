/**
 * Blog page header with icon and info popup
 */

import { BookOpen } from "lucide-react";
import InfoPopup from "@/components/common/InfoPopup";

export const BlogHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-[hsl(var(--icon-blog))]" />
        <div>
          <div className="flex items-center">
            <h1 className="text-xl md:text-3xl font-semibold">Blog</h1>
            <InfoPopup
              title="Sobre o Blog"
              content="Artigos sobre saúde do sono, nutrição e bem-estar baseados em evidências científicas. Todos os artigos incluem fontes confiáveis para você se aprofundar nos temas."
              sources={[
                {
                  label: "National Sleep Foundation",
                  url: "https://www.sleepfoundation.org/",
                },
                {
                  label: "NIH Sleep Research",
                  url: "https://www.nhlbi.nih.gov/health/sleep",
                },
              ]}
            />
          </div>
          <p className="text-muted-foreground text-xs md:text-sm">
            Conhecimento baseado em evidências
          </p>
        </div>
      </div>
    </div>
  );
};
