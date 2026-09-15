import api from './axios';

export const batchesApi = {
  getAll: () => api.get('/batches'),
  getMyBatches: () => api.get('/batches/my'),
  getById: (batchId) => api.get(`/batches/${batchId}`),
  formBatch: (buyerRequirementId) => api.post(`/batches/form/${buyerRequirementId}`),
};
