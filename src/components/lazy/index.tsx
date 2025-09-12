/**
 * ================================================================================================
 * LAZY LOADING COMPONENTS
 * ================================================================================================
 * 
 * Lazy-loaded components for better performance and smaller initial bundle
 * 
 * @version 1.0.0
 */

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// ================================================================================================
// LOADING COMPONENT
// ================================================================================================

const LoadingSpinner = () => (
  <motion.div
    className="flex items-center justify-center p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </motion.div>
);

// ================================================================================================
// LAZY LOADED COMPONENTS
// ================================================================================================

// Modal components (heavy, rarely used)
export const AddHabitModal = lazy(() => import('../modals/AddHabitModal').then(m => ({ default: m.AddHabitModal })));
export const AddRewardModal = lazy(() => import('../modals/AddRewardModal').then(m => ({ default: m.AddRewardModal })));
export const AddCategoryModal = lazy(() => import('../modals/AddCategoryModal').then(m => ({ default: m.AddCategoryModal })));
export const SettingsModal = lazy(() => import('../modals/SettingsModal').then(m => ({ default: m.SettingsModal })));
export const RewardShopModal = lazy(() => import('../modals/RewardShopModal').then(m => ({ default: m.RewardShopModal })));
export const DayInsightsModal = lazy(() => import('../modals/DayInsightsModal').then(m => ({ default: m.DayInsightsModal })));
export const AnalyticsModal = lazy(() => import('../modals/AnalyticsModal').then(m => ({ default: m.AnalyticsModal })));

// Feature components (moderately heavy)
export const ModalSystem = lazy(() => import('../modals/ModalSystem').then(m => ({ default: m.ModalSystem })));
export const NotificationSystem = lazy(() => import('../notifications/NotificationSystem').then(m => ({ default: m.NotificationSystem })));

// Chart components (heavy, only used in analytics)
export const Charts = lazy(() => import('../ui/Charts').then(m => ({ default: m.Charts })));

// ================================================================================================
// LAZY WRAPPER COMPONENT
// ================================================================================================

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <LoadingSpinner /> 
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// ================================================================================================
// PRELOAD FUNCTIONS
// ================================================================================================

// Preload components when user hovers over related buttons
export const preloadModals = () => {
  import('../modals/AddHabitModal');
  import('../modals/AddRewardModal');
  import('../modals/AddCategoryModal');
  import('../modals/SettingsModal');
  import('../modals/RewardShopModal');
  import('../modals/DayInsightsModal');
  import('../modals/AnalyticsModal');
};

export const preloadCharts = () => {
  import('../ui/Charts');
};

// ================================================================================================
// EXPORTS
// ================================================================================================

export {
  LoadingSpinner
};
