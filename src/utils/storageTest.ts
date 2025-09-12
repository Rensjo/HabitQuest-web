/**
 * ================================================================================================
 * STORAGE TESTING UTILITIES
 * ================================================================================================
 * 
 * Comprehensive testing for storage systems to ensure data integrity
 * and long-term persistence for Tauri desktop
 * 
 * @version 1.0.0
 */

import { enhancedStorageManager } from '../services/enhancedStorage';
import type { Stored } from '../types';

// ================================================================================================
// TEST DATA
// ================================================================================================

const testData: Stored = {
  habits: [
    {
      id: 'test-habit-1',
      title: 'Test Habit',
      frequency: 'daily',
      category: 'PERSONAL DEVELOPMENT',
      xpOnComplete: 10,
      streak: 5,
      bestStreak: 10,
      lastCompletedAt: new Date().toISOString(),
      completions: {
        '2024-01-01': new Date().toISOString(),
        '2024-01-02': new Date().toISOString(),
        '2024-01-03': new Date().toISOString(),
      },
      isRecurring: true,
    }
  ],
  points: 100,
  totalXP: 500,
  goals: {
    'PERSONAL DEVELOPMENT': { monthlyTargetXP: 300 }
  },
  inventory: [
    {
      name: 'Test Reward',
      cost: 50,
      redeemedAt: new Date().toISOString()
    }
  ],
  shop: [
    {
      id: 'test-reward',
      name: 'Test Reward',
      cost: 50
    }
  ],
  categories: ['PERSONAL DEVELOPMENT', 'CAREER']
};

// ================================================================================================
// STORAGE TESTS
// ================================================================================================

export class StorageTester {
  private testResults: Array<{ test: string; passed: boolean; message: string; duration: number }> = [];

