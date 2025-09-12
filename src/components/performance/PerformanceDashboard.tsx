/**
 * ================================================================================================
 * PERFORMANCE DASHBOARD COMPONENT
 * ================================================================================================
 * 
 * Real-time performance monitoring dashboard for development
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { performanceMonitor } from '../../utils/performance';
import { featureIcons } from '../../utils/icons';

// ================================================================================================
// PERFORMANCE DASHBOARD
// ================================================================================================

interface PerformanceDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible,
  onClose
}) => {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());
  const [isMinimized, setIsMinimized] = useState(false);

  // Update metrics every second
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl shadow-xl"
          animate={{ height: isMinimized ? 'auto' : 'auto' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200/50 dark:border-neutral-700/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <featureIcons.barChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Performance Monitor
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <featureIcons.minimize className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <featureIcons.x className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                className="p-4 space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Render Time */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Render Time
                    </span>
                    <span className={`text-sm font-mono ${
                      metrics.renderTime > 16 ? 'text-red-500' : 
                      metrics.renderTime > 8 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {metrics.renderTime.toFixed(2)}ms
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metrics.renderTime > 16 ? 'bg-red-500' : 
                        metrics.renderTime > 8 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.renderTime / 20) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Memory Usage
                    </span>
                    <span className={`text-sm font-mono ${
                      metrics.memoryUsage > 100 ? 'text-red-500' : 
                      metrics.memoryUsage > 50 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {metrics.memoryUsage.toFixed(1)}MB
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metrics.memoryUsage > 100 ? 'bg-red-500' : 
                        metrics.memoryUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (metrics.memoryUsage / 150) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Component Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Components
                    </span>
                    <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                      {metrics.componentCount}
                    </span>
                  </div>
                </div>

                {/* Re-render Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Re-renders
                    </span>
                    <span className={`text-sm font-mono ${
                      metrics.reRenderCount > 100 ? 'text-red-500' : 
                      metrics.reRenderCount > 50 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {metrics.reRenderCount}
                    </span>
                  </div>
                </div>

                {/* Performance Status */}
                <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      metrics.renderTime > 16 || metrics.memoryUsage > 100 || metrics.reRenderCount > 100
                        ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {metrics.renderTime > 16 || metrics.memoryUsage > 100 || metrics.reRenderCount > 100
                        ? 'Performance Issues Detected' : 'Performance Good'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => performanceMonitor.resetMetrics()}
                    className="flex-1 px-3 py-2 text-xs bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => performanceMonitor.checkPerformance()}
                    className="flex-1 px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                  >
                    Check
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ================================================================================================
// EXPORTS
// ================================================================================================

export default PerformanceDashboard;
