import api from './axios';

export const settlementsApi = {
  getByAgreement: (agreementId) => api.get(`/settlements/agreement/${agreementId}`),
  getByFarmer: (farmerId) => api.get(`/settlements/farmer/${farmerId}`),
};
