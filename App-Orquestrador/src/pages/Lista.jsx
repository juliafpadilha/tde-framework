import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import JobCard from '../components/JobCard';
import { fetchJobs, runJob, updateJob } from '../services/api';
import './Lista.css';

const INITIAL_FORM = {
  name: '',
  file: null,
};

function Lista() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
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
    const timer = setTimeout(() => {
      loadJobs();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleRunJob = async (job) => {
    setRunningId(job.id);
    try {
      const result = await runJob(job.id);
      await loadJobs();
      setAlertConfig({
        isVisible: true,
        message: `${result.message} Status final: ${result.job.status}.`,
        type: result.job.status === 'sucesso' ? 'success' : 'error',
      });
    } catch (err) {
      setAlertConfig({
        isVisible: true,
        message: err.message || 'Erro ao ativar job.',
        type: 'error',
      });
    } finally {
      setRunningId(null);
    }
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setEditForm({
      name: job.name,
      file: null,
    });
  };

  const closeEdit = () => {
    setEditingJob(null);
    setEditForm(INITIAL_FORM);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setAlertConfig({
        isVisible: true,
        message: 'O nome do job e obrigatorio.',
        type: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      await updateJob(editingJob.id, {
        name: editForm.name.trim(),
        file: editForm.file,
      });
      await loadJobs();
      closeEdit();
      setAlertConfig({
        isVisible: true,
        message: 'Job atualizado com sucesso.',
        type: 'success',
      });
    } catch (err) {
      setAlertConfig({
        isVisible: true,
        message: err.message || 'Erro ao atualizar job.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, isVisible: false }));

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
          <p className="page-subtitle">Acompanhe execucoes, arquivos e responsaveis pelos pipelines</p>
        </div>
        <div className="page-actions">
          <button className="refresh-btn" onClick={() => navigate('/upload')}>
            Novo Job
          </button>
          <button className="refresh-btn" onClick={loadJobs}>
            Atualizar
          </button>
        </div>
      </div>

      <div className="jobs-list glass-panel">
        <div className="list-header">
          <span>Job e usuario</span>
          <span>Imagem/arquivo</span>
          <span>Status</span>
          <span>Acoes</span>
        </div>

        <div className="list-body">
          {loading ? (
            <div className="list-empty">Carregando jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="list-empty">Nenhum job encontrado.</div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onRun={handleRunJob}
                onEdit={openEdit}
                isRunning={runningId === job.id}
              />
            ))
          )}
        </div>
      </div>

      {editingJob && (
        <div className="modal-backdrop" role="presentation">
          <div className="edit-modal glass-panel" role="dialog" aria-modal="true" aria-labelledby="edit-job-title">
            <div className="edit-modal-header">
              <div>
                <h2 id="edit-job-title">Editar job</h2>
                <p>Atualize o nome ou substitua o arquivo enviado.</p>
              </div>
              <button type="button" className="modal-close" onClick={closeEdit} aria-label="Fechar">
                X
              </button>
            </div>

            <form className="edit-form" onSubmit={handleEditSubmit}>
              <label>
                <span>Nome do job</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>

              <label>
                <span>Substituir arquivo/imagem</span>
                <input
                  type="file"
                  onChange={(e) => setEditForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
              </label>

              <div className="edit-actions">
                <button type="button" className="cancel-btn" onClick={closeEdit} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alteracoes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lista;
