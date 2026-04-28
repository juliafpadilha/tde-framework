import './JobCard.css';

function JobCard({ name, status, duration, lastRun, onRun }) {
  return (
    <div className={`job-card glass-panel status-${status}`}>
      <div className="job-info">
        <h3 className="job-name">{name}</h3>
        <span className="job-last-run">Última execução: {lastRun}</span>
      </div>
      
      <div className="job-metrics">
        <div className="metric">
          <span className="metric-icon">⏱️</span>
          <span className="metric-value">{duration}</span>
        </div>
      </div>

      <div className="job-status-badge">
        <span className="badge-dot"></span>
        <span className="badge-text">{status.toUpperCase()}</span>
      </div>
      
      <div className="job-actions">
        <button className="action-btn play" title="Executar Novamente" onClick={onRun}>▶️</button>
        <button className="action-btn log" title="Ver Logs">📄</button>
      </div>
    </div>
  );
}

export default JobCard;
