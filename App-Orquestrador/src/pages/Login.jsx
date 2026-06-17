import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { validateLogin } from '../services/validators';
import './Login.css';

function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const justRegistered = location.state?.justRegistered;
  const prefillUsername = location.state?.username ?? '';

  const [username, setUsername] = useState(prefillUsername);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  // Limpa o erro de um campo assim que o usuário começa a corrigi-lo.
  const clearFieldError = (field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fieldErrors = validateLogin({ username, password });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Falha ao autenticar');
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
        <p className="login-subtitle">Acesso ao painel de orquestração</p>

        {justRegistered && (
          <div className="login-success">
            ✅ Cadastro concluído! Faça login com suas credenciais.
          </div>
        )}

        <label className="login-field">
          <span>Usuário</span>
          <input
            type="text"
            className={errors.username ? 'has-error' : ''}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearFieldError('username');
            }}
            placeholder="seu usuário"
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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError('password');
            }}
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>

        <Link to="/cadastro" className="login-register-btn">
          Cadastre-se
        </Link>
      </form>
    </div>
  );
}

export default Login;
