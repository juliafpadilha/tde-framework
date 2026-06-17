const BASE_URL = 'http://localhost:3000';
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
async function request(path, { method = 'GET', params, body, headers, isFormData = false } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.set(key, value);
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  // Se for FormData, não definimos Content-Type (o browser faz isso).
  // Caso contrário, definimos como JSON.
  const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...authHeaders(), ...headers },
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
    // Tenta extrair a mensagem de erro do JSON de resposta
    let errorMessage = `Erro ${res.status}: ${res.statusText || 'requisição falhou'}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch {
      /* resposta não é JSON */
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  return res.json();
}

// -----------------------------------------------
// Auth
// -----------------------------------------------

export async function loginUser({ username, password }) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function registerUser({ name, email, username, password }) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, username, password }),
  });
}

// -----------------------------------------------
// Jobs
// -----------------------------------------------

export async function fetchJobs() {
  return request('/jobs');
}

export async function createJob({ name, file }) {
  const formData = new FormData();
  formData.append('name', name);
  if (file) {
    formData.append('file', file);
  }

  // Não definimos Content-Type manualmente: o navegador adiciona
  // multipart/form-data com o boundary correto para o FormData.
  return request('/jobs', { method: 'POST', body: formData, isFormData: true });
}

export async function updateJob(id, { name, file }) {
  const formData = new FormData();
  formData.append('name', name);
  if (file) {
    formData.append('file', file);
  }

  return request(`/jobs/${id}`, { method: 'PUT', body: formData, isFormData: true });
}

export async function runJob(id) {
  return request(`/jobs/${id}/run`, { method: 'POST' });
}

// -----------------------------------------------
// Messages
// -----------------------------------------------

export async function sendMessage({ nome, email, assunto, mensagem }) {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({ nome, email, assunto, mensagem }),
  });
}
