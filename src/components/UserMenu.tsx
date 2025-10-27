import { useState } from "react";
import { MoreVertical, Share2, MessageSquare, Info, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AuthMenuContent } from "./menu/AuthMenuContent";
import { AboutSection } from "./menu/AboutSection";
import { SuggestionsForm } from "./menu/SuggestionsForm";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    const shareText = "Confira este app para organizar sono, cafeína e tarefas!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sleep & Productivity App",
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Obrigado por compartilhar!",
          description: "Isso ajuda muito! 🙏",
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copiado!",
        description: "Cole e compartilhe com seus amigos.",
      });
    }
  };

  if (showAuth && !user) {
    return <AuthMenuContent onClose={() => setShowAuth(false)} />;
  }

  if (showSuggestions) {
    return <SuggestionsForm onClose={() => setShowSuggestions(false)} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col md:flex-row items-center gap-1 md:gap-2 h-auto py-2 px-3"
        >
          <MoreVertical className="h-5 w-5" />
          <span className="text-xs md:text-sm">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {user ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user.email}</span>
                <span className="text-xs text-muted-foreground">Usuário logado</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Gostou? Compartilhe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSuggestions(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar Sugestão
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AboutSection />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => setShowAuth(true)}>
              <Info className="mr-2 h-4 w-4" />
              Login / Cadastro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AboutSection />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
