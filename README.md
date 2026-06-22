# Dashboard de Monitoramento de Jobs de ETL

Projeto academico (TDE) para gerenciamento e monitoramento de Jobs de ETL.

A versao atual do sistema esta dividida em duas partes:

- **Front-end:** SPA em React + Vite, localizada em `App-Orquestrador`.
- **Back-end:** API REST em Node.js + Express, localizada em `backend`.

O front consome a API local do back-end em `http://localhost:3000`, usa autenticacao por JWT, guarda a sessao no `localStorage` e permite cadastrar usuarios, fazer login, listar jobs e criar novos jobs com upload de arquivo.

## Stack

### Front-end

- React
- Vite
- React Router DOM
- Fetch API
- CSS puro por componente

### Back-end

- Node.js
- Express
- PostgreSQL
- JWT (`jsonwebtoken`)
- Bcrypt
- Multer
- CORS
- Dotenv

## Estrutura do projeto

```text
tde-framework/
  App-Orquestrador/        # Front-end React/Vite
    src/
      components/          # Componentes reutilizaveis
      context/             # AuthContext e sessao do usuario
      pages/               # Telas da aplicacao
      services/            # Cliente HTTP, login, cadastro e validadores
  backend/                 # API Node/Express
    src/
      middlewares/         # Middleware de autenticacao JWT
      routes/              # Rotas de auth e jobs
      db.js                # Conexao com PostgreSQL
      server.js            # Entrada da API
    init.sql               # Script de criacao das tabelas e dados iniciais
```

## Funcionalidades atuais

- Cadastro de usuario via API (`POST /register`)
- Login via API (`POST /login`)
- Senha armazenada com hash bcrypt no banco
- Token JWT com validade de 8 horas
- Rotas protegidas no front por `ProtectedRoute`
- Token salvo em `localStorage` na chave `tde.auth`
- Listagem de jobs via API (`GET /jobs`)
- Criacao de jobs via API (`POST /jobs`)
- Edicao de jobs via API (`PUT /jobs/:id`)
- Ativacao de jobs com resultado aleatorio (`POST /jobs/:id/run`)
- Upload de arquivo opcional para jobs
- Exibicao do arquivo/imagem e do usuario criador na lista de jobs
- Arquivos enviados servidos pela API em `/uploads`
- Envio de mensagens para o time dev com persistencia no banco (`POST /messages`)
- Banco PostgreSQL com tabelas `users`, `jobs` e `messages`

## Pre-requisitos

- Node.js instalado
- npm instalado
- PostgreSQL instalado e rodando

## Configuracao do banco

1. Crie um banco PostgreSQL para o projeto. Exemplo:

```sql
CREATE DATABASE tde_etl;
```

2. Execute o script de criacao das tabelas dentro do banco:

```bash
cd backend
psql -U postgres -d tde_etl -f init.sql
```

O arquivo `backend/init.sql` cria:

- tabela `users`
- tabela `jobs`
- tabela `messages`
- alguns jobs iniciais de exemplo

## Configuracao do back-end

Dentro da pasta `backend`, crie um arquivo `.env` com as variaveis de ambiente:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tde_etl
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=troque_esta_chave
```

Ajuste `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `DB_PORT` conforme a configuracao do seu PostgreSQL.

## Como rodar o back-end

Abra um terminal na raiz do repositorio e rode:

```bash
cd backend
npm install
npm start
```

Se tudo estiver correto, a API ficara disponivel em:

```text
http://localhost:3000
```

A rota raiz retorna uma mensagem de status da API.

## Como rodar o front-end

Com o back-end rodando, abra outro terminal na raiz do repositorio e rode:

```bash
cd App-Orquestrador
npm install
npm run dev
```

O Vite mostrara a URL local da aplicacao. Por padrao:

```text
http://localhost:5173
```

## Arquitetura e Detalhes Tecnicos

### Fluxo de Autenticacao (JWT)

A aplicacao utiliza JSON Web Tokens (JWT) para gerenciar o estado da sessao de forma segura e stateless.
1. **Login:** O usuario envia as credenciais (usuario e senha) para a rota `POST /login`.
2. **Geracao do Token:** O back-end (Node.js/Express) valida as credenciais consultando o PostgreSQL (senhas hasheadas com `bcrypt`). Se corretas, ele gera um JWT assinado com a `JWT_SECRET`, contendo o ID e o nome do usuario, com validade de 8 horas.
3. **Armazenamento:** O front-end (React) recebe esse token e o armazena no `localStorage` do navegador sob a chave `tde.auth`.
4. **Requisicoes Protegidas:** Toda vez que o front-end precisa acessar uma rota protegida (ex: `/jobs`), o cliente http em `api.js` resgata o token do `localStorage` e o insere automaticamente no cabecalho HTTP: `Authorization: Bearer <token>`.
5. **Validacao:** No back-end, o `authMiddleware` verifica a assinatura e validade do token em todas as rotas protegidas antes de permitir o acesso.

