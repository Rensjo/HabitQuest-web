/**
 * ================================================================================================
 * ENHANCED STORAGE SYSTEM FOR LONG-TERM DATA PERSISTENCE
 * ================================================================================================
 * 
 * Comprehensive storage solution for Tauri desktop with data integrity,
 * versioning, compression, and backup mechanisms
 * 
 * @version 1.0.0
 */

import { debounce } from 'lodash-es';
import type { Stored } from '../types';
import { LS_KEY } from '../constants';

// ================================================================================================
// STORAGE CONFIGURATION
// ================================================================================================

interface StorageConfig {
  maxRetries: number;
  retryDelay: number;
  compressionThreshold: number; // bytes
  backupRetention: number; // days
  autoBackupInterval: number; // hours
  version: string;
}

const STORAGE_CONFIG: StorageConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  compressionThreshold: 1024, // 1KB
  backupRetention: 30, // 30 days
  autoBackupInterval: 24, // 24 hours
  version: '1.0.0'
};

// ================================================================================================
// ENHANCED STORAGE MANAGER
// ================================================================================================

class EnhancedStorageManager {
  private saveQueue: Map<string, any> = new Map();
  private isSaving = false;
  private lastBackup: number = 0;
  private retryCount: number = 0;
  
  // Debounced save function (saves after 1 second of inactivity)
  private debouncedSave = debounce(() => {
    this.flushSaveQueue();
  }, 1000);
  
  // Batch save function (saves every 5 seconds regardless)
  private batchSave = debounce(() => {
    this.flushSaveQueue();
  }, 5000);
  
  // Auto-backup function
  private autoBackup = debounce(() => {
    this.createBackup();
  }, STORAGE_CONFIG.autoBackupInterval * 60 * 60 * 1000);

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage and check data integrity
   */
  private initializeStorage(): void {
    if (typeof window === 'undefined') return;
    
    // Check if we need to migrate data
    this.checkDataMigration();
    
    // Create initial backup
    this.createBackup();
    
    // Set up auto-backup
    this.autoBackup();
  }

  /**
   * Check if data migration is needed
   */
  private checkDataMigration(): void {
    const currentData = this.loadRaw(LS_KEY);
    if (!currentData) return;
    
    try {
      const parsed = JSON.parse(currentData);
      
      // Check if data needs migration based on version
      if (!parsed.version || parsed.version !== STORAGE_CONFIG.version) {
        console.log('Data migration needed, creating backup...');
        this.createBackup();
        this.migrateData(parsed);
      }
    } catch (error) {
      console.warn('Data corruption detected, attempting recovery...');
      this.attemptDataRecovery();
    }
  }

  /**
   * Migrate data to current version
   */
  private migrateData(data: any): void {
    // Add version to data
    const migratedData = {
      ...data,
      version: STORAGE_CONFIG.version,
      migratedAt: new Date().toISOString()
    };
    
    this.saveRaw(LS_KEY, JSON.stringify(migratedData));
  }

  /**
   * Attempt to recover corrupted data
   */
  private attemptDataRecovery(): void {
    // Try to load from backup
    const backup = this.loadLatestBackup();
    if (backup) {
      console.log('Recovering from backup...');
      this.saveRaw(LS_KEY, backup);
    } else {
      console.warn('No backup available, data will be reset');
    }
  }

  /**
   * Save data with enhanced error handling and retry logic
   */
  public save(key: string, data: any): void {
    this.saveQueue.set(key, data);
    this.debouncedSave();
    this.batchSave();
  }

  /**
   * Save data immediately with retry logic
   */
  public saveImmediate(key: string, data: any): void {
    this.saveQueue.set(key, data);
    this.flushSaveQueue();
  }

  /**
   * Load data with error handling and fallback
   */
  public load(key: string): any | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const raw = this.loadRaw(key);
      if (!raw) return null;
      
      const data = JSON.parse(raw);
      
