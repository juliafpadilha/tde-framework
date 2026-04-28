# Dashboard de Monitoramento de Jobs de ETL

Este é um projeto acadêmico (TDE) que demonstra a construção de um dashboard em fluxo de Single Page Application (SPA), desenvolvido em React. A proposta original foca na criação de uma interface de usuário minimalista, moderna e sem depender de bibliotecas de CSS (frameworks).

Vite foi utilizado para compilar o projeto e empacotar a aplicação de forma extremamente rápida.

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

## 📂 Organização da Arquitetura

O projeto foi organizado separando os blocos fundamentais para facilitar a manutenção e legibilidade do código:

```text
src/
 ┣ components/               # Componentes reutilizáveis
 ┃ ┣ Footer.jsx/.css
 ┃ ┣ Header.jsx/.css
 ┃ ┣ JobCard.jsx/.css        # Card/Item usado na lista
 ┃ ┣ MainLayout.jsx/.css     # Layout base que embrulha as rotas
 ┃ ┣ Navbar.jsx/.css         # Menu lateral
 ┃ ┗ StatusCard.jsx/.css     # Card de resumo (usado na Home)
 ┣ pages/                    # Telas/Páginas completas
 ┃ ┣ Contato.jsx/.css
 ┃ ┣ Home.jsx/.css
 ┃ ┣ Lista.jsx/.css          # Lista de jobs que instancia JobCard
 ┃ ┗ Sobre.jsx/.css
 ┣ App.jsx                   # Apenas definição de ROTAS!
 ┣ main.jsx                  # Entry point da aplicação e render inicial
 ┗ index.css                 # Paleta de cores, classes globais e CSS base
```

## 🔄 Navegação sem Refresh (React Router DOM)

Este MVP utiliza a biblioteca `react-router-dom` (v6) para permitir transições instântaneas entre as abas sem realizar o recarregamento total da página (page reload). 

**Como isso funciona na prática?**

1. **Definição de Rotas:** O arquivo `App.jsx` define o `<Routes>`. Ali registramos caminhos de URL (ex: `/`, `/lista`), e os mapeamos para os componentes renderizados (nossas *pages*).
2. **MainLayout e Outlet:** Utilizamos um componente roteador Pai chamado `MainLayout`. O `<Outlet />` (do React Router) serve como um *placeholder* onde as páginas filhas serão injetadas dinamicamente mantendo Menu e Header sempre fixos.
3. **Menu Lateral (NavLink):** Dentro de `Navbar.jsx`, em vez de usarmos a tag nativa de links HTML (`<a href="...">`), utilizamos o componente `<NavLink to="...">`. Quando os cliques ocorrem, o React intercepta esse evento, altera o URL da página e renderiza o novo componente dinamicamente sem realizar interações remotas no servidor. A página é substituida instantaneamente no lado do cliente.

## 🎨 Decisões de Estilização

Todas as propriedades visuais foram construídas com arquivos `.css` puros em módulos locais por componente para manter escopo, isolamento e facilidade de depuração da interface.

* **CSS Grid / Flexbox:** Utilizado extensamente na Home Layout para alinhamento rápido e responsivo.
* **Sistema de Variáveis CSS:** Empregamos um design system simples e coeso em `index.css` via custom properties (`:root { --bg-primary ... }`) para gerenciar as paletas (Dark Mode) de forma atômica e limpa.
