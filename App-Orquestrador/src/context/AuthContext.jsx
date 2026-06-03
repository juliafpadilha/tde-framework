import { createContext, useContext, useEffect, useState } from 'react';
import { login } from '../services/loginServices';
import { register } from '../services/cadastroServices';
import { readUsers } from '../services/authHelpers';

const SESSION_KEY = 'tde.auth';

const AuthContext = createContext(null);

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

  const handleRegister = async (userData) => {
    const newUser = await register(userData);
    return newUser;
  };

  const handleLogin = async (credentials) => {
    const foundUser = await login(credentials);
    return startSession(foundUser);
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
        login: handleLogin,
        register: handleRegister,
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
