import { useEffect, useState } from 'react';
import './Alert.css';

function Alert({ message, type, isVisible, onClose }) {
  const [renderBase, setRenderBase] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setRenderBase(true);
    
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setRenderBase(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!renderBase) return null;

  const getIcon = () => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'aviso': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`alert-container alert-${type} ${isVisible ? 'alert-visible' : 'alert-hidden'}`}>
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      <button className="alert-close-btn" onClick={onClose} aria-label="Fechar alerta">
        X
      </button>
    </div>
  );
}

export default Alert;
