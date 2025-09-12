import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '../../utils';
import { generateHabitKey } from '../../utils/keyUtils';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import type { Habit, Frequency } from '../../types';

interface HabitListSectionProps {
  visibleHabits: Habit[];
  selectedDate: Date;
  activeFreq: Frequency;
  onHabitComplete: (habitId: string, date: Date) => void;
  onHabitDelete: (habitId: string) => void;
  getPeriodKey: (frequency: Frequency, date: Date) => string;
}

export const HabitListSection: React.FC<HabitListSectionProps> = ({
  visibleHabits,
  selectedDate,
  activeFreq,
  onHabitComplete,
  onHabitDelete,
  getPeriodKey
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  return (
    <motion.div 
      className="mt-4 grid gap-3 md:grid-cols-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <AnimatePresence>
        {visibleHabits.length === 0 && (
          <motion.div 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-full text-slate-400 text-center py-8"
          >
            No habits for this date/frequency. Add one to get started!
          </motion.div>
        )}
        {visibleHabits.map((h, index) => {
          const pk = getPeriodKey(h.frequency, selectedDate);
          const done = Boolean(h.completions?.[pk]);
          
          return (
            <motion.div 
              key={generateHabitKey(h, index, 'main')} 
              layout 
              initial={{ opacity: 0, y: 4 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -4 }}
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ 
                duration: 0.2, 
                ease: "easeOut",
                layout: { duration: 0.3, ease: "easeInOut" }
              }}
            >
              <motion.div 
                className="flex items-center justify-between border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-4"
                whileHover={{ 
                  borderColor: "rgba(96, 165, 250, 0.3)",
                  boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <div>
                  <div className="font-semibold flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                    {h.title}
                    <span
                      className={
                        classNames(
                          "text-[10px] px-2 py-0.5 rounded-full border",
                          h.isRecurring ? "border-emerald-400 text-emerald-600 dark:text-emerald-300" : "border-cyan-400 text-cyan-600 dark:text-cyan-300"
                        )
                      }
                    >
                      {h.isRecurring ? "Recurring" : "Specific"}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    {h.category} • {h.frequency} • {h.xpOnComplete} XP
                    {h.specificDate && !h.isRecurring && (
                      <span className="ml-2 text-neutral-700 dark:text-neutral-300">on {new Date(h.specificDate).toLocaleDateString()}</span>
                    )}
                    {h.bestStreak ? (
                      <span className="ml-2 text-amber-600 dark:text-amber-300">Best streak: {h.bestStreak}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => onHabitComplete(h.id, selectedDate)}
                    className={classNames(
                      "px-3 py-2 rounded-xl text-sm border transition-all duration-150",
                      done
                        ? "bg-emerald-400 text-black border-emerald-300"
                        : "bg-neutral-200/80 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    )}
                    title={done ? "Undo completion" : "Mark complete"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    {done ? "Completed" : "Complete"}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      onHabitDelete(h.id);
                      playButtonClick();
                    }}
                    className="px-3 py-2 rounded-xl text-sm border bg-red-100/80 dark:bg-red-500/20 border-red-300 dark:border-red-500/40 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 transition-colors duration-150"
                    title="Delete habit"
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => playHover()}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};
