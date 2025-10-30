/**
 * Sync status indicator component
 */

import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

export const SyncIndicator = () => {
  const { user } = useAuth();
  const { syncing, lastSync, error } = useSyncStatus();

  if (!user) return null;

  const getTooltipText = () => {
    if (error) return `Erro de sincronização: ${error}`;
    if (syncing) return 'Sincronizando...';
    if (lastSync) return `Última sincronização: ${lastSync.toLocaleTimeString()}`;
    return 'Pronto para sincronizar';
  };

  const getIcon = () => {
    if (syncing) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    if (error) {
      return <CloudOff className="h-4 w-4 text-destructive" />;
    }
    return <Cloud className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            {getIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
