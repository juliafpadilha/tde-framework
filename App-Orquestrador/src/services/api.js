import axios from 'axios';

const STORAGE_KEY = 'tde.auth';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* ignore parse errors */
  }
  return config;
});

const STATUS_POOL = ['sucesso', 'erro', 'pendente'];

export async function fetchJobs() {
  const { data } = await api.get('/posts', { params: { _limit: 12 } });

  return data.map((post) => {
    const status = STATUS_POOL[post.id % STATUS_POOL.length];
    const minutes = ((post.id * 7) % 55) + 1;
    const seconds = (post.id * 13) % 60;
    return {
      id: post.id,
      name: post.title
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, 32) || `Job_${post.id}`,
      status,
      duration: status === 'pendente'
        ? '--'
        : `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`,
      lastRun: status === 'pendente' ? 'Aguardando' : `Hoje, ${String(8 + (post.id % 12)).padStart(2, '0')}:${String((post.id * 11) % 60).padStart(2, '0')}`,
    };
  });
}

export async function uploadFile({ file, description }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  formData.append('size', file.size);
  formData.append('type', file.type);
  formData.append('description', description ?? '');

  const { data } = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export default api;
