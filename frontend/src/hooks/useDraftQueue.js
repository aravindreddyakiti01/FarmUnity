import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../store/db';
import { listingsApi } from '../api/listings';
import { requirementsApi } from '../api/requirements';
import { useOnlineStatus } from './useOnlineStatus';
import { useEffect, useState } from 'react';

export const useDraftQueue = () => {
  const isOnline = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);

  const draftListings = useLiveQuery(() => db.draftListings.filter(d => !d.isSynced).toArray(), []) || [];
  const draftRequirements = useLiveQuery(() => db.draftRequirements.filter(d => !d.isSynced).toArray(), []) || [];

  const saveDraftListing = async (formData) => {
    return await db.draftListings.add({
      ...formData,
      createdAt: new Date().toISOString(),
      isSynced: false,
    });
  };

  const saveDraftRequirement = async (formData) => {
    return await db.draftRequirements.add({
      ...formData,
      createdAt: new Date().toISOString(),
      isSynced: false,
    });
  };

  const syncQueue = async () => {
    if (!isOnline || syncing) return;
    setSyncing(true);

    try {
      const unsyncedListings = await db.draftListings.filter(d => !d.isSynced).toArray();
      for (const item of unsyncedListings) {
        try {
          const { id, isSynced, createdAt, ...payload } = item;
          await listingsApi.create(payload);
          await db.draftListings.update(id, { isSynced: true });
        } catch (err) {
          console.error('Failed to sync draft listing', item, err);
        }
      }

      const unsyncedReqs = await db.draftRequirements.filter(d => !d.isSynced).toArray();
      for (const item of unsyncedReqs) {
        try {
          const { id, isSynced, createdAt, ...payload } = item;
          await requirementsApi.create(payload);
          await db.draftRequirements.update(id, { isSynced: true });
        } catch (err) {
          console.error('Failed to sync draft requirement', item, err);
        }
      }
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline]);

  return {
    draftListings,
    draftRequirements,
    pendingDraftsCount: draftListings.length + draftRequirements.length,
    saveDraftListing,
    saveDraftRequirement,
    syncQueue,
    syncing,
  };
};
