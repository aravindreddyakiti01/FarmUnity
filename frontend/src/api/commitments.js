import api from './axios';

export const commitmentsApi = {
  create: (agreementId, amount) => api.post(`/commitments/agreement/${agreementId}`, null, { params: { amount } }),
  fund: (id) => api.put(`/commitments/${id}/fund`),
  markPickupVerified: (agreementId) => api.put(`/commitments/agreement/${agreementId}/pickup-verified`),
  releasePayment: (agreementId) => api.put(`/commitments/agreement/${agreementId}/release`),
  getByAgreementId: (agreementId) => api.get(`/commitments/agreement/${agreementId}`),
};
