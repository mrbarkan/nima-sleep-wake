/**
 * Blog service - handles article operations
 */

import { supabase } from "@/integrations/supabase/client";
import { storageService } from "./storage.service";

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  external_url: string | null;
  image_url: string | null;
  published_at: string;
  likes?: number;
  isLiked?: boolean;
}

class BlogService {
  /**
   * Fetch all articles with like counts and user like status
   */
  async fetchArticles(): Promise<Article[]> {
    const { data: articlesData, error: articlesError } = await supabase
      .from("blog_articles")
      .select("*")
      .order("published_at", { ascending: false });

    if (articlesError) throw articlesError;

    const { data: likesData, error: likesError } = await supabase
      .from("article_likes")
      .select("article_id");

    if (likesError) throw likesError;

    const userIdentifier = storageService.getUserIdentifier();
    const { data: userLikesData } = await supabase
      .from("article_likes")
      .select("article_id")
      .eq("user_identifier", userIdentifier);

    const likeCounts = likesData.reduce((acc: Record<string, number>, like) => {
      acc[like.article_id] = (acc[like.article_id] || 0) + 1;
      return acc;
    }, {});

    const userLikedIds = new Set(userLikesData?.map((l) => l.article_id) || []);

    return articlesData.map((article) => ({
      ...article,
      likes: likeCounts[article.id] || 0,
      isLiked: userLikedIds.has(article.id),
    }));
  }

  /**
   * Toggle like on an article
   */
  async toggleLike(articleId: string, currentlyLiked: boolean): Promise<void> {
    const userIdentifier = storageService.getUserIdentifier();

    if (currentlyLiked) {
      const { error } = await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", articleId)
        .eq("user_identifier", userIdentifier);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("article_likes")
        .insert({ article_id: articleId, user_identifier: userIdentifier });

      if (error) throw error;
    }
  }
}

export const blogService = new BlogService();
