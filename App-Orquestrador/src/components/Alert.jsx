import { useEffect, useState } from 'react';
import './Alert.css';

function Alert({ message, type, isVisible, onClose }) {
  const [renderBase, setRenderBase] = useState(isVisible);

  // Handle the mounting and unmounting for the CSS fade transition
  useEffect(() => {
    if (isVisible) {
      setRenderBase(true);
      
      // Auto-hide after 5 seconds to improve UX
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // Wait for the fade-out animation to finish before unmounting the DOM node
      const timer = setTimeout(() => {
        setRenderBase(false);
      }, 300); // 300ms matches the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!renderBase) return null;

  // Render varying icon depending on the type of alert
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
