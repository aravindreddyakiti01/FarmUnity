import api from './axios';

export const auditApi = {
  getByEntity: (entityType, entityId) => api.get(`/audit/entity/${entityType}/${entityId}`),
  getAll: () => api.get('/audit/all'),
};
