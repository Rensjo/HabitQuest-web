/**
 * ================================================================================================
 * PERFORMANCE TESTING SCRIPT
 * ================================================================================================
 * 
 * Automated performance testing for HabitQuest
 * Tests bundle size, load time, and runtime performance
 * 
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ================================================================================================
// CONFIGURATION
// ================================================================================================

const CONFIG = {
  // Performance thresholds
  MAX_BUNDLE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_LOAD_TIME: 1000, // 1 second
  MAX_MEMORY_USAGE: 100 * 1024 * 1024, // 100MB
  MAX_RENDER_TIME: 16, // 16ms (60fps)
  
  // Test directories
  DIST_DIR: path.join(__dirname, '../dist'),
  SRC_DIR: path.join(__dirname, '../src'),
  
  // Output file
  REPORT_FILE: path.join(__dirname, '../performance-report.json'),
};

// ================================================================================================
// PERFORMANCE METRICS
// ================================================================================================

class PerformanceTester {
  constructor() {
    this.metrics = {
      bundleSize: 0,
      loadTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      componentCount: 0,
      reRenderCount: 0,
      timestamp: new Date().toISOString(),
    };
    this.errors = [];
  }

  // ================================================================================================
  // BUNDLE SIZE TESTING
  // ================================================================================================

  testBundleSize() {
    console.log('📦 Testing bundle size...');
    
    try {
      if (!fs.existsSync(CONFIG.DIST_DIR)) {
        throw new Error('Dist directory not found. Run "npm run build" first.');
      }

      const files = this.getBundleFiles();
      let totalSize = 0;
      const fileSizes = {};

      files.forEach(file => {
        const stats = fs.statSync(file);
        const size = stats.size;
        totalSize += size;
        fileSizes[path.basename(file)] = size;
      });

      this.metrics.bundleSize = totalSize;
      this.metrics.fileSizes = fileSizes;

      console.log(`✅ Bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      
      if (totalSize > CONFIG.MAX_BUNDLE_SIZE) {
        this.errors.push(`Bundle size too large: ${(totalSize / 1024 / 1024).toFixed(2)}MB > ${(CONFIG.MAX_BUNDLE_SIZE / 1024 / 1024).toFixed(2)}MB`);
      }

      return totalSize;
    } catch (error) {
      this.errors.push(`Bundle size test failed: ${error.message}`);
      return 0;
    }
  }

  getBundleFiles() {
    const files = [];
    
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.js') || item.endsWith('.css') || item.endsWith('.html')) {
          files.push(fullPath);
        }
      });
    };

    scanDir(CONFIG.DIST_DIR);
    return files;
  }

  // ================================================================================================
  // LOAD TIME TESTING
  // ================================================================================================

  testLoadTime() {
    console.log('⏱️ Testing load time...');
    
    try {
      const startTime = Date.now();
      
      // Simulate loading the main bundle
      const mainBundle = path.join(CONFIG.DIST_DIR, 'assets', 'index.js');
      if (fs.existsSync(mainBundle)) {
        const content = fs.readFileSync(mainBundle, 'utf8');
        const loadTime = Date.now() - startTime;
        
        this.metrics.loadTime = loadTime;
        console.log(`✅ Load time: ${loadTime}ms`);
        
        if (loadTime > CONFIG.MAX_LOAD_TIME) {
          this.errors.push(`Load time too slow: ${loadTime}ms > ${CONFIG.MAX_LOAD_TIME}ms`);
        }
      } else {
        throw new Error('Main bundle not found');
      }
    } catch (error) {
      this.errors.push(`Load time test failed: ${error.message}`);
    }
  }

  // ================================================================================================
  // MEMORY USAGE TESTING
  // ================================================================================================

  testMemoryUsage() {
    console.log('💾 Testing memory usage...');
    
    try {
      const used = process.memoryUsage();
      const memoryUsage = used.heapUsed;
      
      this.metrics.memoryUsage = memoryUsage;
      console.log(`✅ Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      
      if (memoryUsage > CONFIG.MAX_MEMORY_USAGE) {
        this.errors.push(`Memory usage too high: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB > ${(CONFIG.MAX_MEMORY_USAGE / 1024 / 1024).toFixed(2)}MB`);
      }
    } catch (error) {
      this.errors.push(`Memory usage test failed: ${error.message}`);
    }
  }

  // ================================================================================================
  // COMPONENT COUNT TESTING
  // ================================================================================================

  testComponentCount() {
    console.log('🧩 Testing component count...');
    
    try {
      let componentCount = 0;
      const scanDir = (dir) => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
            componentCount++;
          }
        });
      };

      scanDir(CONFIG.SRC_DIR);
      this.metrics.componentCount = componentCount;
      console.log(`✅ Component count: ${componentCount}`);
      
      if (componentCount > 100) {
        this.errors.push(`Too many components: ${componentCount} > 100`);
      }
    } catch (error) {
      this.errors.push(`Component count test failed: ${error.message}`);
    }
  }

  // ================================================================================================
  // CODE QUALITY TESTING
  // ================================================================================================

  testCodeQuality() {
    console.log('🔍 Testing code quality...');
    
    try {
      // Check for console.log statements
      const consoleLogs = this.findConsoleLogs();
      if (consoleLogs.length > 0) {
        this.errors.push(`Console.log statements found: ${consoleLogs.length}`);
      }

      // Check for unused imports
      const unusedImports = this.findUnusedImports();
      if (unusedImports.length > 0) {
        this.errors.push(`Unused imports found: ${unusedImports.length}`);
      }

      console.log(`✅ Code quality checks completed`);
    } catch (error) {
      this.errors.push(`Code quality test failed: ${error.message}`);
    }
  }

  findConsoleLogs() {
    const consoleLogs = [];
    const scanFile = (filePath) => {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes('console.log') && !line.includes('//')) {
            consoleLogs.push(`${filePath}:${index + 1}`);
          }
        });
      }
    };

    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else {
          scanFile(fullPath);
        }
      });
    };

    scanDir(CONFIG.SRC_DIR);
    return consoleLogs;
  }

  findUnusedImports() {
    // This is a simplified check - in production, use a proper linter
    const unusedImports = [];
    const scanFile = (filePath) => {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.startsWith('import ') && line.includes(' from ')) {
            const importName = line.match(/import\s+{([^}]+)}/)?.[1];
            if (importName) {
              const names = importName.split(',').map(n => n.trim());
              names.forEach(name => {
                if (!content.includes(name) || content.indexOf(name) === content.lastIndexOf(name)) {
                  unusedImports.push(`${filePath}:${index + 1} - ${name}`);
                }
              });
            }
          }
        });
      }
    };

    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else {
          scanFile(fullPath);
        }
      });
    };

    scanDir(CONFIG.SRC_DIR);
    return unusedImports;
  }

  // ================================================================================================
  // REPORT GENERATION
  // ================================================================================================

  generateReport() {
    console.log('📊 Generating performance report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      errors: this.errors,
      status: this.errors.length === 0 ? 'PASS' : 'FAIL',
      recommendations: this.generateRecommendations(),
    };

    fs.writeFileSync(CONFIG.REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`✅ Report saved to ${CONFIG.REPORT_FILE}`);
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.bundleSize > CONFIG.MAX_BUNDLE_SIZE) {
      recommendations.push('Consider code splitting and lazy loading to reduce bundle size');
    }
    
    if (this.metrics.loadTime > CONFIG.MAX_LOAD_TIME) {
      recommendations.push('Optimize asset loading and consider preloading critical resources');
    }
    
    if (this.metrics.memoryUsage > CONFIG.MAX_MEMORY_USAGE) {
      recommendations.push('Review memory usage and implement proper cleanup');
    }
    
    if (this.metrics.componentCount > 100) {
      recommendations.push('Consider breaking down large components into smaller ones');
    }
    
    if (this.errors.length > 0) {
      recommendations.push('Address the errors listed above to improve performance');
    }
    
    return recommendations;
  }

  // ================================================================================================
  // MAIN TEST RUNNER
  // ================================================================================================

  async runTests() {
    console.log('🚀 Starting performance tests...\n');
    
    try {
      // Check if dist directory exists
      if (!fs.existsSync(CONFIG.DIST_DIR)) {
        console.log('📦 Building project...');
        execSync('npm run build', { stdio: 'inherit' });
      }

      // Run all tests
      this.testBundleSize();
      this.testLoadTime();
      this.testMemoryUsage();
      this.testComponentCount();
      this.testCodeQuality();

      // Generate report
      const report = this.generateReport();
      
      // Print summary
      console.log('\n📊 Performance Test Summary:');
      console.log('============================');
      console.log(`Bundle Size: ${(this.metrics.bundleSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Load Time: ${this.metrics.loadTime}ms`);
      console.log(`Memory Usage: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Component Count: ${this.metrics.componentCount}`);
      console.log(`Status: ${report.status}`);
      console.log(`Errors: ${this.errors.length}`);
      
      if (this.errors.length > 0) {
        console.log('\n❌ Errors:');
        this.errors.forEach(error => console.log(`  - ${error}`));
      }
      
      if (report.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        report.recommendations.forEach(rec => console.log(`  - ${rec}`));
      }
      
      return report.status === 'PASS';
    } catch (error) {
      console.error('❌ Performance tests failed:', error.message);
      return false;
    }
  }
}

// ================================================================================================
// MAIN EXECUTION
// ================================================================================================

if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = PerformanceTester;