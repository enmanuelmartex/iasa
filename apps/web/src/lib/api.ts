import axios, { AxiosInstance } from 'axios';

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
  // Legacy email/password login (kept for existing accounts with User.password)
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then((r) => r.data),
  // Legacy self-registration
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  // Exchange a Better Auth session token for a JWT used by all domain routes
  exchangeSession: (sessionToken: string) =>
    api.post('/auth/exchange-session', { token: sessionToken }).then((r) => r.data),
};

// Projects
export const projectsApi = {
  list: () => api.get('/projects').then((r) => r.data),
  get: (id: string) => api.get(`/projects/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/projects', data).then((r) => r.data),
  createDraft: (data: any) => api.post('/projects/drafts', data).then((r) => r.data),
  saveDraft: (id: string, data: any) => api.put(`/projects/${id}/draft`, data).then((r) => r.data),
  finalize: (id: string) => api.post(`/projects/${id}/finalize`).then((r) => r.data),
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
  run: (projectId: string, config?: {
    executionMode?: 'all' | 'profile' | 'manual';
    scanProfileId?: string;
    manualPlugins?: string[];
    enableAiAnalysis?: boolean;
    maxRequestsPerEndpoint?: number;
    requestDelayMs?: number;
    timeoutMs?: number;
  }) =>
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

// Plugins
export const pluginsApi = {
  list: () => api.get('/plugins').then((r) => r.data),
  get: (id: string) => api.get(`/plugins/${id}`).then((r) => r.data),
  toggle: (id: string, isEnabled: boolean) =>
    api.put(`/plugins/${id}/toggle`, { isEnabled }).then((r) => r.data),
  saveConfig: (id: string, config: Record<string, any>) =>
    api.put(`/plugins/${id}/config`, config).then((r) => r.data),
  getExecutions: (id: string) => api.get(`/plugins/${id}/executions`).then((r) => r.data),
  getFindings: (id: string) => api.get(`/plugins/${id}/findings`).then((r) => r.data),
  run: (id: string, projectId: string, pluginConfig?: Record<string, any>) =>
    api.post(`/plugins/${id}/run`, { projectId, pluginConfig }).then((r) => r.data),
  categories: () => api.get('/plugins/categories').then((r) => r.data),
};

// Scan Profiles
export const profilesApi = {
  list: () => api.get('/plugins/profiles').then((r) => r.data),
  get: (id: string) => api.get(`/plugins/profiles/${id}`).then((r) => r.data),
  create: (data: {
    name: string;
    description?: string;
    icon?: string;
    enabledPlugins: string[];
    pluginConfigs?: Record<string, any>;
  }) => api.post('/plugins/profiles', data).then((r) => r.data),
  update: (id: string, data: Partial<{
    name: string;
    description: string;
    icon: string;
    enabledPlugins: string[];
    pluginConfigs: Record<string, any>;
  }>) => api.put(`/plugins/profiles/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/plugins/profiles/${id}`).then((r) => r.data),
};

// AI Provider
export const aiApi = {
  status:              () => api.get('/ai/status').then((r) => r.data),
  getAllConfigs:        () => api.get('/ai/config').then((r) => r.data),
  getProviderConfig:   (provider: string) => api.get(`/ai/config/${provider}`).then((r) => r.data),
  saveProviderConfig:  (provider: string, data: any) => api.put(`/ai/config/${provider}`, data).then((r) => r.data),
  activateProvider:    (provider: string) => api.put(`/ai/config/${provider}/activate`).then((r) => r.data),
  deactivateAll:       () => api.put('/ai/config/deactivate-all').then((r) => r.data),
  testProvider:        (provider: string, data: any) => api.post(`/ai/config/${provider}/test`, data).then((r) => r.data),
  deleteProviderConfig:(provider: string) => api.delete(`/ai/config/${provider}`).then((r) => r.data),
  getEnvStatus:        () => api.get('/ai/config/env-status').then((r) => r.data),
};

// Users (admin)
export const usersApi = {
  list: () => api.get('/users').then((r) => r.data),
  get: (id: string) => api.get(`/users/${id}`).then((r) => r.data),
  create: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/users', data).then((r) => r.data),
  update: (id: string, data: { name?: string }) =>
    api.patch(`/users/${id}`, data).then((r) => r.data),
  changeRole: (id: string, role: string) =>
    api.patch(`/users/${id}/role`, { role }).then((r) => r.data),
  setStatus: (id: string, isActive: boolean) =>
    api.patch(`/users/${id}/status`, { isActive }).then((r) => r.data),
  resetPassword: (id: string, newPassword: string) =>
    api.post(`/users/${id}/password-reset`, { newPassword }).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
  auditLogs: (params?: { limit?: number; offset?: number; userId?: string; action?: string; resource?: string }) =>
    api.get('/users/audit-logs', { params }).then((r) => r.data),
  // Invitation system
  invite: (data: { email: string; role?: string }) =>
    api.post('/users/invite', data).then((r) => r.data),
  verifyInvite: (token: string) =>
    api.get('/users/verify-invite', { params: { token } }).then((r) => r.data),
  acceptInvite: (token: string) =>
    api.post('/users/accept-invite', { token }).then((r) => r.data),
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
  generate: async (
    assessmentId: string,
    format: 'JSON' | 'HTML' | 'MARKDOWN' | 'SARIF',
    type: 'EXECUTIVE' | 'TECHNICAL' | 'DEVELOPER' | 'COMPLIANCE' = 'TECHNICAL',
  ) => {
    const response = await api.get(
      `/reports/assessment/${assessmentId}/generate`,
      { params: { format, type }, responseType: 'blob' },
    );
    const ext = { JSON: 'json', HTML: 'html', MARKDOWN: 'md', SARIF: 'sarif' }[format] ?? 'txt';
    const rawContentType = response.headers['content-type'];
    const contentType = typeof rawContentType === 'string' ? rawContentType : undefined;
    const blob = new Blob([response.data], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iasa-report-${assessmentId.slice(0, 8)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

// Finance — estimated AI usage cost
export const financeApi = {
  summary: (params?: { projectId?: string; from?: string; to?: string }) =>
    api.get('/finance/summary', { params }).then((r) => r.data),
  usage: (params?: { page?: number; pageSize?: number; projectId?: string; provider?: string; from?: string; to?: string }) =>
    api.get('/finance/usage', { params }).then((r) => r.data),
};
