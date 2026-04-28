import './StatusCard.css';

function StatusCard({ title, count, type }) {
  // type can be 'success', 'error', 'pending'
  const iconMap = {
    success: '✅',
    error: '❌',
    pending: '⏳'
  };

  return (
    <div className={`status-card glass-panel type-${type}`}>
      <div className="status-header">
        <span className="status-title">{title}</span>
        <span className="status-icon">{iconMap[type]}</span>
      </div>
      <div className="status-body">
        <span className="status-count">{count}</span>
        <span className="status-label">Jobs Totais</span>
      </div>
      <div className="status-footer">
        <span className="trend positive">↑ 12%</span>
        <span className="trend-label">desde ontem</span>
      </div>
    </div>
  );
}

export default StatusCard;
