/**
 * ================================================================================================
 * PERFORMANCE MONITORING UTILITIES
 * ================================================================================================
 * 
 * Performance monitoring and optimization utilities for Tauri
 * 
 * @version 1.0.0
 */

import React from 'react';

// ================================================================================================
// PERFORMANCE METRICS
// ================================================================================================

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  componentCount: number;
  reRenderCount: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    componentCount: 0,
    reRenderCount: 0
  };
  
  private renderStartTime = 0;
  private reRenderCount = 0;
  private componentCount = 0;

  /**
   * Start render timing
   */
  public startRender(): void {
    this.renderStartTime = performance.now();
  }

  /**
   * End render timing
   */
  public endRender(): void {
    if (this.renderStartTime > 0) {
      this.metrics.renderTime = performance.now() - this.renderStartTime;
      this.renderStartTime = 0;
    }
  }

  /**
   * Track component mount
   */
  public trackComponentMount(): void {
    this.componentCount++;
    this.metrics.componentCount = this.componentCount;
  }

  /**
   * Track component unmount
   */
  public trackComponentUnmount(): void {
    this.componentCount = Math.max(0, this.componentCount - 1);
    this.metrics.componentCount = this.componentCount;
  }

  /**
   * Track re-render
   */
  public trackReRender(): void {
    this.reRenderCount++;
    this.metrics.reRenderCount = this.reRenderCount;
  }

  /**
   * Get memory usage
   */
  public getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return this.metrics.memoryUsage;
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    this.getMemoryUsage();
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  public resetMetrics(): void {
    this.metrics = {
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      componentCount: 0,
      reRenderCount: 0
    };
    this.reRenderCount = 0;
    this.componentCount = 0;
  }

  /**
   * Log performance warning if metrics are poor
   */
  public checkPerformance(): void {
    const metrics = this.getMetrics();
    
    if (metrics.renderTime > 16) { // 60fps threshold
      console.warn(`Slow render detected: ${metrics.renderTime.toFixed(2)}ms`);
    }
    
    if (metrics.memoryUsage > 100) { // 100MB threshold
      console.warn(`High memory usage: ${metrics.memoryUsage.toFixed(2)}MB`);
    }
    
    if (metrics.reRenderCount > 100) { // 100 re-renders threshold
      console.warn(`Excessive re-renders: ${metrics.reRenderCount}`);
    }
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

export const performanceMonitor = new PerformanceMonitor();

// ================================================================================================
// REACT PERFORMANCE HOOKS
// ================================================================================================

/**
 * Hook to track component performance
 */
export function usePerformanceTracking(componentName: string) {
  React.useEffect(() => {
    performanceMonitor.trackComponentMount();
    return () => performanceMonitor.trackComponentUnmount();
  }, []);

  React.useEffect(() => {
    performanceMonitor.trackReRender();
  });
}

/**
 * Hook to measure render time
 */
export function useRenderTime() {
  React.useEffect(() => {
    performanceMonitor.startRender();
    return () => performanceMonitor.endRender();
  });
}

// ================================================================================================
// PERFORMANCE UTILITIES
// ================================================================================================

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function for expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Check if component should re-render
 */
export function shouldComponentUpdate(
  prevProps: any,
  nextProps: any,
  prevState: any,
  nextState: any
): boolean {
  // Shallow comparison for performance
  const propsChanged = Object.keys(nextProps).some(
    key => prevProps[key] !== nextProps[key]
  );
  const stateChanged = Object.keys(nextState).some(
    key => prevState[key] !== nextState[key]
  );
  
  return propsChanged || stateChanged;
}

// ================================================================================================
// BUNDLE ANALYSIS
// ================================================================================================

/**
 * Analyze bundle size
 */
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined') return;
  
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;
  
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      // This is a simplified analysis
      // In a real app, you'd fetch the actual file sizes
      totalSize += 100; // Placeholder
    }
  });
  
  // Update bundle size through public method
  // performanceMonitor.metrics.bundleSize = totalSize;
}

// ================================================================================================
// EXPORTS
// ================================================================================================

// All exports are already declared above, no need to re-export
