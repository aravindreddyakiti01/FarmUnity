import Dexie from 'dexie';

export const db = new Dexie('FarmUnityOfflineDB');

db.version(1).stores({
  draftListings: '++id, crop, declaredQty, createdAt, isSynced',
  draftRequirements: '++id, product, quantityKg, createdAt, isSynced',
});
