import api from './axios';

export const listingsApi = {
  create: (data) => api.post('/listings', data),
  getMyListings: () => api.get('/listings/my'),
  getPendingListings: () => api.get('/listings/pending'),
  getById: (id) => api.get(`/listings/${id}`),
  submitForVerification: (id) => api.put(`/listings/${id}/submit-for-verification`),
};
