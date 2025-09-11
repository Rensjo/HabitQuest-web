import type { Frequency } from '../types';

export function getPeriodKey(freq: Frequency, d = new Date()): string {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  if (freq === "daily") return `${y}-${m}-${day}`;
  if (freq === "monthly") return `${y}-${m}`;
  if (freq === "yearly") return `${y}`;
  
  // Weekly calculation (ISO week)
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function todayISO(): string {
  return new Date().toISOString();
}

export function inferDateFromKey(pk: string, freq: Frequency): Date | null {
  try {
    if (freq === "daily") {
      const [y, m, d] = pk.split("-");
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    if (freq === "monthly") {
      const [y, m] = pk.split("-");
      return new Date(Number(y), Number(m) - 1, 1);
    }
    if (freq === "yearly") {
      return new Date(Number(pk), 0, 1);
    }
    if (freq === "weekly") {
      const [y, wStr] = pk.split("-W");
      const w = Number(wStr);
      const simple = new Date(Date.UTC(Number(y), 0, 1 + (w - 1) * 7));
      const dayOfWeek = simple.getUTCDay();
      const ISOweekStart = new Date(simple);
      ISOweekStart.setUTCDate(simple.getUTCDate() - ((dayOfWeek + 6) % 7));
      return ISOweekStart;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && 
         a.getMonth() === b.getMonth() && 
         a.getDate() === b.getDate();
}

export function formatDate(date: Date, format: 'short' | 'long' | 'numeric' = 'short'): string {
  switch (format) {
    case 'long':
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'numeric':
      return date.toLocaleDateString();
    default:
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
  }
}

export function getStreakInfo(completions: Record<string, string>, frequency: Frequency): {
  currentStreak: number;
  longestStreak: number;
} {
  const dates = Object.keys(completions)
    .map(key => inferDateFromKey(key, frequency))
    .filter(Boolean)
    .sort((a, b) => a!.getTime() - b!.getTime()) as Date[];

  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Calculate longest streak
  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1];
    const curr = dates[i];
    
    let expectedNext: Date;
    switch (frequency) {
      case 'daily':
        expectedNext = new Date(prev);
        expectedNext.setDate(expectedNext.getDate() + 1);
        break;
      case 'weekly':
        expectedNext = new Date(prev);
        expectedNext.setDate(expectedNext.getDate() + 7);
        break;
      case 'monthly':
        expectedNext = new Date(prev);
        expectedNext.setMonth(expectedNext.getMonth() + 1);
        break;
      case 'yearly':
        expectedNext = new Date(prev);
        expectedNext.setFullYear(expectedNext.getFullYear() + 1);
        break;
    }

    if (sameDay(curr, expectedNext) || 
        (frequency !== 'daily' && getPeriodKey(frequency, curr) === getPeriodKey(frequency, expectedNext))) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (from most recent completion)
  const today = new Date();
  const mostRecent = dates[dates.length - 1];
  
  if (getPeriodKey(frequency, mostRecent) === getPeriodKey(frequency, today)) {
    // Find consecutive days leading up to today
    let streakCount = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const curr = dates[i];
      const next = dates[i + 1];
      
      let expectedPrev: Date;
      switch (frequency) {
        case 'daily':
          expectedPrev = new Date(next);
          expectedPrev.setDate(expectedPrev.getDate() - 1);
          break;
        case 'weekly':
          expectedPrev = new Date(next);
          expectedPrev.setDate(expectedPrev.getDate() - 7);
          break;
        case 'monthly':
          expectedPrev = new Date(next);
          expectedPrev.setMonth(expectedPrev.getMonth() - 1);
          break;
        case 'yearly':
          expectedPrev = new Date(next);
          expectedPrev.setFullYear(expectedPrev.getFullYear() - 1);
          break;
      }

      if (sameDay(curr, expectedPrev) || 
          (frequency !== 'daily' && getPeriodKey(frequency, curr) === getPeriodKey(frequency, expectedPrev))) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreak = streakCount;
  }

  return { currentStreak, longestStreak };
}

export function getCalendarData(selectedDate: Date, startOfWeek: 0 | 1 = 0): {
  monthStart: Date;
  monthEnd: Date;
  cells: (Date | null)[];
  weekdays: string[];
} {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  // Adjust for start of week preference
  const leadingBlanks = (monthStart.getDay() - startOfWeek + 7) % 7;
  const daysInMonth = monthEnd.getDate();
  
  const cells: (Date | null)[] = [];
  
  // Add leading blanks
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push(null);
  }
  
  // Add days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));
  }
  
  // Add trailing blanks to complete the grid
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  
  const weekdays = startOfWeek === 0 
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return { monthStart, monthEnd, cells, weekdays };
}
