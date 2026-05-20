import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      <form className="login-card glass-panel" onSubmit={handleSubmit}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu usuário"
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field">
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
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
