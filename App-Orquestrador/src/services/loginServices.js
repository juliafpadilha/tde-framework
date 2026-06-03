import { readUsers, hashPassword } from './authHelpers';

export async function login({ username, password }) {
  const u = username?.trim();
  
  // Validações
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

  // Se tudo estiver certo, retorna o usuário encontrado
  return found;
}
