/**
 * ================================================================================================
 * PERFORMANCE TESTING SCRIPT
 * ================================================================================================
 * 
 * Automated performance testing for HabitQuest
 * 
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ================================================================================================
// PERFORMANCE TEST CONFIGURATION
// ================================================================================================

const TEST_CONFIG = {
  buildTimeout: 300000, // 5 minutes
  memoryThreshold: 100, // MB
  renderTimeThreshold: 16, // ms (60fps)
  bundleSizeThreshold: 2000000, // 2MB
  testIterations: 3
};

// ================================================================================================
// PERFORMANCE TESTS
// ================================================================================================

/**
 * Test build performance
 */
function testBuildPerformance() {
  console.log('🔨 Testing build performance...');
  
  const startTime = Date.now();
  
  try {
    execSync('npm run build', { 
      stdio: 'pipe',
      timeout: TEST_CONFIG.buildTimeout 
    });
    
    const buildTime = Date.now() - startTime;
    console.log(`✅ Build completed in ${buildTime}ms`);
    
    return {
      success: true,
      buildTime,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Test bundle size
 */
function testBundleSize() {
  console.log('📦 Testing bundle size...');
  
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('❌ Dist folder not found. Run build first.');
    return { success: false, error: 'Dist folder not found' };
  }
  
  let totalSize = 0;
  const files = [];
  
  function getDirectorySize(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        getDirectorySize(itemPath);
      } else {
        const size = stat.size;
        totalSize += size;
        files.push({
          path: itemPath.replace(process.cwd(), ''),
          size: size,
          sizeKB: Math.round(size / 1024)
        });
      }
    });
  }
  
  getDirectorySize(distPath);
  
  const totalSizeMB = Math.round(totalSize / 1024 / 1024 * 100) / 100;
  const isWithinThreshold = totalSize < TEST_CONFIG.bundleSizeThreshold;
  
  console.log(`📊 Total bundle size: ${totalSizeMB}MB`);
  console.log(`📊 Files: ${files.length}`);
  console.log(`📊 Largest files:`);
  
  files
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)
    .forEach(file => {
      console.log(`   ${file.path}: ${file.sizeKB}KB`);
    });
  
  return {
    success: isWithinThreshold,
    totalSize,
    totalSizeMB,
    fileCount: files.length,
    files: files.sort((a, b) => b.size - a.size),
    withinThreshold: isWithinThreshold,
    timestamp: new Date().toISOString()
  };
}

/**
 * Test development server performance
 */
function testDevServerPerformance() {
  console.log('🚀 Testing development server performance...');
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    let serverProcess;
    
    try {
      serverProcess = execSync('npm run dev', { 
        stdio: 'pipe',
        timeout: 10000 // 10 seconds
      });
      
      const startupTime = Date.now() - startTime;
      console.log(`✅ Dev server started in ${startupTime}ms`);
      
      resolve({
        success: true,
        startupTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Dev server failed to start:', error.message);
      resolve({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}

/**
 * Run all performance tests
 */
async function runPerformanceTests() {
  console.log('🚀 Starting HabitQuest Performance Tests...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };
  
  // Test 1: Build Performance
  console.log('='.repeat(50));
  results.tests.buildPerformance = testBuildPerformance();
  
  // Test 2: Bundle Size
  console.log('\n' + '='.repeat(50));
  results.tests.bundleSize = testBundleSize();
  
  // Test 3: Dev Server Performance
  console.log('\n' + '='.repeat(50));
  results.tests.devServerPerformance = await testDevServerPerformance();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 PERFORMANCE TEST SUMMARY');
  console.log('='.repeat(50));
  
  const allTestsPassed = Object.values(results.tests).every(test => test.success);
  
  Object.entries(results.tests).forEach(([testName, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${testName}: ${status}`);
    
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log(`\nOverall: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  // Save results
  const resultsPath = path.join(process.cwd(), 'performance-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);
  
  return results;
}

// ================================================================================================
// MAIN EXECUTION
// ================================================================================================

if (require.main === module) {
  runPerformanceTests()
    .then(results => {
      process.exit(results.tests.buildPerformance.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Performance test failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runPerformanceTests,
  testBuildPerformance,
  testBundleSize,
  testDevServerPerformance
};
