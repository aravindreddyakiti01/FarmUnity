import api from './axios';

export const intelApi = {
  getMarketBenchmark: (crop = 'paddy', region = '') =>
    api.get(`/intel/market-benchmark`, { params: { crop, region } }),
  getWeatherRisk: (latitude = 12.9716, longitude = 77.5946, date = '') =>
    api.get(`/intel/weather-risk`, { params: { latitude, longitude, date } }),
};