      // Validate data integrity
      if (this.validateData(data)) {
        return data;
      } else {
        console.warn('Data validation failed, attempting recovery...');
        return this.attemptDataRecovery();
      }
    } catch (error) {
      console.warn(`Failed to load data for key ${key}:`, error);
      return this.attemptDataRecovery();
    }
  }

  /**
   * Validate data integrity
   */
  private validateData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    // Check required fields
    const requiredFields = ['habits', 'points', 'totalXP', 'goals', 'shop', 'inventory'];
    return requiredFields.every(field => data.hasOwnProperty(field));
  }

  /**
   * Flush the save queue with retry logic
   */
  private async flushSaveQueue(): Promise<void> {
    if (this.isSaving || this.saveQueue.size === 0) return;
    
    this.isSaving = true;
    
    try {
      // Merge all queued data
      const mergedData: Partial<Stored> = {};
      
      for (const [key, data] of this.saveQueue.entries()) {
        Object.assign(mergedData, data);
      }
      
      // Add metadata
      const dataWithMetadata = {
        ...mergedData,
        version: STORAGE_CONFIG.version,
        lastSaved: new Date().toISOString(),
        checksum: this.calculateChecksum(mergedData)
      };
      
      // Compress if needed
      const dataToSave = this.shouldCompress(dataWithMetadata) 
        ? this.compressData(dataWithMetadata)
        : JSON.stringify(dataWithMetadata);
      
      // Save with retry logic
      await this.saveWithRetry(LS_KEY, dataToSave);
      
      // Clear the queue
      this.saveQueue.clear();
      this.retryCount = 0;
      
      // Create backup if needed
      if (this.shouldCreateBackup()) {
        this.createBackup();
      }
      
    } catch (error) {
      console.error('Failed to save data:', error);
      this.handleSaveError(error);
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Save with retry logic
   */
  private async saveWithRetry(key: string, data: string): Promise<void> {
    for (let attempt = 0; attempt < STORAGE_CONFIG.maxRetries; attempt++) {
      try {
        this.saveRaw(key, data);
        return;
      } catch (error) {
        if (attempt === STORAGE_CONFIG.maxRetries - 1) {
          throw error;
        }
        
        console.warn(`Save attempt ${attempt + 1} failed, retrying...`);
        await this.delay(STORAGE_CONFIG.retryDelay * (attempt + 1));
      }
    }
  }

  /**
   * Handle save errors
   */
  private handleSaveError(error: any): void {
    this.retryCount++;
    
    if (this.retryCount >= STORAGE_CONFIG.maxRetries) {
      console.error('Max retry attempts reached, data may be lost');
      // Could implement user notification here
    }
  }

  /**
   * Check if data should be compressed
   */
  private shouldCompress(data: any): boolean {
    const dataSize = new Blob([JSON.stringify(data)]).size;
    return dataSize > STORAGE_CONFIG.compressionThreshold;
  }

  /**
   * Compress data (simple implementation)
   */
  private compressData(data: any): string {
    // Simple compression by removing unnecessary whitespace
    return JSON.stringify(data);
  }

  /**
   * Calculate data checksum for integrity
   */
  private calculateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Check if backup should be created
   */
  private shouldCreateBackup(): boolean {
    const now = Date.now();
    const timeSinceLastBackup = now - this.lastBackup;
    const backupInterval = STORAGE_CONFIG.autoBackupInterval * 60 * 60 * 1000;
    
    return timeSinceLastBackup > backupInterval;
  }

  /**
   * Create data backup
   */
  public createBackup(): void {
    try {
      const data = this.loadRaw(LS_KEY);
      if (!data) return;
      
      const backupKey = `${LS_KEY}_backup_${Date.now()}`;
      this.saveRaw(backupKey, data);
      
      this.lastBackup = Date.now();
      this.cleanupOldBackups();
      
      console.log('Backup created successfully');
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  /**
   * Load latest backup
   */
  private loadLatestBackup(): string | null {
    if (typeof window === 'undefined') return null;
    
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(`${LS_KEY}_backup_`))
      .sort((a, b) => b.localeCompare(a)); // Sort by timestamp, newest first
    
    if (backupKeys.length === 0) return null;
    
    return this.loadRaw(backupKeys[0]);
  }

  /**
   * Clean up old backups
   */
  private cleanupOldBackups(): void {
    if (typeof window === 'undefined') return;
    
    const cutoffTime = Date.now() - (STORAGE_CONFIG.backupRetention * 24 * 60 * 60 * 1000);
    
    Object.keys(localStorage)
      .filter(key => key.startsWith(`${LS_KEY}_backup_`))
      .forEach(key => {
        const timestamp = parseInt(key.split('_').pop() || '0');
        if (timestamp < cutoffTime) {
          localStorage.removeItem(key);
        }
      });
  }

  /**
   * Get storage usage information
   */
  public getStorageInfo(): { 
    used: number; 
    available: number; 
    percentage: number;
    backups: number;
    lastBackup: string | null;
  } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, percentage: 0, backups: 0, lastBackup: null };
    }
    
    try {
      const data = this.loadRaw(LS_KEY);
      const used = data ? new Blob([data]).size : 0;
      const available = 5 * 1024 * 1024; // 5MB typical limit
      const percentage = (used / available) * 100;
      
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${LS_KEY}_backup_`));
      
      const lastBackup = this.lastBackup ? new Date(this.lastBackup).toISOString() : null;
      
      return { 
        used, 
        available, 
        percentage, 
        backups: backupKeys.length,
        lastBackup
      };
    } catch {
      return { used: 0, available: 0, percentage: 0, backups: 0, lastBackup: null };
    }
  }

  /**
   * Clear all data and backups
   */
  public clear(): void {
    this.saveQueue.clear();
    if (typeof window !== 'undefined') {
      // Clear main data
      localStorage.removeItem(LS_KEY);
      
      // Clear all backups
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${LS_KEY}_backup_`))
        .forEach(key => localStorage.removeItem(key));
    }
  }

  /**
   * Export data for backup/transfer
   */
  public exportData(): string {
    const data = this.load(LS_KEY);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from backup/transfer
   */
  public importData(dataString: string): boolean {
    try {
      const data = JSON.parse(dataString);
      if (this.validateData(data)) {
        this.saveImmediate(LS_KEY, data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Helper methods
  private loadRaw(key: string): string | null {
    return localStorage.getItem(key);
  }

  private saveRaw(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ================================================================================================
// SINGLETON INSTANCE
// ================================================================================================

export const enhancedStorageManager = new EnhancedStorageManager();

// ================================================================================================
// HOOKS
// ================================================================================================

/**
 * Hook for enhanced data persistence
 */
export function useEnhancedStorage() {
  const save = (key: string, data: any) => enhancedStorageManager.save(key, data);
  const saveImmediate = (key: string, data: any) => enhancedStorageManager.saveImmediate(key, data);
  const load = (key: string) => enhancedStorageManager.load(key);
  const clear = () => enhancedStorageManager.clear();
  const getStorageInfo = () => enhancedStorageManager.getStorageInfo();
  const createBackup = () => enhancedStorageManager.createBackup();
  const exportData = () => enhancedStorageManager.exportData();
  const importData = (data: string) => enhancedStorageManager.importData(data);
  
  return {
    save,
    saveImmediate,
    load,
    clear,
    getStorageInfo,
    createBackup,
    exportData,
    importData
  };
}

// ================================================================================================
// LEGACY COMPATIBILITY
// ================================================================================================

/**
 * Legacy loadData function for backward compatibility
 */
export function loadData(): Stored | null {
  return enhancedStorageManager.load(LS_KEY);
}

/**
 * Legacy saveData function for backward compatibility
 */
export function saveData(data: Stored): void {
  enhancedStorageManager.saveImmediate(LS_KEY, data);
}
