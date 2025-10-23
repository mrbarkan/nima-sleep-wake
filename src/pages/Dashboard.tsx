import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, Heart, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ArticleStats {
  id: string;
  title: string;
  likes: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<ArticleStats[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: articles, error: articlesError } = await supabase
        .from("blog_articles")
        .select("id, title")
        .order("published_at", { ascending: false });

      if (articlesError) throw articlesError;

      const { data: likes, error: likesError } = await supabase
        .from("article_likes")
        .select("article_id");

      if (likesError) throw likesError;

      const likeCounts = likes.reduce((acc: Record<string, number>, like) => {
        acc[like.article_id] = (acc[like.article_id] || 0) + 1;
        return acc;
      }, {});

      const articlesWithStats = articles.map((article) => ({
        id: article.id,
        title: article.title,
        likes: likeCounts[article.id] || 0,
      }));

      setStats(articlesWithStats);
      setTotalLikes(likes.length);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <BarChart3 className="h-8 w-8 text-accent" />
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Estatísticas de engajamento do blog
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Likes</p>
              <p className="text-3xl font-semibold">{totalLikes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Artigos Publicados</p>
              <p className="text-3xl font-semibold">{stats.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Likes por Artigo</h2>
        <div className="space-y-4">
          {stats.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex-1">
                <p className="font-medium">{article.title}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="font-semibold">{article.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Use essas métricas para entender quais temas
          mais ressoam com seus leitores e criar conteúdo mais relevante.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
