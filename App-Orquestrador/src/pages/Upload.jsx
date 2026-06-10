import { useRef, useState } from 'react';
import Alert from '../components/Alert';
import { uploadFile } from '../services/api';
import { validateImageFile, maxLength } from '../services/validators';
import './Upload.css';

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_DESCRIPTION = 280;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Upload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });

  const handleFile = (selected) => {
    setValidationError('');
    setResponse(null);
    if (!selected) return;

    const fileError = validateImageFile(selected, { accepted: ACCEPTED, maxSizeMB: MAX_SIZE_MB });
    if (fileError) {
      setValidationError(fileError);
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selected);
  };

  const onChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e) => e.preventDefault();

  const reset = () => {
    setFile(null);
    setPreview(null);
    setDescription('');
    setValidationError('');
    setResponse(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const submitError =
      validateImageFile(file, { accepted: ACCEPTED, maxSizeMB: MAX_SIZE_MB }) ||
      maxLength(description, MAX_DESCRIPTION, 'Descrição');
    if (submitError) {
      setValidationError(submitError);
      return;
    }

    setSubmitting(true);
    try {
      const data = await uploadFile({ file, description });
      setResponse(data);
      setAlertConfig({
        isVisible: true,
        message: `Upload concluído (id #${data.id ?? '—'}).`,
        type: 'success',
      });
    } catch (err) {
      setAlertConfig({
        isVisible: true,
        message: err.message || 'Falha no upload',
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

      <h1 className="page-title">Upload de Imagem</h1>
      <p className="page-subtitle">
        Envio multipart/form-data via fetch API para a API REST
      </p>

      <form className="upload-form glass-panel" onSubmit={onSubmit} noValidate>
        <div
          className={`dropzone ${preview ? 'dropzone-has-file' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="preview-img" />
          ) : (
            <div className="dropzone-empty">
              <span className="dropzone-icon">🖼️</span>
              <p>Clique ou arraste uma imagem aqui</p>
              <span className="dropzone-hint">
                PNG, JPG, WEBP ou GIF • até {MAX_SIZE_MB}MB
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={onChange}
            hidden
          />
        </div>

        {file && (
          <div className="file-meta">
            <div>
              <strong>{file.name}</strong>
              <span>{file.type} • {formatBytes(file.size)}</span>
            </div>
            <button type="button" className="link-btn" onClick={reset}>
              Remover
            </button>
          </div>
        )}

        <label className="upload-field">
          <span>Descrição (opcional)</span>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Contexto da imagem (ex: print do dashboard)"
            rows={3}
          />
        </label>

        {validationError && <div className="upload-error">{validationError}</div>}

        <div className="upload-actions">
          <button
            type="submit"
            className="upload-submit"
            disabled={submitting || !file}
          >
            {submitting ? 'Enviando...' : 'Enviar imagem'}
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

        {response && (
          <div className="upload-response">
            <strong>Resposta da API:</strong>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
}

export default Upload;
