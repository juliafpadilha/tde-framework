import { useState } from 'react';
import Alert from '../components/Alert';
import { sendMessage } from '../services/api';
import { validateContato } from '../services/validators';
import './Contato.css';

function Contato() {
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (e) => {
    const { name } = e.target;
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      assunto: formData.get('assunto'),
      mensagem: formData.get('mensagem'),
    };

    const fieldErrors = validateContato(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await sendMessage(values);
      setAlertConfig({
        isVisible: true,
        message: 'Mensagem enviada e salva para o time dev.',
        type: 'success',
      });
      e.target.reset();
    } catch (err) {
      setAlertConfig({
        isVisible: true,
        message: err.message || 'Erro ao enviar mensagem.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
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
      <h1 className="page-title">Contato e Suporte</h1>
      <p className="page-subtitle">Reporte falhas na plataforma ou fale com o time de engenharia</p>

      <div className="contact-wrapper">
        <div className="contact-form-container glass-panel">
          <form className="contact-form" onSubmit={handleSubmit} onChange={handleFieldChange} noValidate>
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Digite seu nome"
                className={errors.nome ? 'has-error' : ''}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail corporativo</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu.nome@empresa.com"
                className={errors.email ? 'has-error' : ''}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="assunto">Assunto</label>
              <select
                id="assunto"
                name="assunto"
                defaultValue=""
                className={errors.assunto ? 'has-error' : ''}
                aria-invalid={!!errors.assunto}
              >
                <option value="" disabled>Selecione uma opcao</option>
                <option value="bug">Reportar bug no dashboard</option>
                <option value="job">Duvida sobre execucao de job</option>
                <option value="sugestao">Sugestao de melhoria</option>
                <option value="reclamacao">Reclamacao</option>
              </select>
              {errors.assunto && <span className="field-error">{errors.assunto}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows="5"
                placeholder="Descreva sua solicitacao em detalhes..."
                className={errors.mensagem ? 'has-error' : ''}
                aria-invalid={!!errors.mensagem}
              ></textarea>
              {errors.mensagem && <span className="field-error">{errors.mensagem}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>

        <div className="contact-info glass-panel">
          <h3>Canal do time dev</h3>
          <p>
            Use este canal para registrar bugs, reclamacoes e sugestoes sobre a plataforma.
          </p>

          <ul className="info-list">
            <li>
              <span className="info-icon">OPS</span>
              <span>Central de operacoes SP</span>
            </li>
            <li>
              <span className="info-icon">@</span>
              <span>data-ops@empresa.com</span>
            </li>
            <li>
              <span className="info-icon">DEV</span>
              <span>Triagem pelo time de engenharia</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contato;
