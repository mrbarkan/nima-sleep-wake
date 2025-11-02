/**
 * Modal para exibir detalhes do status de sincronização
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { syncService } from "@/services/sync.service";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SyncStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SyncStatusModal = ({ open, onOpenChange }: SyncStatusModalProps) => {
  const { user } = useAuth();
  const { syncing, lastSync, error } = useSyncStatus();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetrySync = async () => {
    setIsRetrying(true);
    try {
      await syncService.migrateLocalStorageData();
    } catch (err) {
      console.error("Erro ao tentar sincronizar:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sincronização Desativada</DialogTitle>
            <DialogDescription>
              A sincronização está disponível apenas para usuários autenticados.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertDescription>
              Faça login para sincronizar seus dados entre dispositivos.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Status de Sincronização</DialogTitle>
          <DialogDescription>
            Acompanhe o status da sincronização dos seus dados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status atual */}
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            {syncing ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Sincronizando...</p>
                  <p className="text-sm text-muted-foreground">Aguarde enquanto seus dados são salvos</p>
                </div>
              </>
            ) : error ? (
              <>
                <XCircle className="h-6 w-6 text-destructive" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Erro na Sincronização</p>
                  <p className="text-sm text-muted-foreground">Não foi possível sincronizar seus dados</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Sincronizado</p>
                  <p className="text-sm text-muted-foreground">
                    Seus dados estão atualizados
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Última sincronização */}
          {lastSync && !syncing && (
            <div className="text-sm text-muted-foreground">
              Última sincronização: {lastSync.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}

          {/* Erro detalhado */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="space-y-2">
                <p className="font-medium">Detalhes do erro:</p>
                <p className="text-sm">{error}</p>
                <p className="text-sm mt-2">
                  <strong>Possível solução:</strong> Verifique sua conexão com a internet e tente novamente. 
                  Se o problema persistir, seus dados estão salvos localmente e serão sincronizados quando a conexão for restabelecida.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Botão de retry */}
          {error && (
            <Button
              onClick={handleRetrySync}
              disabled={isRetrying}
              className="w-full"
              variant="outline"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tentando sincronizar...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </>
              )}
            </Button>
          )}

          {/* Informações adicionais */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>• Seus dados são sincronizados automaticamente a cada 30 segundos</p>
            <p>• Mesmo offline, suas alterações são salvas localmente</p>
            <p>• A sincronização ocorre automaticamente quando você recuperar a conexão</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
