import React, { useState } from 'react';
import './PowerBISettings.css';

const PowerBISettings = ({
  showControls,
  onShowControlsToggle,
  onExportData,
  onFullscreen,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`powerbi-settings ${className}`}>
      <button 
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Configurações do Dashboard"
      >
        ⚙️ Configurações
      </button>
      
      {isOpen && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>Configurações do Dashboard</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="settings-content">
            <div className="setting-group">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={showControls}
                  onChange={(e) => onShowControlsToggle(e.target.checked)}
                />
                <span>Mostrar controles</span>
              </label>
            </div>

            <div className="setting-actions">
              <button 
                className="action-btn export-btn"
                onClick={onExportData}
                title="Exportar dados (se disponível)"
              >
                📊 Exportar
              </button>
              
              <button 
                className="action-btn fullscreen-btn"
                onClick={onFullscreen}
                title="Visualizar em tela cheia"
              >
                🔍 Tela Cheia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerBISettings;