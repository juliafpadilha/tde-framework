# Dashboard de Monitoramento de Jobs de ETL

Este é um projeto acadêmico (TDE) que demonstra a construção de um dashboard em fluxo de Single Page Application (SPA), desenvolvido em React. A proposta original focava em uma interface minimalista e moderna sem frameworks de CSS. Nesta evolução, o MVP passou a simular um ambiente real de produção integrando **API REST externa**, **autenticação** com persistência de token e **upload de arquivos** com preview.

Vite continua sendo utilizado para compilar e empacotar a aplicação.

## 🚀 Como Executar

1. Clone ou baixe o repositório na sua máquina
2. No diretório raiz (`App-Orquestrador`), instale as dependências:
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. A aplicação estará disponível em `http://localhost:5173/`
5. **Primeiro acesso:** a aplicação abre na tela de login. Clique em **Cadastre-se**, crie sua conta (nome, email, usuário e senha) e você será levado de volta ao login para autenticar com as credenciais que acabou de criar.
6. **Acessos seguintes:** o login valida usuário e senha contra os cadastros salvos no `localStorage`.

## 📂 Organização da Arquitetura

```text
src/
 ┣ components/               # Componentes reutilizáveis
 ┃ ┣ Alert.jsx/.css
 ┃ ┣ Footer.jsx/.css
 ┃ ┣ Header.jsx/.css         # Header com info do usuário logado + botão Sair
 ┃ ┣ JobCard.jsx/.css        # Card/Item usado na lista
 ┃ ┣ MainLayout.jsx/.css     # Layout base que embrulha as rotas protegidas
 ┃ ┣ Navbar.jsx/.css         # Menu lateral
 ┃ ┣ ProtectedRoute.jsx      # Guard que redireciona para /login se não autenticado
 ┃ ┗ StatusCard.jsx/.css     # Card de resumo (usado na Home)
 ┣ context/
 ┃ ┗ AuthContext.jsx         # Provider de autenticação (token + user em localStorage)
 ┣ pages/
 ┃ ┣ Cadastro.jsx            # Tela de cadastro de novo usuário
 ┃ ┣ Contato.jsx/.css
 ┃ ┣ Home.jsx/.css
 ┃ ┣ Lista.jsx/.css          # Consome a API REST via axios
 ┃ ┣ Login.jsx/.css          # Tela de login (valida contra usuários cadastrados)
 ┃ ┣ Sobre.jsx/.css
 ┃ ┗ Upload.jsx/.css         # Upload de imagem com preview
 ┣ services/
 ┃ ┗ api.js                  # Instância axios + funções fetchJobs/uploadFile
 ┣ App.jsx                   # Rotas + AuthProvider + ProtectedRoute
 ┣ main.jsx                  # Entry point
 ┗ index.css                 # Paleta, classes globais e CSS base
```

## 🔐 Fluxo de Autenticação

A autenticação é **simulada** (sem backend real) mas usa o mesmo modelo de produção: cadastro → login com credenciais validadas → sessão com token.

**Stack:** Context API + `localStorage` + `crypto.subtle` (SHA-256 para hash de senha).

### Dois storages distintos

| Chave         | Conteúdo                                          | Quando é escrito                              |
|---------------|---------------------------------------------------|-----------------------------------------------|
| `tde.users`   | Array de usuários `{ username, name, email, passwordHash, role, createdAt }` | No cadastro (`register()`)                 |
| `tde.auth`    | Sessão ativa `{ token, user, issuedAt }`          | No login bem-sucedido (`login()` / `register()`) |

> Senhas **nunca** são armazenadas em texto puro — são passadas por `SHA-256` via `crypto.subtle.digest` antes de persistir.

### Diagrama do fluxo

