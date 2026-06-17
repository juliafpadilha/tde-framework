import './StatusCard.css';

function StatusCard({ title, count, type }) {
  const iconMap = {
    success: 'OK',
    error: '!',
    pending: '...',
  };

  return (
    <div className={`status-card glass-panel type-${type}`}>
      <div className="status-header">
        <span className="status-title">{title}</span>
        <span className="status-icon">{iconMap[type]}</span>
      </div>
      <div className="status-body">
        <span className="status-count">{count}</span>
        <span className="status-label">jobs</span>
      </div>
    </div>
  );
}

export default StatusCard;
