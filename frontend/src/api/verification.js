import api from './axios';

export const verificationApi = {
  verify: (listingId, data) => api.post(`/verification/verify/${listingId}`, data),
  getForListing: (listingId) => api.get(`/verification/${listingId}`),
};
