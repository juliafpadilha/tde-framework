import { registerUser } from './api';
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

  // Chama a API real do backend
  const data = await registerUser({ name: n, email: e, username: u, password });

  return data;
}
