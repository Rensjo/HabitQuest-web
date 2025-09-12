/**
 * Utility functions for ensuring unique keys in React components
 */

/**
 * Generates a unique key for an item, with fallback to index
 * @param item - The item being mapped
 * @param index - The index in the array
 * @param prefix - Optional prefix for the fallback key
 * @returns A unique key string
 */
export const generateUniqueKey = (
  item: any,
  index: number,
  prefix: string = 'item'
): string => {
  // Try common ID fields
  if (item?.id && typeof item.id === 'string' && item.id.trim() !== '') {
    return item.id;
  }
  
  if (item?.uuid && typeof item.uuid === 'string' && item.uuid.trim() !== '') {
    return item.uuid;
  }
  
  if (item?.key && typeof item.key === 'string' && item.key.trim() !== '') {
    return item.key;
  }
  
  // For string items (like categories)
  if (typeof item === 'string' && item.trim() !== '') {
    return `${prefix}-${item}`;
  }
  
  // Fallback to index with prefix
  return `${prefix}-${index}`;
};

/**
 * Generates keys for habit items with specific handling
 * @param habit - The habit object
 * @param index - The index in the array
 * @param context - Context for the key (e.g., 'main', 'insights', 'analytics')
 * @returns A unique key string
 */
export const generateHabitKey = (
  habit: any,
  index: number,
  context: string = 'main'
): string => {
  if (habit?.id && typeof habit.id === 'string' && habit.id.trim() !== '') {
    return habit.id;
  }
  
  // Generate a key based on habit properties as fallback
  if (habit?.title && habit?.frequency) {
    return `habit-${context}-${habit.title.replace(/\s+/g, '-').toLowerCase()}-${habit.frequency}-${index}`;
  }
  
  return `habit-${context}-${index}`;
};

/**
 * Generates keys for inventory items
 * @param item - The inventory item
 * @param index - The index in the array
 * @param context - Context for the key (e.g., 'shop', 'inventory')
 * @returns A unique key string
 */
export const generateInventoryKey = (
  item: any,
  index: number,
  context: string = 'inventory'
): string => {
  if (item?.id && typeof item.id === 'string' && item.id.trim() !== '') {
    return item.id;
  }
  
  // For inventory items, use name and timestamp if available
  if (item?.name && item?.redeemedAt) {
    return `${context}-${item.name.replace(/\s+/g, '-').toLowerCase()}-${item.redeemedAt}-${index}`;
  }
  
  return `${context}-${index}`;
};

/**
 * Validates an array to ensure all items would have unique keys
 * @param items - Array of items to validate
 * @param keyGenerator - Function to generate keys
 * @returns Object with validation results
 */
export const validateUniqueKeys = <T>(
  items: T[],
  keyGenerator: (item: T, index: number) => string
): {
  isValid: boolean;
  duplicates: string[];
  emptyKeys: number[];
} => {
  const keys = items.map(keyGenerator);
  const keySet = new Set();
  const duplicates: string[] = [];
  const emptyKeys: number[] = [];
  
  keys.forEach((key, index) => {
    if (!key || key.trim() === '') {
      emptyKeys.push(index);
    } else if (keySet.has(key)) {
      if (!duplicates.includes(key)) {
        duplicates.push(key);
      }
    } else {
      keySet.add(key);
    }
  });
  
  return {
    isValid: duplicates.length === 0 && emptyKeys.length === 0,
    duplicates,
    emptyKeys
  };
};
