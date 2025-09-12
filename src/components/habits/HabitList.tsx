import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames, getPeriodKey } from '../../utils';
import { featureIcons, frequencyIcons } from '../../utils/icons';
import { SoundButton } from '../ui/SoundButton';
import type { Habit, Frequency } from '../../types';

interface HabitListProps {
  habits: Habit[];
  selectedDate: Date;
  activeFreq: Frequency;
  onHabitComplete: (habitId: string, date: Date) => void;
  onHabitDelete: (habitId: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  selectedDate,
  activeFreq,
  onHabitComplete,
  onHabitDelete
}) => {
  const visibleHabits = habits.filter(h => h.frequency === activeFreq);

  if (visibleHabits.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-500/10 dark:from-cyan-400/5 dark:to-blue-500/5 mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <featureIcons.target className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
        </motion.div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          No {activeFreq} habits yet
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          Create your first {activeFreq} habit to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {visibleHabits.map((habit, index) => {
          const pk = getPeriodKey(habit.frequency, selectedDate);
          const done = Boolean(habit.completions?.[pk]);
          const FrequencyIcon = frequencyIcons[habit.frequency];
          
          return (
            <motion.div
              key={habit.id || `habit-${index}`}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className="
                bg-white/70 dark:bg-neutral-800/70 
                backdrop-blur-sm
                border border-neutral-200/50 dark:border-neutral-700/40
                rounded-2xl p-6
                shadow-sm shadow-black/5 dark:shadow-black/10
                relative overflow-hidden
                group
              "
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                transition: { duration: 0.1, ease: "easeOut" }
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-500/5 to-transparent dark:from-neutral-400/5 dark:to-transparent rounded-2xl group-hover:from-neutral-500/10 group-hover:to-transparent transition-all duration-200"></div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 dark:from-cyan-400/15 dark:to-blue-500/15">
                      <FrequencyIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="px-2 py-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-lg">
                          {habit.category}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{habit.frequency}</span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {habit.xpOnComplete} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {habit.description && (
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-4">
                      {habit.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <SoundButton
                    variant={done ? "success" : "outline"}
                    size="sm"
                    onClick={() => onHabitComplete(habit.id, selectedDate)}
                    className={classNames(
                      "transition-all duration-150",
                      done
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30"
                        : "hover:border-emerald-400/40"
                    )}
                    icon={done ? "checkCircle" : "circle"}
                  >
                    {done ? "Completed" : "Complete"}
                  </SoundButton>
                  
                  <SoundButton
                    variant="danger"
                    size="sm"
                    onClick={() => onHabitDelete(habit.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    icon="trash"
                  >
                    Delete
                  </SoundButton>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};
