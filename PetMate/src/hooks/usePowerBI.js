import { useState, useEffect, useCallback, useRef } from 'react';

export const usePowerBI = ({
  embedUrl,
  autoRefreshInterval = 300000, // 5 minutos padrão
  enableAutoRefresh = true,
  onRefresh = null,
  onError = null,
  onLoad = null
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(autoRefreshInterval / 1000);
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Função para refresh manual
  const handleRefresh = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      setRefreshKey(prev => prev + 1);
      setLastRefresh(new Date());
      setTimeUntilRefresh(autoRefreshInterval / 1000);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      setError(err.message);
      if (onError) {
        onError(err);
      }
    }
  }, [autoRefreshInterval, onRefresh, onError]);

  // Auto-refresh
  useEffect(() => {
    if (!enableAutoRefresh) return;

    intervalRef.current = setInterval(() => {
      handleRefresh();
    }, autoRefreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableAutoRefresh, autoRefreshInterval, handleRefresh]);

  // Countdown
  useEffect(() => {
    if (!enableAutoRefresh) return;

    countdownRef.current = setInterval(() => {
      setTimeUntilRefresh(prev => {
        if (prev <= 1) {
          return autoRefreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [enableAutoRefresh, autoRefreshInterval]);

  // Handlers
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const handleError = useCallback((err) => {
    setIsLoading(false);
    setError(err.message || 'Erro ao carregar dashboard');
    if (onError) {
      onError(err);
    }
  }, [onError]);

  // URL construída
  const iframeUrl = `${embedUrl}&refresh=${refreshKey}&timestamp=${Date.now()}`;

  return {
    refreshKey,
    isLoading,
    error,
    lastRefresh,
    timeUntilRefresh,
    iframeUrl,
    handleRefresh,
    handleLoad,
    handleError,
    setIsLoading,
    setError
  };
};