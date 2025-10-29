import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Lock, Database } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').max(100)
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      authSchema.parse({ email, password });

      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: error.message
        });
      } else {
        toast({
          title: isLogin ? 'Login realizado!' : 'Cadastro realizado!',
          description: isLogin ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!'
        });
        if (!isLogin) {
          setIsLogin(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: error.errors[0].message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Entre para salvar suas configurações' 
                : 'Crie uma conta para sincronizar seus dados entre dispositivos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-primary/20 bg-primary/5">
              <Shield className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Seguro e Privado</strong>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Lock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Suas senhas são criptografadas e protegidas por sistemas de segurança modernos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Seus dados de autenticação são armazenados com segurança em servidores criptografados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Não vendemos ou compartilhamos suas informações pessoais com terceiros</span>
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
              {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground text-center space-y-2">
              <p className="font-medium">🔒 Compromisso com sua Privacidade</p>
              <p>
                Esta autenticação permite sincronizar suas preferências e tarefas entre dispositivos. 
                Seus dados de login são armazenados com segurança no backend, enquanto dados da 
                aplicação podem ser salvos localmente no seu navegador.
              </p>
              <p className="text-[10px] italic">
                Não vendemos, compartilhamos ou analisamos suas informações. 
                O login é opcional - você pode usar o app sem criar conta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
