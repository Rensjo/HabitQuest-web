// Habit processing worker for background calculations
interface HabitWorkerMessage {
  type: 'CALCULATE_STREAKS' | 'PROCESS_COMPLETIONS' | 'GENERATE_STATS';
  payload: any;
}

interface HabitWorkerResponse {
  type: string;
  result: any;
  error?: string;
}

// Worker message handler
self.addEventListener('message', (event: MessageEvent<HabitWorkerMessage>) => {
  const { type, payload } = event.data;
  
  try {
    switch (type) {
      case 'CALCULATE_STREAKS':
        const streakResult = calculateStreaks(payload.habits, payload.selectedDate);
        self.postMessage({ type: 'STREAKS_CALCULATED', result: streakResult });
        break;
        
      case 'PROCESS_COMPLETIONS':
        const completionResult = processCompletions(payload.habits, payload.dateRange);
        self.postMessage({ type: 'COMPLETIONS_PROCESSED', result: completionResult });
        break;
        
      case 'GENERATE_STATS':
        const statsResult = generateStats(payload.habits, payload.timeframe);
        self.postMessage({ type: 'STATS_GENERATED', result: statsResult });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Utility functions for habit calculations
function calculateStreaks(habits: any[], selectedDate: Date) {
  return habits.map(habit => {
    const completions = Object.keys(habit.completions || {}).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate streaks based on frequency
    completions.forEach((completion, index) => {
      if (index === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(completions[index - 1]);
        const currDate = new Date(completion);
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1 || (habit.frequency === 'weekly' && dayDiff <= 7)) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    });
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate current streak (if last completion was recent)
    if (completions.length > 0) {
      const lastCompletion = new Date(completions[completions.length - 1]);
      const daysSinceLastCompletion = Math.floor(
        (selectedDate.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastCompletion <= 1) {
        currentStreak = tempStreak;
      }
    }
    
    return {
      id: habit.id,
      currentStreak,
      longestStreak
    };
  });
}

function processCompletions(habits: any[], dateRange: { start: Date; end: Date }) {
  const completionData: Record<string, number> = {};
  
  habits.forEach(habit => {
    Object.entries(habit.completions || {}).forEach(([, timestamp]) => {
      const completionDate = new Date(timestamp as string | number);
      
      if (completionDate >= dateRange.start && completionDate <= dateRange.end) {
        const dayKey = completionDate.toISOString().split('T')[0];
        completionData[dayKey] = (completionData[dayKey] || 0) + habit.xpOnComplete;
      }
    });
  });
  
  return completionData;
}

function generateStats(habits: any[], timeframe: 'week' | 'month' | 'year') {
  const now = new Date();
  let startDate: Date;
  
  switch (timeframe) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }
  
  const stats = {
    totalCompletions: 0,
    totalXP: 0,
    categoriesCount: new Set<string>(),
    averagePerDay: 0,
    mostActiveDay: '',
    dailyCompletions: {} as Record<string, number>
  };
  
  habits.forEach(habit => {
    stats.categoriesCount.add(habit.category);
    
    Object.entries(habit.completions || {}).forEach(([, timestamp]) => {
      const completionDate = new Date(timestamp as string | number);
      
      if (completionDate >= startDate && completionDate <= now) {
        stats.totalCompletions++;
        stats.totalXP += habit.xpOnComplete;
        
        const dayKey = completionDate.toISOString().split('T')[0];
        stats.dailyCompletions[dayKey] = (stats.dailyCompletions[dayKey] || 0) + 1;
      }
    });
  });
  
  // Calculate average per day
  const daysInPeriod = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  stats.averagePerDay = Math.round((stats.totalCompletions / daysInPeriod) * 100) / 100;
  
  // Find most active day
  const dayFrequency = Object.values(stats.dailyCompletions);
  if (dayFrequency.length > 0) {
    const maxCompletions = Math.max(...dayFrequency);
    stats.mostActiveDay = Object.keys(stats.dailyCompletions).find(
      day => stats.dailyCompletions[day] === maxCompletions
    ) || '';
  }
  
  return {
    ...stats,
    categoriesCount: stats.categoriesCount.size
  };
}
