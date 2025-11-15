/**
 * Individual blog article card
 */

import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Article } from "@/services/blog.service";
import { ArticleActions } from "./ArticleActions";

interface ArticleCardProps {
  article: Article;
  onLike: (articleId: string) => void;
  onShare: (article: Article) => void;
}

export const ArticleCard = ({ article, onLike, onShare }: ArticleCardProps) => {
  return (
    <Card className="p-4 md:p-6">
      <article className="space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">{article.title}</h2>
          {article.excerpt && (
            <p className="text-muted-foreground text-sm">{article.excerpt}</p>
          )}
        </div>

        <p className="text-foreground leading-relaxed">{article.content}</p>

        {article.external_url && (
          <a
            href={article.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:underline text-sm"
          >
            Leia mais na fonte
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <ArticleActions
          likes={article.likes || 0}
          isLiked={article.isLiked || false}
          onLike={() => onLike(article.id)}
          onShare={() => onShare(article)}
        />
      </article>
    </Card>
  );
};
