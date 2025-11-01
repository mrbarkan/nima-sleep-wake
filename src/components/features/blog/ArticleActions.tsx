/**
 * Article like and share actions
 */

import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

interface ArticleActionsProps {
  likes: number;
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
}

export const ArticleActions = ({
  likes,
  isLiked,
  onLike,
  onShare,
}: ArticleActionsProps) => {
  return (
    <div className="flex items-center gap-4 pt-4 border-t">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLike}
        className="gap-2"
      >
        <Heart
          className={`h-4 w-4 ${
            isLiked ? "fill-red-500 text-red-500" : ""
          }`}
        />
        <span>{likes || 0}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onShare}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar
      </Button>
    </div>
  );
};
