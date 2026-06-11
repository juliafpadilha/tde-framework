import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { createJob } from '../services/api';
import './Upload.css';

const MAX_SIZE_MB = 10;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Upload() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [jobName, setJobName] = useState('');
  const [status, setStatus] = useState('pendente');
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });

  const handleFile = (selected) => {
    setValidationError('');
    if (!selected) return;

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`Arquivo excede ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
  };

  const onChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e) => e.preventDefault();

  const reset = () => {
    setFile(null);
    setJobName('');
    setStatus('pendente');
    setValidationError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!jobName.trim()) {
      setValidationError('O nome do Job é obrigatório.');
      return;
    }

    setSubmitting(true);
    try {
      await createJob({ name: jobName.trim(), status, file });
      setAlertConfig({
        isVisible: true,
        message: 'Job criado com sucesso!',
        type: 'success',
      });
      // Redireciona para a lista após 1.5s
      setTimeout(() => navigate('/lista'), 1500);
    } catch (err) {
      setAlertConfig({
        isVisible: true,
        message: err.message || 'Falha ao criar Job.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <Alert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((p) => ({ ...p, isVisible: false }))}
      />

      <h1 className="page-title">Criar Novo Job</h1>
      <p className="page-subtitle">
        Preencha os dados e anexe o arquivo de configuração/log do Job
      </p>

      <form className="upload-form glass-panel" onSubmit={onSubmit} noValidate>
        {/* Nome do Job */}
        <label className="upload-field">
          <span>Nome do Job *</span>
          <input
            type="text"
            value={jobName}
            onChange={(e) => {
              setJobName(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Ex: Extracao_API_Vendas"
          />
        </label>

        {/* Status */}
        <label className="upload-field">
          <span>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          >
            <option value="pendente">Pendente</option>
            <option value="sucesso">Sucesso</option>
            <option value="erro">Erro</option>
          </select>
        </label>

        {/* Upload de Arquivo */}
        <div
          className={`dropzone ${file ? 'dropzone-has-file' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {file ? (
            <div className="dropzone-empty">
              <span className="dropzone-icon">📄</span>
              <p><strong>{file.name}</strong></p>
              <span className="dropzone-hint">
                {file.type || 'arquivo'} • {formatBytes(file.size)}
              </span>
            </div>
          ) : (
            <div className="dropzone-empty">
              <span className="dropzone-icon">📁</span>
              <p>Clique ou arraste o arquivo de configuração</p>
              <span className="dropzone-hint">
                Qualquer formato • até {MAX_SIZE_MB}MB
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            onChange={onChange}
            hidden
          />
        </div>

        {file && (
          <div className="file-meta">
            <div>
              <strong>{file.name}</strong>
              <span>{file.type || 'arquivo'} • {formatBytes(file.size)}</span>
            </div>
            <button type="button" className="link-btn" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ''; }}>
              Remover
            </button>
          </div>
        )}

        {validationError && <div className="upload-error">{validationError}</div>}

        <div className="upload-actions">
          <button
            type="submit"
            className="upload-submit"
            disabled={submitting}
          >
            {submitting ? 'Criando...' : '➕ Criar Job'}
          </button>
          <button
            type="button"
            className="upload-reset"
            onClick={reset}
            disabled={submitting}
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
