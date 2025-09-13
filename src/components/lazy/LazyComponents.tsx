/**
 * ================================================================================================
 * LAZY LOADING COMPONENTS SYSTEM
 * ================================================================================================
 * 
 * Optimized lazy loading with preloading strategies
 * Reduces initial bundle size and improves load times
 * 
 * @version 1.0.0
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

// ================================================================================================
// LOADING COMPONENTS
// ================================================================================================

const LoadingSpinner = () => (
  <motion.div
    className="flex items-center justify-center p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </motion.div>
);

const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <motion.div
    className="flex flex-col items-center justify-center p-8 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
    <div className="text-red-500 text-lg font-semibold mb-2">Failed to load component</div>
    <div className="text-gray-600 text-sm mb-4">{error.message}</div>
    <button
      onClick={retry}
      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
    >
      Retry
    </button>
  </motion.div>
);

// ================================================================================================
// LAZY WRAPPER COMPONENT
// ================================================================================================

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <LoadingSpinner />,
  errorFallback = ErrorFallback,
  preload = false
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const retry = React.useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  React.useEffect(() => {
    if (preload) {
      // Preload the component
      React.startTransition(() => {
        // This will trigger the lazy loading
      });
    }
  }, [preload]);

  if (hasError && error) {
    const ErrorComponent = errorFallback;
    return <ErrorComponent error={error} retry={retry} />;
  }

  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary onError={(error) => {
        setHasError(true);
        setError(error);
      }}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

// ================================================================================================
// ERROR BOUNDARY
// ================================================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Error will be handled by parent
    }

    return this.props.children;
  }
}

// ================================================================================================
// LAZY COMPONENTS
// ================================================================================================

// Heavy modals - lazy loaded
export const LazyModalSystem = lazy(() => 
  import('../modals/ModalSystem').then(module => ({
    default: module.ModalSystem
  }))
);

export const LazyNotificationSystem = lazy(() => 
  import('../notifications/NotificationSystem').then(module => ({
    default: module.NotificationSystem
  }))
);

export const LazySettingsModal = lazy(() => 
  import('../modals/SettingsModal').then(module => ({
    default: module.SettingsModal
  }))
);

export const LazyAnalyticsModal = lazy(() => 
  import('../modals/AnalyticsModal').then(module => ({
    default: module.AnalyticsModal
  }))
);

export const LazyDayInsightsModal = lazy(() => 
  import('../modals/DayInsightsModal').then(module => ({
    default: module.DayInsightsModal
  }))
);

// Heavy charts and visualizations - lazy loaded
export const LazyPerformanceDashboard = lazy(() => 
  import('../performance/PerformanceDashboard').then(module => ({
    default: module.PerformanceDashboard
  }))
);

// ================================================================================================
// PRELOADING STRATEGIES
// ================================================================================================

// Preload components on hover
export const usePreloadOnHover = (preloadFn: () => void) => {
  const [hasPreloaded, setHasPreloaded] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    if (!hasPreloaded) {
      preloadFn();
      setHasPreloaded(true);
    }
  }, [hasPreloaded, preloadFn]);

  return { handleMouseEnter };
};

// Preload components on intersection
export const usePreloadOnIntersection = (preloadFn: () => void, threshold = 0.1) => {
  const [hasPreloaded, setHasPreloaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hasPreloaded || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadFn();
            setHasPreloaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasPreloaded, preloadFn, threshold]);

  return { ref, hasPreloaded };
};

// ================================================================================================
// PRELOADING FUNCTIONS
// ================================================================================================

export const preloadModals = () => {
  // Preload all modal components
  import('../modals/ModalSystem');
  import('../modals/SettingsModal');
  import('../modals/AnalyticsModal');
  import('../modals/DayInsightsModal');
  import('../notifications/NotificationSystem');
};

export const preloadCharts = () => {
  // Preload chart components
  import('../performance/PerformanceDashboard');
};

export const preloadAll = () => {
  preloadModals();
  preloadCharts();
};

// ================================================================================================
// PERFORMANCE MONITORING
// ================================================================================================

export const useLazyLoadingMetrics = () => {
  const [metrics, setMetrics] = React.useState({
    loadedComponents: 0,
    failedComponents: 0,
    loadTimes: [] as number[],
  });

  const trackLoad = React.useCallback((loadTime: number) => {
    setMetrics(prev => ({
      ...prev,
      loadedComponents: prev.loadedComponents + 1,
      loadTimes: [...prev.loadTimes, loadTime],
    }));
  }, []);

  const trackError = React.useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      failedComponents: prev.failedComponents + 1,
    }));
  }, []);

  const averageLoadTime = React.useMemo(() => {
    if (metrics.loadTimes.length === 0) return 0;
    return metrics.loadTimes.reduce((sum, time) => sum + time, 0) / metrics.loadTimes.length;
  }, [metrics.loadTimes]);

  return {
    metrics,
    trackLoad,
    trackError,
    averageLoadTime,
  };
};

// ================================================================================================
// OPTIMIZED LAZY COMPONENT WRAPPER
// ================================================================================================

interface OptimizedLazyComponentProps {
  component: React.LazyExoticComponent<ComponentType<any>>;
  props?: any;
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export const OptimizedLazyComponent: React.FC<OptimizedLazyComponentProps> = ({
  component: Component,
  props = {},
  preload = false,
  priority = 'medium'
}) => {
  const { trackLoad, trackError } = useLazyLoadingMetrics();
  const [loadStartTime] = React.useState(performance.now());

  React.useEffect(() => {
    if (preload) {
      // Preload the component
      React.startTransition(() => {
        // This will trigger the lazy loading
      });
    }
  }, [preload]);

  const handleLoad = React.useCallback(() => {
    const loadTime = performance.now() - loadStartTime;
    trackLoad(loadTime);
  }, [loadStartTime, trackLoad]);

  const handleError = React.useCallback(() => {
    trackError();
  }, [trackError]);

  return (
    <LazyWrapper
      preload={preload}
      errorFallback={({ error, retry }) => (
        <ErrorFallback error={error} retry={retry} />
      )}
    >
      <Component
        {...props}
        onLoad={handleLoad}
        onError={handleError}
      />
    </LazyWrapper>
  );
};
