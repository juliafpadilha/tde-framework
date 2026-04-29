import './Sobre.css';

function Sobre() {
  return (
    <div className="page-container">
      <h1 className="page-title">Sobre o Projeto</h1>
      <p className="page-subtitle">Informações sobre o Minimum Viable Product</p>
      
      <div className="about-content glass-panel">
        <div className="about-section">
          <h2>Propósito</h2>
          <p>
            Este sistema foi desenvolvido como um Trabalho Discente Efetivo (TDE) acadêmico,
            com o objetivo de consolidar os conhecimentos em <strong>React, SPA e React Router DOM v6</strong>.
            A aplicação funciona como um <em>Dashboard Executivo</em> para operações de Engenharia de Dados.
          </p>
        </div>

        <div className="about-section">
          <h2>Arquitetura e MVP</h2>
          <p>
            Esta versão se trata de um Minimum Viable Product (MVP) focado exclusivamente na camada de visualização (Front-end).
            Nenhum framework de CSS (como Bootstrap ou Tailwind) foi utilizado. A estilização foi construída 
            totalmente do zero através de <strong>CSS Puro</strong>.
          </p>
        </div>

        <div className="about-stack">
          <h3>Tecnologias Utilizadas</h3>
          <ul className="stack-badges">
            <li className="badge-item">⚛️ React</li>
            <li className="badge-item">🚦 React Router v6</li>
            <li className="badge-item">⚡ Vite</li>
            <li className="badge-item">🎨 CSS 3 (Puro)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
