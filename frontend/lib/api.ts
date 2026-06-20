import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send cookies with requests
});

export const auth = {
  signup: (email: string, password: string, firstName: string, lastName: string, organizationId: string) =>
    apiClient.post('/api/auth/signup', { email, password, first_name: firstName, last_name: lastName, organization_id: organizationId }),

  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),

  logout: () =>
    apiClient.post('/api/auth/logout'),

  me: () =>
    apiClient.get('/api/auth/me'),
};

export const leads = {
  list: () =>
    apiClient.get('/api/leads'),

  create: (data: any) =>
    apiClient.post('/api/leads', data),

  get: (id: string) =>
    apiClient.get(`/api/leads/${id}`),

  update: (id: string, data: any) =>
    apiClient.patch(`/api/leads/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/api/leads/${id}`),
};

export const prospects = {
  create: (data: any) =>
    apiClient.post('/api/prospects', data),

  get: (id: string) =>
    apiClient.get(`/api/prospects/${id}`),

  update: (id: string, data: any) =>
    apiClient.patch(`/api/prospects/${id}`, data),
};
