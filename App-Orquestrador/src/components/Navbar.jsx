import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">ETL</div>
        <h1>DataManager</h1>
      </div>
      
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/lista" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📋</span>
            Jobs List
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/sobre" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">ℹ️</span>
            Sobre MVP
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/contato" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">✉️</span>
            Contato
          </NavLink>
        </li>
      </ul>
      
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <span className="status-text">System Online</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
