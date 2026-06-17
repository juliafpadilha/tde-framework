import { useEffect } from 'react';
import './Alert.css';

function Alert({ message, type, isVisible, onClose }) {
  useEffect(() => {
    if (!isVisible) return undefined;

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const iconMap = {
    success: 'OK',
    error: '!',
    aviso: '!',
  };

  return (
    <div className={`alert-container alert-${type} alert-visible`}>
      <span className="alert-icon">{iconMap[type] || 'i'}</span>
      <span className="alert-message">{message}</span>
      <button className="alert-close-btn" onClick={onClose} aria-label="Fechar alerta">
        X
      </button>
    </div>
  );
}

export default Alert;
