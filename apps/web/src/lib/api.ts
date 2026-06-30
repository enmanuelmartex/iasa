import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  client.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('iasa_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('iasa_token');
          localStorage.removeItem('iasa_user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export const api = createApiClient();

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// Projects
export const projectsApi = {
  list: () => api.get('/projects').then((r) => r.data),
  get: (id: string) => api.get(`/projects/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/projects', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/projects/${id}`).then((r) => r.data),
  importFromUrl: (id: string, url: string) =>
    api.post(`/projects/${id}/spec/url`, { url }).then((r) => r.data),
  importFromContent: (id: string, spec: object) =>
    api.post(`/projects/${id}/spec/upload`, { spec }).then((r) => r.data),
  saveAuth: (id: string, data: any) => api.post(`/projects/${id}/auth`, data).then((r) => r.data),
};

// Assessments
export const assessmentsApi = {
  list: (projectId?: string) =>
    api.get('/assessments', { params: projectId ? { projectId } : {} }).then((r) => r.data),
  get: (id: string) => api.get(`/assessments/${id}`).then((r) => r.data),
  run: (projectId: string, config?: any) =>
    api.post(`/assessments/projects/${projectId}/run`, config).then((r) => r.data),
  cancel: (id: string) => api.delete(`/assessments/${id}`).then((r) => r.data),
  dashboard: () => api.get('/assessments/dashboard').then((r) => r.data),
  streamProgress: (id: string, token: string) =>
    new EventSource(`${API_URL}/assessments/${id}/progress?token=${token}`),
};

// Findings
export const findingsApi = {
  list: (filters?: {
    severity?: string;
    status?: string;
    projectId?: string;
    assessmentId?: string;
    owaspCategory?: string;
  }) => api.get('/findings', { params: filters }).then((r) => r.data),
  get: (id: string) => api.get(`/findings/${id}`).then((r) => r.data),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/findings/${id}/status`, { status, notes }).then((r) => r.data),
  stats: () => api.get('/findings/stats').then((r) => r.data),
};

// Reports
export const reportsApi = {
  stats: () => api.get('/reports/stats').then((r) => r.data),
  list: (assessmentId?: string) =>
    api
      .get('/reports', { params: assessmentId ? { assessmentId } : {} })
      .then((r) => r.data),
  listByAssessment: (assessmentId: string) =>
    api.get(`/reports/assessment/${assessmentId}`).then((r) => r.data),
  get: (id: string) => api.get(`/reports/${id}`).then((r) => r.data),
  delete: (id: string) => api.delete(`/reports/${id}`).then((r) => r.data),
  generate: (
    assessmentId: string,
    format: 'JSON' | 'HTML' | 'MARKDOWN' | 'SARIF',
    type: 'EXECUTIVE' | 'TECHNICAL' | 'DEVELOPER' | 'COMPLIANCE' = 'TECHNICAL',
  ) => {
    const url = `${API_URL}/reports/assessment/${assessmentId}/generate?format=${format}&type=${type}`;
    window.open(url, '_blank');
  },
};
