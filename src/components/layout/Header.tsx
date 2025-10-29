import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/features/user/UserMenu";

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold">Nima</h1>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
