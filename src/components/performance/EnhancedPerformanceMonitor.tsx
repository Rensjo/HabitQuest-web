/**
 * Enhanced Performance Monitor for HabitQuest v4.2.0
 * Integrates with optimized performance store and provides real-time metrics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { usePerformanceStore } from '../../store/optimizedPerformanceStore';

interface EnhancedMetrics {
  renderCount: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  fps: number;
  loadTime: number;
  componentCount: number;
  eventListeners: number;
}

const THRESHOLDS = {
  maxRenderTime: 16,
  maxMemoryUsage: 100 * 1024 * 1024,
  minFPS: 55,
  maxBundleSize: 2 * 1024 * 1024,
  maxComponents: 200,
  maxEventListeners: 50,
};

export const EnhancedPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<EnhancedMetrics>({
    renderCount: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    fps: 60,
    loadTime: 0,
    componentCount: 0,
    eventListeners: 0,
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const performanceStore = usePerformanceStore();

  const trackRealTimeMetrics = useCallback(() => {
    // Memory tracking
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize,
      }));
    }

    // Component count estimation
    const componentCount = document.querySelectorAll('[data-react-component]').length;
    
    // Event listener estimation
    const eventListeners = Object.keys((window as any).__reactEvents || {}).length;

    setMetrics(prev => ({
      ...prev,
      renderCount: performanceStore.renderCount,
      renderTime: performanceStore.lastRenderTime,
      componentCount,
      eventListeners,
    }));
  }, [performanceStore]);

  const generateOptimizedRecommendations = useCallback((currentMetrics: EnhancedMetrics) => {
    const recs: string[] = [];
    
    if (currentMetrics.renderTime > THRESHOLDS.maxRenderTime) {
      recs.push('⚡ Switch to optimized state management (useOptimizedPerformanceStore)');
    }
    
    if (currentMetrics.memoryUsage > THRESHOLDS.maxMemoryUsage) {
      recs.push('🧠 High memory usage detected - check audio pooling and cleanup tray handlers');
    }
    
    if (currentMetrics.fps < THRESHOLDS.minFPS) {
      recs.push('🎬 Enable reduced motion mode or optimize framer-motion usage');
    }
    
    if (currentMetrics.bundleSize > THRESHOLDS.maxBundleSize) {
      recs.push('📦 Use OptimizedLazyComponents for heavy modals and charts');
    }
    
    if (currentMetrics.renderCount > 500) {
      recs.push('🔄 Implement granular state selectors to reduce re-renders');
    }

    if (currentMetrics.componentCount > THRESHOLDS.maxComponents) {
      recs.push('🏗️ Too many components rendered - implement virtualization');
    }

    if (currentMetrics.eventListeners > THRESHOLDS.maxEventListeners) {
      recs.push('🎧 Clean up event listeners - check tray handlers and sound service');
    }
    
    if (recs.length === 0) {
      recs.push('✅ Performance is optimal! Great job using optimized patterns.');
    }
    
    setRecommendations(recs);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      trackRealTimeMetrics();
      generateOptimizedRecommendations(metrics);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isVisible, metrics, trackRealTimeMetrics, generateOptimizedRecommendations]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getHealthColor = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-400' : value > threshold * 0.8 ? 'text-yellow-400' : 'text-red-400';
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-900 bg-opacity-95 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">⚡ Performance Monitor v4.2.0</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        {/* Core Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-400">Renders</div>
            <div className={`text-lg font-bold ${getHealthColor(metrics.renderCount, 300, true)}`}>
              {metrics.renderCount}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400">Render Time</div>
            <div className={`text-lg font-bold ${getHealthColor(metrics.renderTime, THRESHOLDS.maxRenderTime, true)}`}>
              {metrics.renderTime.toFixed(1)}ms
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400">FPS</div>
            <div className={`text-lg font-bold ${getHealthColor(metrics.fps, THRESHOLDS.minFPS)}`}>
              {metrics.fps}
            </div>
          </div>
        </div>

        {/* Memory and Bundle */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-400">Memory</div>
            <div className={`text-sm font-bold ${getHealthColor(metrics.memoryUsage, THRESHOLDS.maxMemoryUsage, true)}`}>
              {formatBytes(metrics.memoryUsage)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400">Bundle</div>
            <div className={`text-sm font-bold ${getHealthColor(metrics.bundleSize, THRESHOLDS.maxBundleSize, true)}`}>
              {formatBytes(metrics.bundleSize)}
            </div>
          </div>
        </div>

        {/* Component Health */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-400">Components</div>
            <div className={`text-sm font-bold ${getHealthColor(metrics.componentCount, THRESHOLDS.maxComponents, true)}`}>
              {metrics.componentCount}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400">Event Listeners</div>
            <div className={`text-sm font-bold ${getHealthColor(metrics.eventListeners, THRESHOLDS.maxEventListeners, true)}`}>
              {metrics.eventListeners}
            </div>
          </div>
        </div>
        
        {/* Optimization Status */}
        <div className="border-t border-gray-700 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-medium">Optimization Status</div>
            <div className={`w-2 h-2 rounded-full ${performanceStore.isOptimized ? 'bg-green-400' : 'bg-red-400'}`}></div>
          </div>
          
          <div className="text-xs text-gray-400">
            Store: {performanceStore.isOptimized ? 'Optimized' : 'Standard'} | 
            Memory: {formatBytes(performanceStore.memoryUsage)}
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="border-t border-gray-700 pt-3">
          <div className="text-xs font-medium mb-2">🎯 Optimization Tips</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {recommendations.map((rec, index) => (
              <div key={index} className="text-xs text-gray-300 p-1 bg-gray-800 rounded">
                {rec}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
          Ctrl+Shift+P to toggle | v4.2.0 Enhanced
        </div>
      </div>
    </div>
  );
};

export default EnhancedPerformanceMonitor;