import StatusCard from '../components/StatusCard';
import './Home.css';

function Home() {
  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard de Monitoramento</h1>
      <p className="page-subtitle">Visão geral do pipeline de processamento de dados</p>
      
      <div className="cards-grid">
        <StatusCard title="Jobs com Sucesso" count="124" type="success" />
        <StatusCard title="Falhas Intermitentes" count="3" type="error" />
        <StatusCard title="Na Fila / Pendentes" count="18" type="pending" />
      </div>

      <div className="dashboard-content">
        <div className="chart-placeholder glass-panel">
          <h3>Evolução de Execuções (Últimos 7 dias)</h3>
          <div className="fake-chart">
            {/* Fake bars for MVP */}
            <div className="bar" style={{height: '60%'}}></div>
            <div className="bar" style={{height: '80%'}}></div>
            <div className="bar" style={{height: '40%'}}></div>
            <div className="bar" style={{height: '90%'}}></div>
            <div className="bar" style={{height: '75%'}}></div>
            <div className="bar" style={{height: '100%'}}></div>
            <div className="bar" style={{height: '85%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
