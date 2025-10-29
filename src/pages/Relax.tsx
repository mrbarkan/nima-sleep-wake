import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Share2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import InfoPopup from "@/components/common/InfoPopup";
import { blogService, Article } from "@/services/blog.service";

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

      <div className="space-y-6">
        {articles.map((article) => (
          <Card key={article.id} className="p-6">
            <article className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
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

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(article.id)}
                  className="gap-2"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      article.isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span>{article.likes || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(article)}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </article>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Relax;
