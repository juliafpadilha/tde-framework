import './JobCard.css';

const API_BASE_URL = 'http://localhost:3000';
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

function resolveFileUrl(fileUrl) {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http')) return fileUrl;
  return `${API_BASE_URL}${fileUrl}`;
}

function isImageFile(fileUrl) {
  const normalized = String(fileUrl || '').toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => normalized.endsWith(ext));
}

function JobCard({ job, onRun, onEdit, isRunning }) {
  const fileUrl = resolveFileUrl(job.file_url);
  const canPreview = isImageFile(job.file_url);
  const creator = job.created_by_name || job.created_by_username || 'Usuario nao identificado';
  const createdAt = job.created_at
    ? new Date(job.created_at).toLocaleString('pt-BR')
    : 'Sem data';

  return (
    <div className={`job-card glass-panel status-${job.status}`}>
      <div className="job-info">
        <h3 className="job-name">{job.name}</h3>
        <span className="job-last-run">Criado em: {createdAt}</span>
        <span className="job-owner">Criado por: {creator}</span>
      </div>

      <div className="job-file">
        {fileUrl ? (
          canPreview ? (
            <a href={fileUrl} target="_blank" rel="noreferrer" className="job-image-link">
              <img src={fileUrl} alt={`Arquivo do job ${job.name}`} className="job-image" />
            </a>
          ) : (
            <a href={fileUrl} target="_blank" rel="noreferrer" className="job-file-link">
              Ver arquivo
            </a>
          )
        ) : (
          <span className="job-file-empty">Sem arquivo</span>
        )}
      </div>

      <div className="job-status-badge">
        <span className="badge-dot"></span>
        <span className="badge-text">{job.status.toUpperCase()}</span>
      </div>

      <div className="job-actions">
        <button
          className="action-btn play"
          title="Ativar job"
          onClick={() => onRun(job)}
          disabled={isRunning}
        >
          {isRunning ? '...' : 'Ativar'}
        </button>
        <button className="action-btn edit" title="Editar job" onClick={() => onEdit(job)}>
          Editar
        </button>
      </div>
    </div>
  );
}

export default JobCard;
