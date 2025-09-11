import { useCallback, useRef, useEffect } from 'react';

interface HabitWorkerMessage {
  type: 'CALCULATE_STREAKS' | 'PROCESS_COMPLETIONS' | 'GENERATE_STATS';
  payload: any;
}

interface HabitWorkerResponse {
  type: string;
  result: any;
  error?: string;
}

export function useHabitWorker() {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (result: any) => void>>(new Map());

  useEffect(() => {
    // Create worker
    const worker = new Worker(
      new URL('../workers/habitWorker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<HabitWorkerResponse>) => {
      const { type, result, error } = event.data;
      
      if (error) {
        console.error('Worker error:', error);
        return;
      }

      const callback = callbacksRef.current.get(type);
      if (callback) {
        callback(result);
        callbacksRef.current.delete(type);
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const calculateStreaks = useCallback((habits: any[], selectedDate: Date, callback: (result: any) => void) => {
    if (!workerRef.current) return;

    callbacksRef.current.set('STREAKS_CALCULATED', callback);
    workerRef.current.postMessage({
      type: 'CALCULATE_STREAKS',
      payload: { habits, selectedDate }
    } as HabitWorkerMessage);
  }, []);

  const processCompletions = useCallback((habits: any[], dateRange: { start: Date; end: Date }, callback: (result: any) => void) => {
    if (!workerRef.current) return;

    callbacksRef.current.set('COMPLETIONS_PROCESSED', callback);
    workerRef.current.postMessage({
      type: 'PROCESS_COMPLETIONS',
      payload: { habits, dateRange }
    } as HabitWorkerMessage);
  }, []);

  const generateStats = useCallback((habits: any[], timeframe: 'week' | 'month' | 'year', callback: (result: any) => void) => {
    if (!workerRef.current) return;

    callbacksRef.current.set('STATS_GENERATED', callback);
    workerRef.current.postMessage({
      type: 'GENERATE_STATS',
      payload: { habits, timeframe }
    } as HabitWorkerMessage);
  }, []);

  return {
    calculateStreaks,
    processCompletions,
    generateStats
  };
}
