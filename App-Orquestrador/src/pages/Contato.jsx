import { useState } from 'react';
import Alert from '../components/Alert';
import { validateContato } from '../services/validators';
import './Contato.css';

function Contato() {
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });
  const [errors, setErrors] = useState({});

  // Limpa o erro de um campo assim que o usuário começa a corrigi-lo.
  const handleFieldChange = (e) => {
    const { name } = e.target;
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = (e) => {
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

    setAlertConfig({
      isVisible: true,
      message: 'Mensagem enviada com sucesso! Esse é apenas um MVP.',
      type: 'success'
    });
    e.target.reset(); // limpa o formulário
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
      <h1 className="page-title">Contato e Suporte</h1>
      <p className="page-subtitle">Reporte falhas na plataforma ou fale com o time de engenharia</p>

      <div className="contact-wrapper">
        <div className="contact-form-container glass-panel">
          <form className="contact-form" onSubmit={handleSubmit} onChange={handleFieldChange} noValidate>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" placeholder="Digite seu nome" className={errors.nome ? 'has-error' : ''} aria-invalid={!!errors.nome} />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail Corporativo</label>
              <input type="email" id="email" name="email" placeholder="seu.nome@empresa.com" className={errors.email ? 'has-error' : ''} aria-invalid={!!errors.email} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="assunto">Assunto</label>
              <select id="assunto" name="assunto" defaultValue="" className={errors.assunto ? 'has-error' : ''} aria-invalid={!!errors.assunto}>
                <option value="" disabled>Selecione uma opção</option>
                <option value="bug">Reportar Bug no Dashboard</option>
                <option value="job">Dúvida sobre execução de Job</option>
                <option value="sugestao">Sugestão de Melhoria</option>
              </select>
              {errors.assunto && <span className="field-error">{errors.assunto}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea id="mensagem" name="mensagem" rows="5" placeholder="Descreva sua solicitação em detalhes..." className={errors.mensagem ? 'has-error' : ''} aria-invalid={!!errors.mensagem}></textarea>
              {errors.mensagem && <span className="field-error">{errors.mensagem}</span>}
            </div>

            <button type="submit" className="submit-btn">Enviar Mensagem</button>
          </form>
        </div>

        <div className="contact-info glass-panel">
          <h3>Informações de Contato</h3>
          <p>O time de engenharia de dados atende de segunda a sexta, em horário comercial.</p>

          <ul className="info-list">
            <li>
              <span className="info-icon">📍</span>
              <span>Central de Operações SP</span>
            </li>
            <li>
              <span className="info-icon">📧</span>
              <span>data-ops@empresa.com</span>
            </li>
            <li>
              <span className="info-icon">📞</span>
              <span>+55 (11) 9999-9999</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contato;