```
                  ┌─────────────────────────────────────┐
                  │   Abertura da aplicação (sempre)    │
                  └────────────────┬────────────────────┘
                                   ▼
                       ┌───────────────────────┐
                       │  /login (Login.jsx)   │
                       └─┬─────────────────┬───┘
                         │                 │
                  clica "Cadastre-se"   submete credenciais
                         │                 │
                         ▼                 ▼
              ┌─────────────────┐   ┌───────────────────────┐
              │ /cadastro       │   │ AuthContext.login()   │
              │  Cadastro.jsx   │   │  busca em tde.users   │
              └────────┬────────┘   │  compara SHA-256      │
                       │            └──────────┬────────────┘
                  register()                   │
                       ▼                       │
              ┌──────────────┐                 │
              │ localStorage │                 │
              │  tde.users   │                 │
              └──────┬───────┘                 │
                     │ navigate('/login')      │ token gerado
                     │ + state.justRegistered  ▼
                     │                  ┌──────────────┐
                     └────────────────► │  tde.auth    │
                                        └──────┬───────┘
                                               ▼
                                  ┌────────────────────────┐
                                  │ ProtectedRoute libera  │
                                  │ MainLayout + páginas   │
                                  └────────────────────────┘
```

### Passo a passo

1. **Abertura da aplicação** — qualquer rota protegida (`/`, `/lista`, `/upload`, etc) sem sessão ativa redireciona para `/login`. **Não há auto-redirect para cadastro** — o usuário decide se já tem conta ou se precisa criar uma.
2. **Cadastro manual** — na tela de login, o botão **Cadastre-se** leva para `/cadastro`. O formulário (`src/pages/Cadastro.jsx`) pede nome, email, usuário, senha e confirmação. Validações no `AuthContext.register()`:
   - Todos os campos obrigatórios e senha com mínimo 4 caracteres
   - Email validado por regex
   - Usuário único (case-insensitive)
   - Senha passa por `SHA-256` → só o `passwordHash` vai pro `localStorage`
   - Após salvar em `tde.users`, **redireciona para `/login`** com um banner verde de sucesso e o campo de usuário já pré-preenchido. O usuário insere a senha e autentica manualmente — não há auto-login.
3. **Login** (`src/pages/Login.jsx`) — `AuthContext.login()` busca o usuário em `tde.users`, calcula o `SHA-256` da senha digitada e compara com o `passwordHash` salvo. Mensagens de erro distinguem **"usuário não encontrado"** de **"senha incorreta"**.
4. **Geração do token de sessão** — após autenticação válida, gera um token base64 (`btoa(\`${username}:${Date.now()}\`)`) e monta o objeto `{ token, user, issuedAt }` em `tde.auth`. Em produção isso viria do servidor (JWT).
5. **Persistência da sessão** — `useEffect` sincroniza o estado `auth` com `tde.auth`. No reload da página, `useState` inicializa lendo essa chave de volta, então **o usuário permanece logado** até clicar em **Sair**.
6. **Rotas protegidas** (`src/components/ProtectedRoute.jsx`) — embrulha o `MainLayout`. Se `isAuthenticated` é `false`, dispara `<Navigate to="/login" />` preservando a rota original em `state.from` para redirecionar de volta após o login.
7. **Injeção do token nas requisições** (`src/services/api.js`) — um `axios.interceptors.request.use(...)` lê `localStorage.tde.auth`, extrai o token e adiciona o header `Authorization: Bearer <token>` automaticamente em toda chamada à API.
8. **Logout** — o botão **Sair** no Header chama `logout()`, que zera o estado e remove apenas `tde.auth` do `localStorage`. Os cadastros (`tde.users`) permanecem, então o usuário pode logar novamente. O `ProtectedRoute` redireciona automaticamente para `/login`.

> O hook `useAuth()` expõe `{ token, user, isAuthenticated, login, register, logout }` para qualquer componente da árvore.

### Como resetar (debug)

No DevTools do navegador → **Application → Local Storage**:
- Apagar `tde.auth` → desloga
- Apagar `tde.users` → volta ao fluxo de primeira abertura (vai pro cadastro)

