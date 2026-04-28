import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} TDE React - Monitoramento de ETL. Feito com CSS Puro e Vite.</p>
        <div className="footer-links">
          <a href="#" className="footer-link">Termos</a>
          <a href="#" className="footer-link">Privacidade</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
