import api from './axios';

export const recoveryApi = {
  detectCancellation: (batchId, membershipId, reason) =>
    api.post(`/recovery/detect/${batchId}/${membershipId}`, null, { params: { reason } }),
  executeRecovery: (batchId, membershipId, data) =>
    api.post(`/recovery/execute/${batchId}/${membershipId}`, data),
};
