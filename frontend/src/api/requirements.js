import api from './axios';

export const requirementsApi = {
  create: (data) => api.post('/requirements', data),
  getActive: () => api.get('/requirements'),
  getMyRequirements: () => api.get('/requirements/my'),
  getById: (id) => api.get(`/requirements/${id}`),
};
