import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name ?? 'Convidado';
  const role = user?.role ?? '—';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header glass-panel">
      <div className="header-left">
        <h2>Orquestrador ETL</h2>
      </div>

      <div className="header-right">
        <div className="notifications">
          <span className="bell-icon">🔔</span>
          <span className="badge">3</span>
        </div>

        <div className="user-profile">
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{role}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} title="Sair">
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;
