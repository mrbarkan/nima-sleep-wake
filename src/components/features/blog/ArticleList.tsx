/**
 * List of blog articles
 */

import { Article } from "@/services/blog.service";
import { ArticleCard } from "./ArticleCard";

interface ArticleListProps {
  articles: Article[];
  onLike: (articleId: string) => void;
  onShare: (article: Article) => void;
}

export const ArticleList = ({ articles, onLike, onShare }: ArticleListProps) => {
  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onLike={onLike}
          onShare={onShare}
        />
      ))}
    </div>
  );
};
