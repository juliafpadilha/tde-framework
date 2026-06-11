import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/api';
import './Lista.css';

function Lista() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setAlertConfig({
        isVisible: true,
        message: err.message || 'Erro ao carregar jobs.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRunJob = (jobName) => {
    setAlertConfig({
      isVisible: true,
      message: `Job '${jobName}' iniciado com sucesso!`,
      type: 'success'
    });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isVisible: false }));

  return (
    <div className="page-container">
      <Alert 
        isVisible={alertConfig.isVisible} 
        message={alertConfig.message} 
        type={alertConfig.type} 
        onClose={closeAlert} 
      />
      <div className="page-header">
        <div>
          <h1 className="page-title">Jobs de ETL</h1>
          <p className="page-subtitle">Acompanhe as execuções recentes de data pipelines</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="refresh-btn" onClick={() => navigate('/upload')}>
            ➕ Novo Job
          </button>
          <button className="refresh-btn" onClick={loadJobs}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      <div className="jobs-list glass-panel">
        <div className="list-header">
          <span>Nome do Job</span>
          <span style={{textAlign: 'center'}}>Arquivo</span>
          <span style={{textAlign: 'center'}}>Status</span>
          <span style={{textAlign: 'right'}}>Ações</span>
        </div>
        
        <div className="list-body">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              Carregando jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
              Nenhum job encontrado.
            </div>
          ) : (
            jobs.map(job => (
              <JobCard 
                key={job.id}
                name={job.name}
                status={job.status}
                duration={job.file_url ? '📎 Sim' : '—'}
                lastRun={new Date(job.created_at).toLocaleString('pt-BR')}
                onRun={() => handleRunJob(job.name)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Lista;
