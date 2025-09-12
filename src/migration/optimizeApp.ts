/**
 * ================================================================================================
 * APP OPTIMIZATION MIGRATION SCRIPT
 * ================================================================================================
 * 
 * Script to migrate from old App.tsx to optimized version
 * 
 * @version 1.0.0
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ================================================================================================
// MIGRATION FUNCTIONS
// ================================================================================================

/**
 * Backup current App.tsx
 */
export function backupCurrentApp(): void {
  const appPath = join(process.cwd(), 'src', 'App.tsx');
  const backupPath = join(process.cwd(), 'src', 'App_original.tsx');
  
  if (existsSync(appPath)) {
    const content = readFileSync(appPath, 'utf-8');
    writeFileSync(backupPath, content);
    console.log('✅ Backed up current App.tsx to App_original.tsx');
  }
}

/**
 * Replace App.tsx with optimized version
 */
export function replaceWithOptimizedApp(): void {
  const optimizedPath = join(process.cwd(), 'src', 'App_optimized.tsx');
  const appPath = join(process.cwd(), 'src', 'App.tsx');
  
  if (existsSync(optimizedPath)) {
    const content = readFileSync(optimizedPath, 'utf-8');
    writeFileSync(appPath, content);
    console.log('✅ Replaced App.tsx with optimized version');
  } else {
    console.error('❌ Optimized App.tsx not found');
  }
}

/**
 * Restore original App.tsx
 */
export function restoreOriginalApp(): void {
  const originalPath = join(process.cwd(), 'src', 'App_original.tsx');
  const appPath = join(process.cwd(), 'src', 'App.tsx');
  
  if (existsSync(originalPath)) {
    const content = readFileSync(originalPath, 'utf-8');
    writeFileSync(appPath, content);
    console.log('✅ Restored original App.tsx');
  } else {
    console.error('❌ Original App.tsx backup not found');
  }
}

/**
 * Run full migration
 */
export function runMigration(): void {
  console.log('🚀 Starting App optimization migration...');
  
  try {
    backupCurrentApp();
    replaceWithOptimizedApp();
    console.log('✅ Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Test the optimized app');
    console.log('   2. Check for any errors');
    console.log('   3. Run npm run build to test Tauri build');
    console.log('   4. If issues occur, run restoreOriginalApp() to revert');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// ================================================================================================
// EXPORTS
// ================================================================================================

// All exports are already declared above, no need to re-export
