/**
 * ================================================================================================
 * PERFORMANCE MONITORING COMPONENT
 * ================================================================================================
 * 
 * Real-time performance monitoring and optimization suggestions
 * Tracks render times, memory usage, and component performance
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useOptimizedPersistence } from '../../services/optimizedPersistence';

// ================================================================================================
// PERFORMANCE METRICS INTERFACE
// ================================================================================================

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  reRenderCount: number;
  bundleSize: number;
  storageSize: number;
  fps: number;
  lastUpdate: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
}

// ================================================================================================
// PERFORMANCE MONITOR COMPONENT
// ================================================================================================

export const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    reRenderCount: 0,
    bundleSize: 0,
    storageSize: 0,
    fps: 60,
    lastUpdate: Date.now(),
  });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(0);
  const componentCount = useRef(0);
  const reRenderCount = useRef(0);
  const animationFrame = useRef<number>();
  
  const { getStats } = useOptimizedPersistence();

  // ================================================================================================
  // PERFORMANCE MONITORING
  // ================================================================================================

  const measureRenderTime = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderTime = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({
      ...prev,
      renderTime,
      lastUpdate: Date.now(),
    }));

    // Alert for slow renders
    if (renderTime > 16) {
      addAlert('warning', `Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
  }, []);

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage,
      }));

      // Alert for high memory usage
      if (memoryUsage > 100) {
        addAlert('warning', `High memory usage: ${memoryUsage.toFixed(2)}MB`);
      }
    }
  }, []);

  const measureFPS = useCallback(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      
      setMetrics(prev => ({
        ...prev,
        fps,
      }));

      // Alert for low FPS
      if (fps < 30) {
        addAlert('warning', `Low FPS detected: ${fps}`);
      }

      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  }, []);

  const measureStorage = useCallback(() => {
    const stats = getStats();
    setMetrics(prev => ({
      ...prev,
      storageSize: stats.totalSize,
    }));

    // Alert for large storage usage
    if (stats.totalSize > 5 * 1024 * 1024) { // 5MB
      addAlert('info', `Large storage usage: ${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`);
    }
  }, [getStats]);

  // ================================================================================================
  // ALERT SYSTEM
  // ================================================================================================

  const addAlert = useCallback((type: PerformanceAlert['type'], message: string) => {
    const alert: PerformanceAlert = {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: Date.now(),
      resolved: false,
    };

    setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep only last 10 alerts
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  }, []);

  // ================================================================================================
  // MONITORING LOOPS
  // ================================================================================================

  const monitoringLoop = useCallback(() => {
    if (!isMonitoring) return;

    measureMemory();
    measureFPS();
    measureStorage();

    animationFrame.current = requestAnimationFrame(monitoringLoop);
  }, [isMonitoring, measureMemory, measureFPS, measureStorage]);

  // ================================================================================================
  // EFFECTS
  // ================================================================================================

  useEffect(() => {
    if (isMonitoring) {
      monitoringLoop();
    } else if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isMonitoring, monitoringLoop]);

  // ================================================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ================================================================================================

  const optimizePerformance = useCallback(() => {
    // Clear old alerts
    setAlerts(prev => prev.filter(alert => 
      Date.now() - alert.timestamp < 30000 // Keep alerts from last 30 seconds
    ));

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    // Clear unused data
    setMetrics(prev => ({
      ...prev,
      reRenderCount: 0,
    }));

    addAlert('info', 'Performance optimization applied');
  }, [addAlert]);

  // ================================================================================================
  // RENDER
  // ================================================================================================

  if (!isVisible) {
    return (
      <motion.button
        className="fixed bottom-4 right-4 z-50 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        onClick={() => setIsVisible(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Open Performance Monitor"
      >
        <featureIcons.activity className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <featureIcons.activity className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Performance Monitor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isMonitoring 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
          >
            <featureIcons.x className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-3">
        {/* Render Time */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Render Time</span>
          <span className={`text-sm font-medium ${
            metrics.renderTime > 16 ? 'text-red-500' : 
            metrics.renderTime > 8 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>

        {/* Memory Usage */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Memory Usage</span>
          <span className={`text-sm font-medium ${
            metrics.memoryUsage > 100 ? 'text-red-500' : 
            metrics.memoryUsage > 50 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {metrics.memoryUsage.toFixed(2)}MB
          </span>
        </div>

        {/* FPS */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">FPS</span>
          <span className={`text-sm font-medium ${
            metrics.fps < 30 ? 'text-red-500' : 
            metrics.fps < 50 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {metrics.fps}
          </span>
        </div>

        {/* Storage Size */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Storage Size</span>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {(metrics.storageSize / 1024 / 1024).toFixed(2)}MB
          </span>
        </div>

        {/* Re-render Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Re-renders</span>
          <span className={`text-sm font-medium ${
            metrics.reRenderCount > 100 ? 'text-red-500' : 
            metrics.reRenderCount > 50 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {metrics.reRenderCount}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Recent Alerts
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.slice(0, 3).map((alert) => (
              <motion.div
                key={alert.id}
                className={`flex items-center gap-2 p-2 rounded text-xs ${
                  alert.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300' :
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className={`w-2 h-2 rounded-full ${
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="flex-1">{alert.message}</span>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex gap-2">
          <button
            onClick={optimizePerformance}
            className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
          >
            Optimize
          </button>
          <button
            onClick={() => setAlerts([])}
            className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            Clear Alerts
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ================================================================================================
// PERFORMANCE TRACKING HOOK
// ================================================================================================

export const usePerformanceTracking = (componentName: string) => {
  const renderStartTime = useRef(0);
  const renderCount = useRef(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current++;

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      
      if (renderTime > 16) {
        console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCount.current,
    componentName,
  };
};

// ================================================================================================
// EXPORT
// ================================================================================================

export default PerformanceMonitor;
