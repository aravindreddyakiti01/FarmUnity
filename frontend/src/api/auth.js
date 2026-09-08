import api from './axios';

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  registerFarmer: (data) => api.post('/auth/register/farmer', data),
  registerBuyer: (data) => api.post('/auth/register/buyer', data),
};
