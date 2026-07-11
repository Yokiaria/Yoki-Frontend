// src/utils/api.ts
// Utility terpusat untuk semua HTTP request ke GrandStarInd API

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/** Ambil token JWT dari localStorage */
export const getToken = () => localStorage.getItem('gsi_token');

/** Ambil data user yang tersimpan dari localStorage */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('gsi_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Headers standar dengan Authorization Bearer JWT */
export const authHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

/** Hapus semua session data dan redirect ke halaman utama */
export const logout = () => {
  localStorage.removeItem('gsi_token');
  localStorage.removeItem('gsi_user');
  window.location.href = '/';
};

// Helper internal untuk handle response & error
const handleResponse = async (res: Response) => {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    const msg =
      data && typeof data === 'object' && 'message' in data
        ? data.message
        : data || res.statusText;
    throw new Error(msg as string);
  }

  return data;
};

/** Object API terpusat mirip axios */
export const api = {
  get: (path: string) =>
    fetch(`${BASE_URL}${path}`, { headers: authHeaders() }).then(
      handleResponse,
    ),

  post: (path: string, body: any) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path: string, body: any) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path: string, body?: any) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse),

  delete: (path: string) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),
};
