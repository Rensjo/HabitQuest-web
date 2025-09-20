/**
 * ================================================================================================
 * OPTIMIZED PERSISTENCE SYSTEM
 * ================================================================================================
 * 
 * High-performance data persistence with debouncing and batching
 * Prevents UI blocking and reduces I/O operations
 * 
 * @version 1.0.0
 */

import { debounce, throttle } from 'lodash-es';

// ================================================================================================
// PERSISTENCE CONFIGURATION
// ================================================================================================

const PERSISTENCE_CONFIG = {
  // Debounce delay for auto-save
  DEBOUNCE_DELAY: 1000, // 1 second
  
  // Throttle delay for frequent updates
  THROTTLE_DELAY: 500, // 0.5 seconds
  
  // Batch save interval
  BATCH_INTERVAL: 5000, // 5 seconds
  
  // Maximum batch size
  MAX_BATCH_SIZE: 100,
  
  // Storage keys
  STORAGE_KEYS: {
    HABITS: 'habitquest_habits',
    POINTS: 'habitquest_points',
    XP: 'habitquest_xp',
    GOALS: 'habitquest_goals',
    SHOP: 'habitquest_shop',
    INVENTORY: 'habitquest_inventory',
    CATEGORIES: 'habitquest_categories',
    SETTINGS: 'habitquest_settings',
    UI_STATE: 'habitquest_ui_state',
  },
  
  // Compression settings
  COMPRESSION_ENABLED: true,
  COMPRESSION_THRESHOLD: 1024, // 1KB
};

// ================================================================================================
// STORAGE INTERFACE
// ================================================================================================

interface StorageItem {
  key: string;
  data: any;
  timestamp: number;
  version: string;
  compressed?: boolean;
}

interface BatchOperation {
  key: string;
  data: any;
  operation: 'set' | 'delete';
  timestamp: number;
}

// ================================================================================================
// PERSISTENCE MANAGER
// ================================================================================================

class OptimizedPersistenceManager {
  private batchQueue: BatchOperation[] = [];
  private saveQueue: Map<string, any> = new Map();
  private isProcessing = false;
  private batchTimer: number | null = null;
  private version = '4.1.2.0';

  constructor() {
    this.initializeBatchProcessing();
  }

  // ================================================================================================
  // INITIALIZATION
  // ================================================================================================

  private initializeBatchProcessing() {
    // Process batch queue every 5 seconds
    this.batchTimer = setInterval(() => {
      this.processBatchQueue();
    }, PERSISTENCE_CONFIG.BATCH_INTERVAL);
  }

  // ================================================================================================
  // CORE PERSISTENCE METHODS
  // ================================================================================================

  /**
   * Save data with debouncing
   */
  public save(key: string, data: any, immediate = false): void {
    if (immediate) {
      this.saveImmediate(key, data);
      return;
    }

    // Add to save queue
    this.saveQueue.set(key, data);

    // Debounced save
    this.debouncedSave();
  }

  /**
   * Save data immediately (bypasses debouncing)
   */
  public saveImmediate(key: string, data: any): void {
    try {
      const item: StorageItem = {
        key,
        data,
        timestamp: Date.now(),
        version: this.version,
        compressed: this.shouldCompress(data),
      };

      const serialized = this.serialize(item);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      this.handleStorageError(error, key, data);
    }
  }

  /**
   * Load data from storage
   */
  public load<T>(key: string, defaultValue: T): T {
    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) return defaultValue;

      const item: StorageItem = JSON.parse(serialized);
      
      // Check version compatibility
      if (!this.isVersionCompatible(item.version)) {
        console.warn(`Version mismatch for ${key}: stored=${item.version}, current=${this.version}`);
        return defaultValue;
      }

