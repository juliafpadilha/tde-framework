import { useState } from 'react';
import Alert from '../components/Alert';
import JobCard from '../components/JobCard';
import './Lista.css';

function Lista() {
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });

  const handleRunJob = (jobName) => {
    setAlertConfig({
      isVisible: true,
      message: `Job '${jobName}' iniciado com sucesso!`,
      type: 'success'
    });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isVisible: false }));
  const jobsData = [
    { id: 1, name: 'Extracao_API_Vendas', status: 'sucesso', duration: '05m 12s', lastRun: 'Hoje, 08:00' },
    { id: 2, name: 'Carga_DWH_Fato_Vendas', status: 'sucesso', duration: '12m 45s', lastRun: 'Hoje, 08:30' },
    { id: 3, name: 'Normalizacao_Dados_Clientes', status: 'erro', duration: '01m 22s', lastRun: 'Hoje, 09:15' },
    { id: 4, name: 'Ingestao_Logs_Servidor', status: 'pendente', duration: '--', lastRun: 'Aguardando' },
    { id: 5, name: 'Calculo_Metricas_Mensais', status: 'sucesso', duration: '45m 00s', lastRun: 'Ontem, 23:00' },
  ];

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
        <button className="refresh-btn">🔄 Atualizar</button>
      </div>

      <div className="jobs-list glass-panel">
        <div className="list-header">
          <span>Nome do Job</span>
          <span style={{textAlign: 'center'}}>Duração</span>
          <span style={{textAlign: 'center'}}>Status</span>
          <span style={{textAlign: 'right'}}>Ações</span>
        </div>
        
        <div className="list-body">
          {jobsData.map(job => (
            <JobCard 
              key={job.id}
              name={job.name}
              status={job.status}
              duration={job.duration}
              lastRun={job.lastRun}
              onRun={() => handleRunJob(job.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lista;
