import api from './axios';

export const batchesApi = {
  formBatch: (buyerRequirementId) => api.post(`/batches/form/${buyerRequirementId}`),
  getById: (batchId) => api.get(`/batches/${batchId}`),
};
