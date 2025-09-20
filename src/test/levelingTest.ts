/**
 * Test the new leveling system
 */
import { getCurrentLevel, getXPRequiredForLevel, getXPToNextLevel, getLevelProgress } from '../utils';

// Test cases for the new leveling system
console.log('=== New Leveling System Test ===');

// Test XP requirements
console.log('\nXP Requirements per Level:');
for (let level = 1; level <= 10; level++) {
  const xpRequired = getXPRequiredForLevel(level);
  console.log(`Level ${level}: ${xpRequired} XP total`);
}

console.log('\nXP needed for each level up:');
for (let level = 1; level <= 10; level++) {
  const currentXP = getXPRequiredForLevel(level);
  const nextXP = getXPRequiredForLevel(level + 1);
  const xpForLevelUp = nextXP - currentXP;
  console.log(`Level ${level} -> ${level + 1}: ${xpForLevelUp} XP`);
}

// Test level calculation with various XP amounts
console.log('\nLevel Calculation Tests:');
const testXPAmounts = [0, 50, 100, 150, 250, 300, 450, 500, 700, 750, 1000];
testXPAmounts.forEach(xp => {
  const level = getCurrentLevel(xp);
  const progress = getLevelProgress(xp);
  const xpToNext = getXPToNextLevel(xp);
  console.log(`${xp} XP: Level ${level}, ${progress}% progress, ${xpToNext} XP to next`);
});

export {};