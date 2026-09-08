import api from './axios';

export const logisticsApi = {
  getRoute: (batchId) => api.get(`/logistics/route/${batchId}`),
  verifyPickup: (membershipId, data) => api.post(`/logistics/pickup-verify/${membershipId}`, data),
};
