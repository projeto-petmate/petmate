import React, { useState } from 'react';
import './PowerBISettings.css';

const PowerBISettings = ({
  currentInterval,
  onIntervalChange,
  autoRefresh,
  onAutoRefreshToggle,
  showControls,
  onShowControlsToggle,
  onExportData,
  onFullscreen,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const intervalOptions = [
    { value: 60000, label: '1 minuto' },
    { value: 300000, label: '5 minutos' },
    { value: 600000, label: '10 minutos' },
    { value: 900000, label: '15 minutos' },
    { value: 1800000, label: '30 minutos' },
    { value: 3600000, label: '1 hora' }
  ];

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
                  checked={autoRefresh}
                  onChange={(e) => onAutoRefreshToggle(e.target.checked)}
                />
                <span>Atualização automática</span>
              </label>
            </div>

            {autoRefresh && (
              <div className="setting-group">
                <label htmlFor="refresh-interval">Intervalo de atualização:</label>
                <select
                  id="refresh-interval"
                  value={currentInterval}
                  onChange={(e) => onIntervalChange(Number(e.target.value))}
                  className="interval-select"
                >
                  {intervalOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

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