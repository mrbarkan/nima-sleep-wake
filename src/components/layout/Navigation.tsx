import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Moon, Coffee, ListTodo, BookOpen } from "lucide-react";

const Navigation = () => {
  const { t } = useTranslation('common');

  const navItems = [
    { to: "/", icon: Moon, label: t('navigation.sleep'), colorClass: "text-[hsl(var(--icon-sleep))]" },
    { to: "/caffeine", icon: Coffee, label: t('navigation.caffeine'), colorClass: "text-[hsl(var(--icon-caffeine))]" },
    { to: "/todo", icon: ListTodo, label: t('navigation.todo'), colorClass: "text-[hsl(var(--icon-todo))]" },
    { to: "/relax", icon: BookOpen, label: t('navigation.blog'), colorClass: "text-[hsl(var(--icon-blog))]" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:static md:border-t-0 md:border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3 md:py-4 justify-evenly md:justify-start md:gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-all duration-200 ${
                  isActive ? "" : "hover:opacity-80"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`h-5 w-5 md:h-4 md:w-4 ${item.colorClass}`} />
                  <span className={`text-xs md:text-sm ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
