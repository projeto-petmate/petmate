import React, { useState, useCallback } from 'react';
import { usePowerBI } from '../hooks/usePowerBI';
import PowerBISettings from './PowerBISettings';
import './PowerBIDashboard.css';

const PowerBIDashboard = ({
  embedUrl,
  width = '100%',
  height = '600px',
  initialAutoRefreshInterval = 300000, // 5 minutos por padrão
  initialEnableAutoRefresh = true,
  initialShowControls = true,
  className = '',
  onRefresh = null,
  onError = null,
  onLoad = null
}) => {
  // Estados locais para configurações
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(initialAutoRefreshInterval);
  const [enableAutoRefresh, setEnableAutoRefresh] = useState(initialEnableAutoRefresh);
  const [showControls, setShowControls] = useState(initialShowControls);

  // Hook personalizado do Power BI
  const {
    isLoading,
    error,
    lastRefresh,
    timeUntilRefresh,
    iframeUrl,
    handleRefresh,
    handleLoad,
    handleError
  } = usePowerBI({
    embedUrl,
    autoRefreshInterval,
    enableAutoRefresh,
    onRefresh,
    onError,
    onLoad
  });

  // Formatar tempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers para configurações
  const handleIntervalChange = useCallback((newInterval) => {
    setAutoRefreshInterval(newInterval);
  }, []);

  const handleAutoRefreshToggle = useCallback((enabled) => {
    setEnableAutoRefresh(enabled);
  }, []);

  const handleShowControlsToggle = useCallback((show) => {
    setShowControls(show);
  }, []);

  const handleExportData = useCallback(() => {
    // Implementar lógica de exportação se necessário
    console.log('Exportar dados do dashboard');
  }, []);

  const handleFullscreen = useCallback(() => {
    // Implementar tela cheia
    const element = document.querySelector('.powerbi-iframe');
    if (element && element.requestFullscreen) {
      element.requestFullscreen();
    }
  }, []);

  return (
    <div className={`powerbi-dashboard ${className}`}>
      {showControls && (
        <div className="powerbi-controls">
          <div className="control-group">
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              title="Atualizar Dashboard Agora"
            >
              🔄 Atualizar
            </button>
            
            {enableAutoRefresh && (
              <div className="auto-refresh-info">
                <span className="refresh-status">
                  📊 Próxima atualização em: {formatTime(timeUntilRefresh)}
                </span>
              </div>
            )}

            <PowerBISettings
              currentInterval={autoRefreshInterval}
              onIntervalChange={handleIntervalChange}
              autoRefresh={enableAutoRefresh}
              onAutoRefreshToggle={handleAutoRefreshToggle}
              showControls={showControls}
              onShowControlsToggle={handleShowControlsToggle}
              onExportData={handleExportData}
              onFullscreen={handleFullscreen}
            />
          </div>
          
          <div className="last-update">
            Última atualização: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      )}

      <div className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <span>Carregando dashboard...</span>
          </div>
        )}
        
        <iframe
          src={iframeUrl}
          width={width}
          height={height}
          frameBorder="0"
          allowFullScreen={true}
          onLoad={handleLoad}
          onError={handleError}
          title="Power BI Dashboard"
          className="powerbi-iframe"
        />

        {error && (
          <div className="error-overlay">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span>Erro ao carregar dashboard: {error}</span>
              <button 
                className="retry-btn"
                onClick={handleRefresh}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerBIDashboard;