import { loginUser } from './api';
import { validateLogin } from './validators';

export async function login({ username, password }) {
  // Validações de formato (centralizadas em validators.js)
  const errors = validateLogin({ username, password });
  const firstMessage = Object.values(errors)[0];
  if (firstMessage) {
    throw new Error(firstMessage);
  }

  // Chama a API real do backend
  const data = await loginUser({ username: username.trim(), password });

  // Retorna token + dados do usuário vindos do backend
  return data;
}
