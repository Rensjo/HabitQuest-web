/**
 * ================================================================================================
 * OPTIMIZED DATA PERSISTENCE
 * ================================================================================================
 * 
 * High-performance data persistence with debouncing and batching for Tauri
 * 
 * @version 1.0.0
 */

import { debounce } from 'lodash-es';
import type { Stored } from '../types';
import { LS_KEY } from '../constants';

// ================================================================================================
// PERSISTENCE MANAGER
// ================================================================================================

class PersistenceManager {
  private saveQueue: Map<string, any> = new Map();
  private isSaving = false;
  private saveTimeout: NodeJS.Timeout | null = null;
  
  // Debounced save function (saves after 1 second of inactivity)
  private debouncedSave = debounce(() => {
    this.flushSaveQueue();
  }, 1000);
  
  // Batch save function (saves every 5 seconds regardless)
  private batchSave = debounce(() => {
    this.flushSaveQueue();
  }, 5000);
  
  /**
   * Save data with debouncing and batching
   */
  public save(key: string, data: any): void {
    this.saveQueue.set(key, data);
    this.debouncedSave();
    this.batchSave();
  }
  
  /**
   * Save data immediately (for critical data)
   */
  public saveImmediate(key: string, data: any): void {
    this.saveQueue.set(key, data);
    this.flushSaveQueue();
  }
  
  /**
   * Load data from localStorage
   */
  public load(key: string): any | null {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(`Failed to load data for key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Flush the save queue to localStorage
   */
  private flushSaveQueue(): void {
    if (this.isSaving || this.saveQueue.size === 0) return;
    
    this.isSaving = true;
    
    try {
      // Merge all queued data
      const mergedData: Partial<Stored> = {};
      
      for (const [key, data] of this.saveQueue.entries()) {
        Object.assign(mergedData, data);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LS_KEY, JSON.stringify(mergedData));
      }
      
      // Clear the queue
      this.saveQueue.clear();
      
    } catch (error) {
      console.warn('Failed to save data:', error);
    } finally {
      this.isSaving = false;
    }
  }
  
  /**
   * Clear all data
   */
  public clear(): void {
    this.saveQueue.clear();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LS_KEY);
    }
  }
  
  /**
   * Get storage usage info
   */
  public getStorageInfo(): { used: number; available: number; percentage: number } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, percentage: 0 };
    }
    
    try {
      const data = window.localStorage.getItem(LS_KEY);
      const used = data ? new Blob([data]).size : 0;
      const available = 5 * 1024 * 1024; // 5MB typical limit
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

export const persistenceManager = new PersistenceManager();

// ================================================================================================
// HOOKS
// ================================================================================================

/**
 * Hook for optimized data persistence
 */
export function useOptimizedPersistence() {
  const save = (key: string, data: any) => persistenceManager.save(key, data);
  const saveImmediate = (key: string, data: any) => persistenceManager.saveImmediate(key, data);
  const load = (key: string) => persistenceManager.load(key);
  const clear = () => persistenceManager.clear();
  const getStorageInfo = () => persistenceManager.getStorageInfo();
  
  return {
    save,
    saveImmediate,
    load,
    clear,
    getStorageInfo
  };
}

// ================================================================================================
// LEGACY COMPATIBILITY
// ================================================================================================

/**
 * Legacy loadData function for backward compatibility
 */
export function loadData(): Stored | null {
  return persistenceManager.load(LS_KEY);
}

/**
 * Legacy saveData function for backward compatibility
 */
export function saveData(data: Stored): void {
  persistenceManager.saveImmediate(LS_KEY, data);
}
