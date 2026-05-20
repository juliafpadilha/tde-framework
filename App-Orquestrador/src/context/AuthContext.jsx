import { createContext, useContext, useEffect, useState } from 'react';

const SESSION_KEY = 'tde.auth';
const USERS_KEY = 'tde.users';

const AuthContext = createContext(null);

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [auth]);

  const register = async ({ username, password, name, email }) => {
    const u = username?.trim();
    const n = name?.trim();
    const e = email?.trim();
    if (!u || !password || !n || !e) {
      throw new Error('Preencha todos os campos.');
    }
    if (password.length < 4) {
      throw new Error('A senha deve ter pelo menos 4 caracteres.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      throw new Error('Email inválido.');
    }

    const users = readUsers();
    if (users.some((x) => x.username.toLowerCase() === u.toLowerCase())) {
      throw new Error('Usuário já cadastrado.');
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      username: u,
      name: n,
      email: e,
      passwordHash,
      role: 'Data Engineer',
      createdAt: new Date().toISOString(),
    };
    writeUsers([...users, newUser]);

    return newUser;
  };

  const login = async ({ username, password }) => {
    const u = username?.trim();
    if (!u || !password) {
      throw new Error('Informe usuário e senha.');
    }

    const users = readUsers();
    const found = users.find((x) => x.username.toLowerCase() === u.toLowerCase());
    if (!found) {
      throw new Error('Usuário não encontrado. Cadastre-se primeiro.');
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== found.passwordHash) {
      throw new Error('Senha incorreta.');
    }

    return startSession(found);
  };

  const startSession = (user) => {
    const token = btoa(`${user.username}:${Date.now()}`);
    const session = {
      token,
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      issuedAt: new Date().toISOString(),
    };
    setAuth(session);
    return session;
  };

  const logout = () => setAuth(null);

  const hasUsers = () => readUsers().length > 0;

  return (
    <AuthContext.Provider
      value={{
        token: auth?.token ?? null,
        user: auth?.user ?? null,
        isAuthenticated: !!auth?.token,
        login,
        register,
        logout,
        hasUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
