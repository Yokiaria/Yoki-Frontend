// src/api/apiClient.ts

const API_BASE_URL = '/api/v1';

// Helper to get headers including the Authorization token
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('gsi_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  headers['Pragma'] = 'no-cache';
  headers['Expires'] = '0';
  
  return headers;
};

// Generic fetch wrapper to handle errors
const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    const errorMsg = (data && typeof data === 'object' && 'message' in data) 
        ? data.message 
        : data || response.statusText;
    throw new Error(errorMsg as string);
  }

  return data as T;
};

export const apiClient = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) => fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any) => fetchApi<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: any) => fetchApi<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'DELETE' }),
};
