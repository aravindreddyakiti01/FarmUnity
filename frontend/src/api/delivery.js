import api from './axios';

export const deliveryApi = {
  confirmDelivery: (agreementId, data) => api.post(`/delivery/confirm/${agreementId}`, data),
};
