import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateCadastro } from '../services/validators';
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
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Limpa o erro do campo assim que o usuário começa a corrigi-lo.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fieldErrors = validateCadastro(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

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
      <form className="login-card glass-panel" onSubmit={handleSubmit} noValidate>
        <div className="login-brand">
          <div className="logo-icon">ETL</div>
          <h1>DataManager</h1>
        </div>
        <p className="login-subtitle">Crie sua conta para acessar o painel</p>

        <label className="login-field">
          <span>Nome completo</span>
          <input
            type="text"
            className={errors.name ? 'has-error' : ''}
            value={form.name}
            onChange={update('name')}
            placeholder="Mateus Bailo"
            autoComplete="name"
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            className={errors.email ? 'has-error' : ''}
            value={form.email}
            onChange={update('email')}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label className="login-field">
          <span>Usuário</span>
          <input
            type="text"
            className={errors.username ? 'has-error' : ''}
            value={form.username}
            onChange={update('username')}
            placeholder="ex: mateus"
            autoComplete="username"
            aria-invalid={!!errors.username}
          />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </label>

        <label className="login-field">
          <span>Senha</span>
          <input
            type="password"
            className={errors.password ? 'has-error' : ''}
            value={form.password}
            onChange={update('password')}
            placeholder="mínimo 4 caracteres"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label className="login-field">
          <span>Confirmar senha</span>
          <input
            type="password"
            className={errors.confirm ? 'has-error' : ''}
            value={form.confirm}
            onChange={update('confirm')}
            placeholder="repita a senha"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && <span className="field-error">{errors.confirm}</span>}
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
