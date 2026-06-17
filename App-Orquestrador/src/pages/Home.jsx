import { useEffect, useState } from 'react';
import StatusCard from '../components/StatusCard';
import { fetchJobs } from '../services/api';
import './Home.css';

const EMPTY_COUNTS = {
  sucesso: 0,
  erro: 0,
  pendente: 0,
};

function countJobsByStatus(jobs) {
  return jobs.reduce((acc, job) => {
    if (job.status === 'sucesso') acc.sucesso += 1;
    if (job.status === 'erro') acc.erro += 1;
    if (job.status === 'pendente') acc.pendente += 1;
    return acc;
  }, { ...EMPTY_COUNTS });
}

function Home() {
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      try {
        const jobs = await fetchJobs();
        if (active) setCounts(countJobsByStatus(jobs));
      } catch {
        if (active) setCounts(EMPTY_COUNTS);
      } finally {
        if (active) setLoading(false);
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const displayCounts = loading
    ? { sucesso: '...', erro: '...', pendente: '...' }
    : counts;

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard de Monitoramento</h1>
      <p className="page-subtitle">Visao geral do pipeline de processamento de dados</p>

      <div className="cards-grid">
        <StatusCard title="Jobs com Sucesso" count={displayCounts.sucesso} type="success" />
        <StatusCard title="Falhas Intermitentes" count={displayCounts.erro} type="error" />
        <StatusCard title="Na Fila / Pendentes" count={displayCounts.pendente} type="pending" />
      </div>

      <div className="dashboard-content">
        <div className="chart-placeholder glass-panel">
          <h3>Evolucao de Execucoes (Ultimos 7 dias)</h3>
          <div className="fake-chart">
            <div className="bar" style={{ height: '60%' }}></div>
            <div className="bar" style={{ height: '80%' }}></div>
            <div className="bar" style={{ height: '40%' }}></div>
            <div className="bar" style={{ height: '90%' }}></div>
            <div className="bar" style={{ height: '75%' }}></div>
            <div className="bar" style={{ height: '100%' }}></div>
            <div className="bar" style={{ height: '85%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
