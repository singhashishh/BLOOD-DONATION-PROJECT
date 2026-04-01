import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', },
});

// Donor APIs
export const donorAPI = {
  register: (donorData: any) => api.post('/donors/register', donorData),
  getAll: () => api.get('/donors'),
  getById: (id: string) => api.get(`/donors/${id}`),
  getNearby: (latitude: number, longitude: number, radius: number = 5) =>
    api.get('/donors/nearby', { params: { latitude, longitude, radius } }),
  update: (id: string, data: any) => api.put(`/donors/${id}`, data),
  recordDonation: (id: string) => api.post(`/donors/${id}/record-donation`),
};

// Donation Request APIs
export const donationRequestAPI = {
  create: (requestData: any) => api.post('/donation-requests/create', requestData),
  getActive: () => api.get('/donation-requests/active'),
  getById: (id: string) => api.get(`/donation-requests/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/donation-requests/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/donation-requests/${id}`),
};

export default api;