## 🔌 Integração com API REST

A aplicação consome a **[JSONPlaceholder](https://jsonplaceholder.typicode.com/)** como API REST externa para demonstrar o consumo dinâmico de dados.

**Stack:** `axios` (com instância configurada e interceptor) em `src/services/api.js`.

### Endpoints consumidos

| Operação        | Método | Endpoint        | Origem na UI                     |
|-----------------|--------|-----------------|----------------------------------|
| Listar jobs     | GET    | `/posts?_limit=12` | `Lista.jsx` (botão **Atualizar**) |
| Enviar arquivo  | POST   | `/posts`        | `Upload.jsx` (botão **Enviar**)   |

### Lista dinâmica (`pages/Lista.jsx`)

```jsx
useEffect(() => { loadJobs(); }, [loadJobs]);

const loadJobs = async () => {
  setLoading(true);
  try {
    const data = await fetchJobs();   // GET /posts → transforma em "jobs"
    setJobs(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

O serviço `fetchJobs()` consome `/posts`, e mapeia cada *post* para o domínio do dashboard (nome, status, duração e horário fictícios derivados do `id`) — assim a lista exibida é **dinâmica e vinda da API**, mas continua coerente com o tema de "Jobs de ETL". Estados de **loading**, **erro** e **vazio** são renderizados na própria lista. O botão *Atualizar* refaz a chamada.

### Upload (`pages/Upload.jsx`)

```jsx
const formData = new FormData();
formData.append('file', file);
formData.append('description', description);

await axios.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

* Validação client-side: tipos aceitos (`png`, `jpg`, `webp`, `gif`) e tamanho máximo de **5MB**.
* **Preview imediato** usando `FileReader.readAsDataURL` antes do envio.
* Suporta **drag-and-drop** ou clique no dropzone.
* A resposta da API (eco do JSONPlaceholder) é renderizada num bloco `<pre>` para evidenciar o round-trip HTTP.

## 🧭 Navegação sem Refresh (React Router DOM)

Continua usando `react-router-dom` (v7). A diferença é que agora as rotas **autenticadas** ficam aninhadas dentro de um `<ProtectedRoute>` que envolve o `<MainLayout>`:

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/cadastro" element={<Cadastro />} />
  <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route index element={<Home />} />
    <Route path="lista" element={<Lista />} />
    <Route path="upload" element={<Upload />} />
    ...
  </Route>
</Routes>
```

O `<Outlet />` dentro do `MainLayout` continua sendo o ponto de injeção das páginas filhas, e o `<NavLink>` da Navbar continua trocando rotas instantaneamente no cliente.

## 🎨 Decisões de Estilização

Mantidas do MVP original — CSS puro modular por componente, Grid/Flexbox e variáveis CSS no `:root` para o design system (dark mode). Login, Upload e demais novidades reutilizam as mesmas custom properties (`--accent`, `--status-error`, `--bg-card`, etc.) para manter coesão visual.

## 📦 Dependências adicionadas nesta evolução

| Pacote   | Uso                                                |
|----------|----------------------------------------------------|
| `axios`  | Cliente HTTP — instância em `services/api.js` com interceptor de Authorization |

## ✅ Checklist do TDE

- [x] Consumir API REST (axios) → `services/api.js` + `pages/Lista.jsx`
- [x] Exibir lista de dados dinâmica → `Lista.jsx` (loading, erro, refresh, dados da API)
- [x] Tela de login simulada → `pages/Login.jsx` (com cadastro prévio em `pages/Cadastro.jsx`)
- [x] Armazenar token (localStorage + Context) → `context/AuthContext.jsx` (tde.auth) + usuários cadastrados em `tde.users` com senha SHA-256
- [x] Formulário com envio de imagem → `pages/Upload.jsx`
- [x] Preview antes do envio → `FileReader` + `<img src={preview} />`
