// Validações centralizadas dos formulários da aplicação.
//
// Cada validador primitivo retorna uma string de erro (string vazia = válido)
// e cada função validate* devolve um objeto { campo: mensagem } apenas com os
// campos que falharam, para exibição de erros por campo nos formulários.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value) => EMAIL_REGEX.test(String(value ?? '').trim());

// Validadores primitivos reutilizáveis -------------------------------------

export function required(value, label = 'Este campo') {
  return !value || !String(value).trim() ? `${label} é obrigatório.` : '';
}

export function minLength(value, n, label = 'Este campo') {
  return String(value ?? '').trim().length < n
    ? `${label} deve ter pelo menos ${n} caracteres.`
    : '';
}

export function maxLength(value, n, label = 'Este campo') {
  return String(value ?? '').trim().length > n
    ? `${label} deve ter no máximo ${n} caracteres.`
    : '';
}

export function email(value, label = 'E-mail') {
  return value && !isEmail(value) ? `${label} inválido.` : '';
}

// Retorna a primeira mensagem não vazia da lista de checagens.
function firstError(...checks) {
  return checks.find(Boolean) || '';
}

// Remove as chaves cuja mensagem está vazia (campos válidos).
function compact(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg));
}

// Validadores por formulário ------------------------------------------------

export function validateLogin({ username, password }) {
  return compact({
    username: required(username, 'Usuário'),
    password: required(password, 'Senha'),
  });
}

export function validateRegister(values) {
  const { name, email: emailValue, username, password } = values;
  return compact({
    name: firstError(
      required(name, 'Nome'),
      minLength(name, 2, 'Nome'),
      maxLength(name, 80, 'Nome'),
    ),
    email: firstError(required(emailValue, 'E-mail'), email(emailValue)),
    username: firstError(
      required(username, 'Usuário'),
      minLength(username, 3, 'Usuário'),
      maxLength(username, 20, 'Usuário'),
    ),
    password: firstError(
      required(password, 'Senha'),
      minLength(password, 4, 'Senha'),
      maxLength(password, 64, 'Senha'),
    ),
  });
}

export function validateCadastro(values) {
  const errors = validateRegister(values);
  const { password, confirm } = values;
  const confirmError = firstError(
    required(confirm, 'Confirmação de senha'),
    confirm && password !== confirm ? 'As senhas não coincidem.' : '',
  );
  if (confirmError) errors.confirm = confirmError;
  return errors;
}

export function validateContato(values) {
  const { nome, email: emailValue, assunto, mensagem } = values;
  return compact({
    nome: firstError(
      required(nome, 'Nome'),
      minLength(nome, 2, 'Nome'),
      maxLength(nome, 80, 'Nome'),
    ),
    email: firstError(required(emailValue, 'E-mail'), email(emailValue)),
    assunto: required(assunto, 'Assunto'),
    mensagem: firstError(
      required(mensagem, 'Mensagem'),
      minLength(mensagem, 10, 'Mensagem'),
      maxLength(mensagem, 1000, 'Mensagem'),
    ),
  });
}

// Valida o arquivo selecionado no upload (formato e tamanho).
export function validateImageFile(file, { accepted, maxSizeMB }) {
  if (!file) return 'Selecione uma imagem antes de enviar.';
  if (!accepted.includes(file.type)) {
    return 'Formato inválido. Use PNG, JPG, WEBP ou GIF.';
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Arquivo excede ${maxSizeMB}MB.`;
  }
  return '';
}
