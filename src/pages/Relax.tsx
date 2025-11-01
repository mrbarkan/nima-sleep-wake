import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { blogService, Article } from "@/services/blog.service";
import { BlogHeader, ArticleList } from "@/components/features/blog";

const Relax = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await blogService.fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Erro ao carregar artigos",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    try {
      await blogService.toggleLike(articleId, article.isLiked || false);
      
      setArticles(
        articles.map((a) =>
          a.id === articleId
            ? { 
                ...a, 
                likes: (a.likes || 0) + (a.isLiked ? -1 : 1), 
                isLiked: !a.isLiked 
              }
            : a
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Erro ao processar like",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (article: Article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || "",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share canceled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <BlogHeader />
      <ArticleList
        articles={articles}
        onLike={handleLike}
        onShare={handleShare}
      />
    </div>
  );
};

export default Relax;
