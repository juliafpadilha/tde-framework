const BASE_URL = 'https://jsonplaceholder.typicode.com';
const TIMEOUT = 10000;
const STORAGE_KEY = 'tde.auth';

// Equivalente ao interceptor de request do axios: injeta o token Bearer
// salvo no localStorage em todas as requisições.
function authHeaders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) return { Authorization: `Bearer ${token}` };
    }
  } catch {
    /* ignore parse errors */
  }
  return {};
}

// Cliente HTTP baseado em fetch que reproduz o comportamento do axios:
// baseURL, timeout, header de autenticação, erro em status fora de 2xx
// e parsing automático de JSON.
async function request(path, { method = 'GET', params, body, headers } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.set(key, value);
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { ...authHeaders(), ...headers },
      body,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Tempo limite de ${TIMEOUT / 1000}s excedido.`, { cause: err });
    }
    throw new Error('Falha de conexão com o servidor.', { cause: err });
  } finally {
    clearTimeout(timer);
  }

  // fetch não rejeita em status de erro; replicamos o comportamento do axios.
  if (!res.ok) {
    throw new Error(`Erro ${res.status}: ${res.statusText || 'requisição falhou'}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

const STATUS_POOL = ['sucesso', 'erro', 'pendente'];

export async function fetchJobs() {
  const data = await request('/posts', { params: { _limit: 12 } });

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

  // Não definimos Content-Type manualmente: o navegador adiciona
  // multipart/form-data com o boundary correto para o FormData.
  const data = await request('/posts', { method: 'POST', body: formData });
  return data;
}
