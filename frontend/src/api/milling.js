import api from './axios';

export const millingApi = {
  createWorkOrder: (data) => api.post('/milling/work-orders', data),
  completeWorkOrder: (id, data) => api.put(`/milling/work-orders/${id}/complete`, data),
  getWorkOrderById: (id) => api.get(`/milling/work-orders/${id}`),
  getByAgreement: (agreementId) => api.get(`/milling/agreement/${agreementId}`),
  getAllProcessors: () => api.get('/milling/processors'),
};
