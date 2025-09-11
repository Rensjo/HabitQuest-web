import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function Progress({ 
  value, 
  max = 100, 
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  className = ''
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        {animated ? (
          <motion.div
            className={`h-full rounded-full ${variantClasses[variant]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-300 ${variantClasses[variant]}`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}