  /**
   * Run all storage tests
   */
  public async runAllTests(): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: Array<{ test: string; passed: boolean; message: string; duration: number }>;
  }> {
    console.log('🧪 Starting Storage Tests...');
    this.testResults = [];

    // Basic functionality tests
    await this.testBasicSaveLoad();
    await this.testDataIntegrity();
    await this.testErrorHandling();
    await this.testBackupSystem();
    await this.testStorageLimits();
    await this.testDataMigration();
    await this.testPerformance();

    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;

    console.log(`\n📊 Test Results: ${passed}/${total} passed`);
    
    if (failed > 0) {
      console.log('❌ Failed tests:');
      this.testResults.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.test}: ${r.message}`);
      });
    }

    return { passed, failed, total, results: this.testResults };
  }

  /**
   * Test basic save and load functionality
   */
  private async testBasicSaveLoad(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Clear storage first
      enhancedStorageManager.clear();
      
      // Save test data
      enhancedStorageManager.saveImmediate('test-key', testData);
      
      // Load test data
      const loadedData = enhancedStorageManager.load('test-key');
      
      if (!loadedData) {
        throw new Error('Failed to load data');
      }
      
      // Verify data integrity
      if (loadedData.habits.length !== testData.habits.length) {
        throw new Error('Habits count mismatch');
      }
      
      if (loadedData.points !== testData.points) {
        throw new Error('Points mismatch');
      }
      
      this.addTestResult('Basic Save/Load', true, 'Data saved and loaded successfully', performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Basic Save/Load', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Test data integrity and validation
   */
  private async testDataIntegrity(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Test with corrupted data
      const corruptedData = { ...testData, habits: 'invalid' };
      
      // This should be handled gracefully
      enhancedStorageManager.saveImmediate('corrupted-test', corruptedData);
      const loadedData = enhancedStorageManager.load('corrupted-test');
      
      // Should either return null or valid data
      if (loadedData && typeof loadedData.habits === 'string') {
        throw new Error('Corrupted data was not handled properly');
      }
      
      this.addTestResult('Data Integrity', true, 'Corrupted data handled gracefully', performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Data Integrity', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Test error handling and retry logic
   */
  private async testErrorHandling(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Test with invalid data
      const invalidData = null;
      
      // This should not crash the application
      enhancedStorageManager.saveImmediate('invalid-test', invalidData);
      
      // Test loading non-existent data
      const nonExistentData = enhancedStorageManager.load('non-existent-key');
      
      if (nonExistentData !== null) {
        throw new Error('Non-existent data should return null');
      }
      
      this.addTestResult('Error Handling', true, 'Errors handled gracefully', performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Error Handling', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Test backup system
   */
  private async testBackupSystem(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Create a backup
      enhancedStorageManager.createBackup();
      
      // Get storage info
      const storageInfo = enhancedStorageManager.getStorageInfo();
      
      if (storageInfo.backups === 0) {
        throw new Error('Backup was not created');
      }
      
      // Test data export/import
      const exportedData = enhancedStorageManager.exportData();
      if (!exportedData || exportedData.length === 0) {
        throw new Error('Data export failed');
      }
      
      // Clear storage and import data
      enhancedStorageManager.clear();
      const importSuccess = enhancedStorageManager.importData(exportedData);
      
      if (!importSuccess) {
        throw new Error('Data import failed');
      }
      
      this.addTestResult('Backup System', true, 'Backup and restore working', performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Backup System', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Test storage limits and performance
   */
  private async testStorageLimits(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Test with large data
      const largeData = {
        ...testData,
        habits: Array(1000).fill(null).map((_, i) => ({
          ...testData.habits[0],
          id: `large-habit-${i}`,
          title: `Large Habit ${i}`,
          completions: Object.fromEntries(
            Array(365).fill(null).map((_, day) => [
              `2024-${String(Math.floor(day / 30) + 1).padStart(2, '0')}-${String((day % 30) + 1).padStart(2, '0')}`,
              new Date().toISOString()
            ])
          )
        }))
      };
      
      // Save large data
      enhancedStorageManager.saveImmediate('large-test', largeData);
      
      // Load and verify
      const loadedData = enhancedStorageManager.load('large-test');
      
      if (!loadedData || loadedData.habits.length !== 1000) {
        throw new Error('Large data handling failed');
      }
      
      // Check storage usage
      const storageInfo = enhancedStorageManager.getStorageInfo();
      
      if (storageInfo.percentage > 90) {
        console.warn('Storage usage is high:', storageInfo.percentage + '%');
      }
      
      this.addTestResult('Storage Limits', true, `Large data handled (${storageInfo.percentage.toFixed(1)}% usage)`, performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Storage Limits', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Test data migration
   */
  private async testDataMigration(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Simulate old data format
      const oldData = {
        ...testData,
        version: '0.9.0' // Old version
      };
      
      // Save old format data
      if (typeof window !== 'undefined') {
        localStorage.setItem('ghgt:data:v3', JSON.stringify(oldData));
      }
      
      // Load data (should trigger migration)
      const migratedData = enhancedStorageManager.load('ghgt:data:v3');
      
      if (!migratedData) {
        throw new Error('Data migration failed');
      }
      
      // Check if version was updated
      if (migratedData.version !== '1.0.0') {
        throw new Error('Version was not updated during migration');
      }
      
      this.addTestResult('Data Migration', true, 'Data migrated successfully', performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Data Migration', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Test performance metrics
   */
  private async testPerformance(): Promise<void> {
    const startTime = performance.now();
    
    try {
      const iterations = 100;
      const testDataWithTimestamp = { ...testData, timestamp: Date.now() };
      
      // Test save performance
      const saveStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        enhancedStorageManager.saveImmediate(`perf-test-${i}`, testDataWithTimestamp);
      }
      const saveTime = performance.now() - saveStart;
      
      // Test load performance
      const loadStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        enhancedStorageManager.load(`perf-test-${i}`);
      }
      const loadTime = performance.now() - loadStart;
      
      const avgSaveTime = saveTime / iterations;
      const avgLoadTime = loadTime / iterations;
      
      if (avgSaveTime > 10) {
        console.warn(`Slow save performance: ${avgSaveTime.toFixed(2)}ms per operation`);
      }
      
      if (avgLoadTime > 5) {
        console.warn(`Slow load performance: ${avgLoadTime.toFixed(2)}ms per operation`);
      }
      
      this.addTestResult('Performance', true, `Avg save: ${avgSaveTime.toFixed(2)}ms, Avg load: ${avgLoadTime.toFixed(2)}ms`, performance.now() - startTime);
    } catch (error) {
      this.addTestResult('Performance', false, `Error: ${error}`, performance.now() - startTime);
    }
  }

  /**
   * Add test result
   */
  private addTestResult(test: string, passed: boolean, message: string, duration: number): void {
    this.testResults.push({ test, passed, message, duration });
    console.log(`${passed ? '✅' : '❌'} ${test}: ${message} (${duration.toFixed(2)}ms)`);
  }
}

// ================================================================================================
// QUICK TEST FUNCTION
// ================================================================================================

/**
 * Run a quick storage test
 */
export async function quickStorageTest(): Promise<boolean> {
  const tester = new StorageTester();
  const results = await tester.runAllTests();
  
  console.log('\n🎯 Quick Storage Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.total}`);
  
  return results.failed === 0;
}

// ================================================================================================
// EXPORTS
// ================================================================================================

// StorageTester is already exported above
