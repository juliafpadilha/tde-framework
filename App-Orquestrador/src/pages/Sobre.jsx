import './Sobre.css';

function Sobre() {
  return (
    <div className="page-container">
      <h1 className="page-title">Sobre a Plataforma</h1>
      <p className="page-subtitle">A mais avançada solução para orquestração de dados</p>

      <div className="about-content glass-panel">
        <div className="about-section">
          <h2>Nossa Missão</h2>
          <p>
            Nossa plataforma foi projetada para simplificar e trazer total controle e visibilidade para pipelines de dados complexos.
            Oferecemos um ecossistema robusto, escalável e intuitivo, permitindo que as equipes de <strong>Engenharia de Dados</strong>
            possam gerenciar fluxos de ETL/ELT com alta previsibilidade e focar na geração de valor.
          </p>
        </div>

        <div className="about-section">
          <h2>Arquitetura de Orquestração</h2>
          <p>
            Construído para alta performance, o sistema permite modelar, agendar e monitorar fluxos de trabalho na forma de grafos direcionados acíclicos (DAGs).
            A plataforma provê tolerância a falhas, gestão nativa de dependências entre tarefas, agendamento cron e uma interface de
            monitoramento em tempo real de execuções.
          </p>
        </div>

        <div className="about-stack">
          <h3>Capacidades Principais</h3>
          <ul className="stack-badges">
            <li className="badge-item">🔄 Orquestração de DAGs</li>
            <li className="badge-item">📈 Monitoramento em Tempo Real</li>
            <li className="badge-item">⚡ Gestão de Dependências</li>
            <li className="badge-item">🛡️ Tolerância a Falhas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
