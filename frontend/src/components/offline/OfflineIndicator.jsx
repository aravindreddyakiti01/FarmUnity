import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useDraftQueue } from '../../hooks/useDraftQueue';

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const { pendingDraftsCount, syncQueue, syncing } = useDraftQueue();

  if (isOnline && pendingDraftsCount === 0) return null;

  return (
    <div className={`w-full py-2 px-4 text-xs font-semibold flex items-center justify-between shadow-md transition-colors ${
      isOnline ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
    }`}>
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Offline Mode Active — You can save draft listings and requirements. Irreversible actions (commitments, approvals, settlements) are disabled.</span>
            </>
          ) : (
            <>
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{pendingDraftsCount} offline drafts pending sync to server</span>
            </>
          )}
        </div>

        {isOnline && pendingDraftsCount > 0 && (
          <button
            onClick={syncQueue}
            disabled={syncing}
            className="bg-white text-blue-700 px-2.5 py-1 rounded text-xs font-bold hover:bg-blue-50 transition"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
};
