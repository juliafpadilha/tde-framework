import { createContext, useContext, useEffect, useState } from 'react';
import { login } from '../services/loginServices';
import { register } from '../services/cadastroServices';

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
    const result = await register(userData);
    return result;
  };

  const handleLogin = async (credentials) => {
    // O backend retorna { token, user }
    const { token, user } = await login(credentials);

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

  return (
    <AuthContext.Provider
      value={{
        token: auth?.token ?? null,
        user: auth?.user ?? null,
        isAuthenticated: !!auth?.token,
        login: handleLogin,
        register: handleRegister,
        logout,
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
