import { useState, useEffect } from "react";
import { MoreVertical, Share2, MessageSquare, Info, LogOut, Moon, Sun, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AuthMenuContent } from "@/components/features/menu/AuthMenuContent";
import { AboutSection } from "@/components/features/menu/AboutSection";
import { SuggestionsForm } from "@/components/features/menu/SuggestionsForm";
import { Switch } from "@/components/ui/switch";
import { NotificationManager } from "@/components/features/notifications/NotificationManager";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Verifica se há preferência salva
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

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

  if (showNotifications) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:relative md:bg-transparent md:backdrop-blur-none">
        <div className="fixed inset-x-4 top-20 z-50 md:absolute md:right-0 md:top-0 md:left-auto md:w-96">
          <div className="bg-card border rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notificações</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                Fechar
              </Button>
            </div>
            <NotificationManager />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              {isDarkMode ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span>Modo Escuro</span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        {user ? (
          <>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user.email}</span>
                <span className="text-xs text-muted-foreground">Usuário logado</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowNotifications(true)}>
              <Bell className="mr-2 h-4 w-4" />
              Notificações
            </DropdownMenuItem>
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