      return item.compressed ? this.decompress(item.data) : item.data;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Delete data from storage
   */
  public delete(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to delete ${key}:`, error);
    }
  }

  /**
   * Clear all app data
   */
  public clearAll(): void {
    try {
      Object.values(PERSISTENCE_CONFIG.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  // ================================================================================================
  // BATCH OPERATIONS
  // ================================================================================================

  /**
   * Add operation to batch queue
   */
  public addToBatch(key: string, data: any, operation: 'set' | 'delete' = 'set'): void {
    this.batchQueue.push({
      key,
      data,
      operation,
      timestamp: Date.now(),
    });

    // Process if batch is full
    if (this.batchQueue.length >= PERSISTENCE_CONFIG.MAX_BATCH_SIZE) {
      this.processBatchQueue();
    }
  }

  /**
   * Process batch queue
   */
  private processBatchQueue(): void {
    if (this.isProcessing || this.batchQueue.length === 0) return;

    this.isProcessing = true;
    const operations = [...this.batchQueue];
    this.batchQueue = [];

    try {
      operations.forEach(({ key, data, operation }) => {
        if (operation === 'set') {
          this.saveImmediate(key, data);
        } else {
          this.delete(key);
        }
      });
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // ================================================================================================
  // DEBOUNCED SAVE
  // ================================================================================================

  private debouncedSave = debounce(() => {
    this.saveQueue.forEach((data, key) => {
      this.saveImmediate(key, data);
    });
    this.saveQueue.clear();
  }, PERSISTENCE_CONFIG.DEBOUNCE_DELAY);

  // ================================================================================================
  // SERIALIZATION
  // ================================================================================================

  private serialize(item: StorageItem): string {
    if (item.compressed) {
      item.data = this.compress(item.data);
    }
    return JSON.stringify(item);
  }

  private deserialize<T>(serialized: string): StorageItem {
    return JSON.parse(serialized);
  }

  // ================================================================================================
  // COMPRESSION
  // ================================================================================================

  private shouldCompress(data: any): boolean {
    if (!PERSISTENCE_CONFIG.COMPRESSION_ENABLED) return false;
    
    const serialized = JSON.stringify(data);
    return serialized.length > PERSISTENCE_CONFIG.COMPRESSION_THRESHOLD;
  }

  private compress(data: any): string {
    // Simple compression using base64 encoding
    // In production, consider using a proper compression library like pako
    const serialized = JSON.stringify(data);
    return btoa(serialized);
  }

  private decompress(compressed: string): any {
    try {
      const decompressed = atob(compressed);
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Decompression failed:', error);
      return null;
    }
  }

  // ================================================================================================
  // VERSION COMPATIBILITY
  // ================================================================================================

  private isVersionCompatible(storedVersion: string): boolean {
    // Simple version comparison
    const current = this.version.split('.').map(Number);
    const stored = storedVersion.split('.').map(Number);
    
    // Major version must match
    return current[0] === stored[0];
  }

  // ================================================================================================
  // ERROR HANDLING
  // ================================================================================================

  private handleStorageError(error: any, key: string, data: any): void {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, attempting cleanup...');
      this.cleanupOldData();
      
      // Retry save after cleanup
      setTimeout(() => {
        this.saveImmediate(key, data);
      }, 100);
    } else {
      console.error(`Storage error for ${key}:`, error);
    }
  }

  private cleanupOldData(): void {
    try {
      // Remove old data to free up space
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('habitquest_')) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              const age = Date.now() - parsed.timestamp;
              
              // Remove data older than 30 days
              if (age > 30 * 24 * 60 * 60 * 1000) {
                keysToRemove.push(key);
              }
            } catch {
              // Remove invalid data
              keysToRemove.push(key);
            }
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleaned up ${keysToRemove.length} old items`);
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  // ================================================================================================
  // PERFORMANCE MONITORING
  // ================================================================================================

  public getStorageStats(): {
    totalSize: number;
    itemCount: number;
    compressionRatio: number;
  } {
    let totalSize = 0;
    let itemCount = 0;
    let compressedSize = 0;
    let uncompressedSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('habitquest_')) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
          itemCount++;
          
          try {
            const parsed = JSON.parse(item);
            if (parsed.compressed) {
              compressedSize += item.length;
            } else {
              uncompressedSize += item.length;
            }
          } catch {
            // Skip invalid items
          }
        }
      }
    }

    return {
      totalSize,
      itemCount,
      compressionRatio: compressedSize > 0 ? uncompressedSize / compressedSize : 1,
    };
  }

  // ================================================================================================
  // CLEANUP
  // ================================================================================================

  public destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
    
    // Process remaining batch operations
    this.processBatchQueue();
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

export const persistenceManager = new OptimizedPersistenceManager();

// ================================================================================================
// REACT HOOK
// ================================================================================================

export const useOptimizedPersistence = () => {
  return {
    save: persistenceManager.save.bind(persistenceManager),
    load: persistenceManager.load.bind(persistenceManager),
    delete: persistenceManager.delete.bind(persistenceManager),
    clearAll: persistenceManager.clearAll.bind(persistenceManager),
    addToBatch: persistenceManager.addToBatch.bind(persistenceManager),
    getStats: persistenceManager.getStorageStats.bind(persistenceManager),
  };
};

// ================================================================================================
// EXPORT
// ================================================================================================

export default persistenceManager;