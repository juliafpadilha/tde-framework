import './Header.css';

function Header() {
  // Simulating user data for the MVP
  const user = { name: 'Admin', role: 'Data Engineer' };

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
          <div className="avatar">{user.name.charAt(0)}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
