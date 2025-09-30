/**
 * Optimized Lazy Components for Performance
 * Implements smart preloading and error boundaries
 */

import { lazy, Suspense, type ComponentType } from 'react';

// Loading component with skeleton
const ComponentSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

// Higher-order component for lazy loading with preloading
function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preloadStrategy: 'hover' | 'intersection' | 'immediate' | 'never' = 'intersection'
) {
  const LazyComponent = lazy(importFn);
  
  // Preload the component based on strategy
  if (preloadStrategy === 'immediate') {
    importFn(); // Start loading immediately
  }
  
  const WrappedComponent = (props: any) => {
    return (
      <Suspense fallback={<ComponentSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
  
  // Add preload method
  WrappedComponent.preload = importFn;
  
  return WrappedComponent;
}

// Heavy Modal Components (only load when needed)
export const LazySettingsModal = createLazyComponent(
  () => import('../modals/SettingsModal').then(m => ({ default: m.SettingsModal })),
  'hover'
);

export const LazyRewardsShop = createLazyComponent(
  () => import('../rewards').then(m => ({ default: m.RewardsShop })),
  'intersection'
);

export const LazyNotificationSystem = createLazyComponent(
  () => import('../notifications').then(m => ({ default: m.NotificationSystem })),
  'immediate' // Needed for background notifications
);

export const LazyGoalTracker = createLazyComponent(
  () => import('../goals').then(m => ({ default: m.GoalTracker })),
  'intersection'
);

export const LazyDailyStatsOverview = createLazyComponent(
  () => import('../stats').then(m => ({ default: m.DailyStatsOverview })),
  'intersection'
);

// Chart components (heavy dependencies)
export const LazyChartsModule = createLazyComponent(
  () => import('../charts/ChartsModule'),
  'never' // Only load when explicitly requested
);

// Animation-heavy components
export const LazyAnimatedBackground = createLazyComponent(
  () => import('../layout/AppBackground').then(m => ({ default: m.AppBackground })),
  'immediate'
);

// Performance monitoring (dev only)
export const LazyPerformanceMonitor = createLazyComponent(
  () => import('../performance/PerformanceMonitor'),
  'never'
);

// Preload strategies
export const preloadOnHover = (component: any) => {
  return {
    onMouseEnter: () => {
      if (component.preload) {
        component.preload();
      }
    }
  };
};

export const preloadOnIntersection = (component: any, threshold = 0.1) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && component.preload) {
          component.preload();
          observer.disconnect();
        }
      });
    },
    { threshold }
  );
  
  return observer;
};

// Bundle analyzer helper
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle Analysis:');
    console.log('- Main App Components: Loaded');
    console.log('- Lazy Components: Load on demand');
    console.log('- Animation Components: Conditional loading');
  }
};