### Integracao Front-end e API

A comunicacao entre a SPA (Front-end) e a API REST (Back-end) ocorre atraves de requisicoes HTTP:
- **Cliente HTTP Centralizado:** O arquivo `App-Orquestrador/src/services/api.js` funciona como um client em volta da API nativa `fetch`. Ele consolida regras importantes como a url base (`http://localhost:3000`), controle de *timeouts*, injecao automatica de headers de autenticacao e parseamento padronizado de erros e respostas em JSON.
- **Uploads de Arquivos (Multipart):** Para as rotas de criacao e edicao de *jobs* que suportam upload de arquivo, o front-end usa `FormData`. O navegador configura automaticamente os cabecalhos de *multipart/form-data*. No lado do servidor, a biblioteca `multer` intercepta a requisicao, salva o arquivo na pasta `backend/uploads` e armazena o caminho (`file_url`) no banco de dados, para que possa ser servido estaticamente futuramente.

## Fluxo de Navegacao e Uso do Site

O fluxo principal da interface com o usuario foi desenhado para ser simples e intuitivo:

1. **Acesso Inicial:** Ao acessar `http://localhost:5173`, se o usuario nao estiver logado, sera redirecionado para a tela de **Login** (`/login`).
2. **Cadastro:** Novos usuarios devem acessar a tela de **Cadastro** (`/cadastro`) para registrar nome, email, nome de usuario e senha.
3. **Autenticacao:** De volta ao **Login**, ao inserir as credenciais corretas, o usuario e redirecionado para o dashboard principal (rota `/`).
4. **Dashboard Principal (`/`):** Pagina inicial autenticada (Home) que exibe informacoes gerais. Gracas ao componente `MainLayout`, o usuario passa a ver a barra de navegacao lateral ou superior.
5. **Gerenciamento de Jobs:**
   - **Lista (`/lista`):** Exibe todos os jobs criados no sistema, mostrando o status atual, quem o criou e se ha arquivos atrelados. Tambem conta com o botao de "Ativar" para processar o job (gerando Sucesso ou Erro).
   - **Criacao/Upload (`/upload`):** Formulario para a criacao de um novo Job de ETL, onde e possivel dar um nome ao Job e anexar um arquivo opcionalmente.
6. **Outras Paginas:**
   - **Sobre (`/sobre`):** Exibe detalhes sobre a aplicacao.
   - **Contato (`/contato`):** Formulario para envio de mensagens de suporte/feedback direto ao time de desenvolvimento.
7. **Logout:** O usuario pode encerrar a sessao no menu; a acao remove o token armazenado localmente e o redireciona de volta a tela de Login.

## Rotas da API

| Metodo | Rota        | Protegida | Descricao |
|--------|-------------|-----------|-----------|
| GET    | `/`         | Nao       | Health check da API |
| POST   | `/register` | Nao       | Cadastro de usuario |
| POST   | `/login`    | Nao       | Login e geracao de JWT |
| GET    | `/jobs`     | Sim       | Lista os jobs cadastrados |
| POST   | `/jobs`     | Sim       | Cria um job com upload opcional |
| PUT    | `/jobs/:id` | Sim       | Edita nome e arquivo de um job |
| POST   | `/jobs/:id/run` | Sim   | Ativa o job e sorteia sucesso ou erro |
| GET    | `/messages` | Sim       | Lista mensagens enviadas ao time dev |
| POST   | `/messages` | Sim       | Salva mensagens enviadas ao time dev |

As rotas protegidas esperam o header:

```text
Authorization: Bearer <token>
```

O front adiciona esse header automaticamente a partir da sessao salva em `localStorage`.

## Uploads

O back-end cria automaticamente a pasta `backend/uploads` ao iniciar, caso ela nao exista.

Quando um job e criado com arquivo, o Multer salva o arquivo nessa pasta e grava o caminho relativo no campo `file_url` da tabela `jobs`.

## Scripts disponiveis

### Back-end (`backend/package.json`)

```bash
npm start
```

Inicia a API Express em `src/server.js`.

### Front-end (`App-Orquestrador/package.json`)

```bash
npm run dev
```

Inicia o servidor de desenvolvimento do Vite.

```bash
npm run build
```

Gera a build de producao.

```bash
npm run preview
```

Serve localmente a build gerada.

```bash
npm run lint
```

Executa o ESLint no projeto front-end.

## Observacoes

- O front-end esta configurado para consumir a API em `http://localhost:3000` no arquivo `App-Orquestrador/src/services/api.js`.
- O back-end precisa estar rodando antes de usar login, cadastro, lista e upload no front.
- O token expira em 8 horas, conforme definido em `backend/src/routes/authRoutes.js`.
- Em bancos ja criados antes desta versao, execute `backend/migrations/001_create_messages.sql` antes de usar o formulario de contato.
- Para deslogar manualmente durante testes, remova a chave `tde.auth` do `localStorage` do navegador.
