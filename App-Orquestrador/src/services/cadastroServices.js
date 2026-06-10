import { readUsers, writeUsers, hashPassword } from './authHelpers';
import { validateRegister } from './validators';

export async function register({ username, password, name, email }) {
  const u = username?.trim();
  const n = name?.trim();
  const e = email?.trim();

  // Validações de formato (centralizadas em validators.js)
  const errors = validateRegister({ name: n, email: e, username: u, password });
  const firstMessage = Object.values(errors)[0];
  if (firstMessage) {
    throw new Error(firstMessage);
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
