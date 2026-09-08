import api from './axios';

export const agreementsApi = {
  create: (data) => api.post('/agreements', data),
  submitFarmerDecision: (id, data) => api.put(`/agreements/${id}/farmer-decision`, data),
  proposeAmendment: (id, data) => api.put(`/agreements/${id}/propose-amendment`, data),
  getById: (id) => api.get(`/agreements/${id}`),
  getByBatchId: (batchId) => api.get(`/agreements/batch/${batchId}`),
};
