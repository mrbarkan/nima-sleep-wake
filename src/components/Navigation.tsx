import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Coffee, ListTodo, BookOpen, BarChart3, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: error.message
      });
    } else {
      toast({
        title: 'Logout realizado',
        description: 'Até logo!'
      });
      navigate('/');
    }
  };
  const navItems = [
    { to: "/", icon: Moon, label: "Sono" },
    { to: "/caffeine", icon: Coffee, label: "Cafeína" },
    { to: "/todo", icon: ListTodo, label: "To-Do" },
    { to: "/relax", icon: BookOpen, label: "Blog" },
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:static md:border-t-0 md:border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8 py-4 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs md:text-sm">{item.label}</span>
            </NavLink>
          ))}
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 h-auto py-2 px-3"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs md:text-sm">Sair</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
