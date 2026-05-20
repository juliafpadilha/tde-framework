import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Cadastro() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password,
      });
      navigate('/login', {
        replace: true,
        state: {
          justRegistered: true,
          username: form.username.trim(),
        },
      });
    } catch (err) {
      setError(err.message || 'Falha ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card glass-panel" onSubmit={handleSubmit}>
        <div className="login-brand">
          <div className="logo-icon">ETL</div>
          <h1>DataManager</h1>
        </div>
        <p className="login-subtitle">Crie sua conta para acessar o painel</p>

        <label className="login-field">
          <span>Nome completo</span>
          <input
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Mateus Bailo"
            autoComplete="name"
            required
          />
        </label>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="login-field">
          <span>Usuário</span>
          <input
            type="text"
            value={form.username}
            onChange={update('username')}
            placeholder="ex: mateus"
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field">
          <span>Senha</span>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="mínimo 4 caracteres"
            autoComplete="new-password"
            required
          />
        </label>

        <label className="login-field">
          <span>Confirmar senha</span>
          <input
            type="password"
            value={form.confirm}
            onChange={update('confirm')}
            placeholder="repita a senha"
            autoComplete="new-password"
            required
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Criar conta'}
        </button>

        <p className="login-hint">
          Já tem uma conta? <Link to="/login" className="login-link">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
