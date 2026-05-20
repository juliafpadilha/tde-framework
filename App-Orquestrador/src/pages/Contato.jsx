import { useState } from 'react';
import Alert from '../components/Alert';
import './Contato.css';

function Contato() {
  const [alertConfig, setAlertConfig] = useState({ isVisible: false, message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nome = formData.get('nome');
    const email = formData.get('email');
    const assunto = formData.get('assunto');
    const mensagem = formData.get('mensagem');

    if (!nome || !email || !assunto || !mensagem) {
      setAlertConfig({
        isVisible: true,
        message: 'Por favor, preencha todos os campos obrigatórios.',
        type: 'aviso'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAlertConfig({
        isVisible: true,
        message: 'Por favor, insira um e-mail corporativo válido.',
        type: 'erro'
      });
      return;
    }

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
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" required placeholder="Digite seu nome" />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail Corporativo</label>
              <input type="email" id="email" name="email" required placeholder="seu.nome@empresa.com" />
            </div>

            <div className="form-group">
              <label htmlFor="assunto">Assunto</label>
              <select id="assunto" name="assunto" required>
                <option value="" disabled selected>Selecione uma opção</option>
                <option value="bug">Reportar Bug no Dashboard</option>
                <option value="job">Dúvida sobre execução de Job</option>
                <option value="sugestao">Sugestão de Melhoria</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea id="mensagem" name="mensagem" rows="5" required placeholder="Descreva sua solicitação em detalhes..."></textarea>
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
