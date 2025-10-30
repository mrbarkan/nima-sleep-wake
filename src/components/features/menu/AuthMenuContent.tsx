import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Lock, Database } from "lucide-react";
import { z } from "zod";
import { AboutSection } from "./AboutSection";

const authSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100),
});

interface AuthMenuContentProps {
  onClose: () => void;
}

export const AuthMenuContent = ({ onClose }: AuthMenuContentProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      authSchema.parse({ email, password });

      const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message,
        });
      } else {
        toast({
          title: isLogin ? "Login realizado!" : "Cadastro realizado!",
          description: isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!",
        });
        onClose();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: error.errors[0].message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Cadastro"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Entre para salvar suas configurações"
              : "Crie uma conta para sincronizar seus dados"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Seguro e Privado</strong>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Lock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Senhas criptografadas e protegidas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Dados armazenados com segurança</span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
            </Button>
          </form>

          <div className="pt-4 border-t">
            <AboutSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
