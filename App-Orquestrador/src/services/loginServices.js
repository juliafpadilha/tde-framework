import { readUsers, hashPassword } from './authHelpers';
import { validateLogin } from './validators';

export async function login({ username, password }) {
  // Validações (centralizadas em validators.js)
  const errors = validateLogin({ username, password });
  const firstMessage = Object.values(errors)[0];
  if (firstMessage) {
    throw new Error(firstMessage);
  }

  const u = username.trim();
  const users = readUsers();
  const found = users.find((x) => x.username.toLowerCase() === u.toLowerCase());

  if (!found) {
    throw new Error('Usuário não encontrado. Cadastre-se primeiro.');
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== found.passwordHash) {
    throw new Error('Senha incorreta.');
  }

  // Se tudo estiver certo, retorna o usuário encontrado
  return found;
}
