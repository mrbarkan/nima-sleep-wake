import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
        <div>
          <h1 className="text-4xl font-semibold mb-2">404</h1>
          <p className="text-xl text-muted-foreground">Página não encontrada</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
