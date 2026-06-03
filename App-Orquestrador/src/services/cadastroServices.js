import { readUsers, writeUsers, hashPassword } from './authHelpers';

export async function register({ username, password, name, email }) {
  const u = username?.trim();
  const n = name?.trim();
  const e = email?.trim();

  // Validações
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
}
