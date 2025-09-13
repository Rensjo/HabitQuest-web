/**
 * Storage Health Monitoring Utilities
 * Provides comprehensive storage usage analysis and health monitoring
 */

export interface StorageHealth {
  totalUsed: number;
  totalAvailable: number;
  usagePercentage: number;
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
  breakdown: {
    habits: number;
    categories: number;
    progress: number;
    settings: number;
    cache: number;
    other: number;
  };
  recommendations: string[];
  lastUpdated: Date;
}

export interface StorageBreakdown {
  habits: number;
  categories: number;
  progress: number;
  settings: number;
  cache: number;
  other: number;
}

/**
 * Calculate the size of an object in bytes
 */
export function getObjectSize(obj: any): number {
  if (obj === null || obj === undefined) return 0;
  
  const jsonString = JSON.stringify(obj);
  return new Blob([jsonString]).size;
}

/**
 * Get storage usage breakdown from localStorage
 */
export function getStorageBreakdown(): StorageBreakdown {
  const breakdown: StorageBreakdown = {
    habits: 0,
    categories: 0,
    progress: 0,
    settings: 0,
    cache: 0,
    other: 0
  };

  try {
    // Calculate size of each localStorage item
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = localStorage.getItem(key);
      if (!value) continue;

      const size = new Blob([value]).size;

      // Categorize storage usage
      if (key.includes('habit') || key.includes('Habit')) {
        breakdown.habits += size;
      } else if (key.includes('categor') || key.includes('Categor')) {
        breakdown.categories += size;
      } else if (key.includes('progress') || key.includes('Progress') || key.includes('xp') || key.includes('XP')) {
        breakdown.progress += size;
      } else if (key.includes('setting') || key.includes('Setting') || key.includes('theme') || key.includes('Theme')) {
        breakdown.settings += size;
      } else if (key.includes('cache') || key.includes('Cache') || key.includes('temp') || key.includes('Temp')) {
        breakdown.cache += size;
      } else {
        breakdown.other += size;
      }
    }
  } catch (error) {
    console.warn('Error calculating storage breakdown:', error);
  }

  return breakdown;
}

/**
 * Get total storage usage
 */
export function getTotalStorageUsage(): number {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += new Blob([value]).size;
        }
      }
    }
    return total;
  } catch (error) {
    console.warn('Error calculating total storage usage:', error);
    return 0;
  }
}

/**
 * Get estimated available storage (approximation)
 */
export function getEstimatedAvailableStorage(): number {
  // Most browsers allow 5-10MB for localStorage
  // We'll use 8MB as a conservative estimate
  const estimatedMax = 8 * 1024 * 1024; // 8MB in bytes
  const used = getTotalStorageUsage();
  return Math.max(0, estimatedMax - used);
}

/**
 * Calculate storage health status
 */
export function calculateStorageHealth(): StorageHealth {
  const breakdown = getStorageBreakdown();
  const totalUsed = getTotalStorageUsage();
  const totalAvailable = getEstimatedAvailableStorage();
  const totalStorage = totalUsed + totalAvailable;
  const usagePercentage = totalStorage > 0 ? (totalUsed / totalStorage) * 100 : 0;

  let healthStatus: StorageHealth['healthStatus'] = 'excellent';
  const recommendations: string[] = [];

  if (usagePercentage >= 90) {
    healthStatus = 'critical';
    recommendations.push('Storage is critically full! Consider exporting and clearing old data.');
    recommendations.push('Delete unused habits and categories to free up space.');
  } else if (usagePercentage >= 75) {
    healthStatus = 'warning';
    recommendations.push('Storage is getting full. Consider cleaning up old data.');
    recommendations.push('Export your data as a backup before cleaning.');
  } else if (usagePercentage >= 50) {
    healthStatus = 'good';
    recommendations.push('Storage usage is moderate. Regular cleanup recommended.');
  } else {
    healthStatus = 'excellent';
    recommendations.push('Storage usage is healthy. No immediate action needed.');
  }

  // Add specific recommendations based on breakdown
  if (breakdown.cache > breakdown.habits) {
    recommendations.push('Cache usage is high. Consider clearing temporary data.');
  }

  if (breakdown.other > breakdown.habits + breakdown.categories) {
    recommendations.push('Unknown data usage is high. Check for unnecessary stored data.');
  }

  return {
    totalUsed,
    totalAvailable,
    usagePercentage,
    healthStatus,
    breakdown,
    recommendations,
    lastUpdated: new Date()
  };
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get storage health color based on status
 */
export function getStorageHealthColor(status: StorageHealth['healthStatus']): string {
  switch (status) {
    case 'excellent':
      return 'text-green-500 dark:text-green-400';
    case 'good':
      return 'text-blue-500 dark:text-blue-400';
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'critical':
      return 'text-red-500 dark:text-red-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
}

/**
 * Get storage health background color
 */
export function getStorageHealthBgColor(status: StorageHealth['healthStatus']): string {
  switch (status) {
    case 'excellent':
      return 'bg-green-500/10 dark:bg-green-500/20 border-green-500/30 dark:border-green-500/50';
    case 'good':
      return 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 dark:border-blue-500/50';
    case 'warning':
      return 'bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500/30 dark:border-yellow-500/50';
    case 'critical':
      return 'bg-red-500/10 dark:bg-red-500/20 border-red-500/30 dark:border-red-500/50';
    default:
      return 'bg-gray-500/10 dark:bg-gray-500/20 border-gray-500/30 dark:border-gray-500/50';
  }
}

/**
 * Clean up old cache data
 */
export function cleanupCacheData(): number {
  let cleanedBytes = 0;
  
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('cache') || key.includes('temp') || key.includes('tmp'))) {
        const value = localStorage.getItem(key);
        if (value) {
          cleanedBytes += new Blob([value]).size;
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Error cleaning cache data:', error);
  }
  
  return cleanedBytes;
}


