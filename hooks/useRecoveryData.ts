
import { useState, useEffect, useCallback } from 'react';
import type { RecoveryLog } from '../types';
import { storageService } from '../services/storageService';
import { sampleRecoveryLogs } from '../utils/sampleData';

export const useRecoveryData = (clientId: string | null) => {
  const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLog[]>([]);

  useEffect(() => {
    if (!clientId) {
      setRecoveryLogs([]);
      return;
    }
    const RECOVERY_KEY = `lifttrack-recovery-${clientId}`;
    const savedLogs = storageService.getItem<RecoveryLog[]>(RECOVERY_KEY);

    const ownerId = storageService.getItem<string>('lifttrack-owner-id');
    const isOwner = clientId === ownerId;

    if (isOwner && !savedLogs) {
        setRecoveryLogs(sampleRecoveryLogs);
        storageService.setItem(RECOVERY_KEY, sampleRecoveryLogs);
    } else {
        setRecoveryLogs(savedLogs || []);
    }
  }, [clientId]);

  const addRecoveryLog = useCallback((newLog: RecoveryLog) => {
    if (!clientId) return;
    const RECOVERY_KEY = `lifttrack-recovery-${clientId}`;
    setRecoveryLogs(prevLogs => {
      const filteredLogs = prevLogs.filter(log => log.date !== newLog.date);
      const updatedLogs = [newLog, ...filteredLogs];
      storageService.setItem(RECOVERY_KEY, updatedLogs);
      return updatedLogs;
    });
  }, [clientId]);
  
  return { recoveryLogs, addRecoveryLog };
};
