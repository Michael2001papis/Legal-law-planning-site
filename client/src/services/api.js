const API = '/api';

function getToken() {
  return localStorage.getItem('accessToken');
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const msg = res.ok ? 'Invalid response' : (text?.startsWith('<') ? 'שרת לא זמין - נסה שוב מאוחר יותר' : (text?.slice(0, 80) || res.statusText));
    return { error: msg };
  }
}

async function fetchApi(url, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API + url, { ...opts, headers, credentials: 'include' });
  if (res.status === 401) {
    const refreshed = await authApi.refresh();
    if (refreshed) return fetchApi(url, opts);
    throw new Error('Session expired');
  }
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.error || res.statusText || 'שגיאת שרת');
  return data;
}

export const authApi = {
  async login(email, password, deviceId, deviceName) {
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, deviceId, deviceName }),
    });
    const data = await safeJson(res);
    if (data.error) throw new Error(data.error);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  async register(payload) {
    const res = await fetch(API + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await safeJson(res);
    if (data.error) throw new Error(data.error);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },
  async refresh() {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) return null;
    try {
      const res = await fetch(API + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
      });
      const data = await safeJson(res);
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (_) {}
    return null;
  },
  async logout(deviceId) {
    return fetchApi('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ deviceId }),
    });
  },
  async me() {
    return fetchApi('/auth/me');
  },
};

export const moviesApi = {
  list(params) {
    const q = new URLSearchParams(params).toString();
    return fetchApi(`/movies?${q}`);
  },
  get(id) {
    return fetchApi(`/movies/${id}`);
  },
  progress(id, seconds) {
    return fetchApi(`/movies/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ progressSeconds: seconds }),
    });
  },
  addFavorite(id) {
    return fetchApi(`/movies/${id}/favorite`, { method: 'POST' });
  },
  removeFavorite(id) {
    return fetchApi(`/movies/${id}/favorite`, { method: 'DELETE' });
  },
};

export const userApi = {
  profile: () => fetchApi('/user/profile'),
  devices: () => fetchApi('/user/devices'),
  removeDevice: (deviceId) => fetchApi(`/user/devices/${deviceId}`, { method: 'DELETE' }),
  myList: () => fetchApi('/user/my-list'),
  continueWatching: () => fetchApi('/user/continue-watching'),
};

export const adminApi = {
  users: () => fetchApi('/admin/users'),
  updateUser: (id, data) => fetchApi(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  movies: () => fetchApi('/admin/movies'),
  createMovie: (data) => fetchApi('/admin/movies', { method: 'POST', body: JSON.stringify(data) }),
  updateMovie: (id, data) => fetchApi(`/admin/movies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMovie: (id) => fetchApi(`/admin/movies/${id}`, { method: 'DELETE' }),
};
