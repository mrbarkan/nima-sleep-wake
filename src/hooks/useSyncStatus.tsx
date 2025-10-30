/**
 * Hook for accessing sync status across the app
 */

import { useState, useEffect } from 'react';
import { syncService } from '@/services/sync.service';

interface SyncStatus {
  syncing: boolean;
  lastSync: Date | null;
  error: string | null;
}

export const useSyncStatus = () => {
  const [status, setStatus] = useState<SyncStatus>(syncService.getStatus());

  useEffect(() => {
    const unsubscribe = syncService.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return status;
};
