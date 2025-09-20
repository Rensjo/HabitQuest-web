import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '../../utils';
import { generateHabitKey } from '../../utils/keyUtils';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { featureIcons, actionIcons } from '../../utils/icons';
import { EditHabitModal, DeleteHabitModal } from '../modals';
import type { Habit, Frequency } from '../../types';

interface HabitListSectionProps {
  visibleHabits: Habit[];
  selectedDate: Date;
  activeFreq: Frequency;
  categories: string[];
  onHabitComplete: (habitId: string, date: Date) => void;
  onHabitDelete: (habitId: string) => void;
  onHabitEdit: (habitId: string, updates: Partial<Habit>) => void;
  getPeriodKey: (frequency: Frequency, date: Date) => string;
}

export const HabitListSection: React.FC<HabitListSectionProps> = ({
  visibleHabits,
  selectedDate,
  activeFreq,
  categories,
  onHabitComplete,
  onHabitDelete,
  onHabitEdit,
  getPeriodKey
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const handleEditHabit = (habit: Habit) => {
    playButtonClick();
    setEditingHabit(habit);
  };

  const handleSaveEditedHabit = (updates: Partial<Habit>) => {
    if (editingHabit) {
      // Pass the habit ID and the updates to the parent component
      onHabitEdit(editingHabit.id, updates);
      setEditingHabit(null);
    }
  };

  const handleCloseEditModal = () => {
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habit: Habit) => {
    playButtonClick();
    setDeletingHabit(habit);
  };

  const handleConfirmDeleteHabit = () => {
    if (deletingHabit) {
      onHabitDelete(deletingHabit.id);
      setDeletingHabit(null);
    }
  };

  const handleCancelDeleteHabit = () => {
    setDeletingHabit(null);
  };

  return (
    <motion.div 
      className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
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
                className="relative group border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl"
                whileHover={{ 
                  borderColor: "rgba(96, 165, 250, 0.4)",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {/* Hover Action Buttons - Top Right Corner */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex gap-1.5">
                  <motion.button
                    onClick={() => handleEditHabit(h)}
                    onMouseEnter={() => playHover()}
                    className="w-8 h-8 rounded-full bg-blue-50/90 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-600/50 hover:bg-blue-100 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-150 shadow-sm backdrop-blur-sm"
                    title="Edit habit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <actionIcons.edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteHabit(h)}
                    onMouseEnter={() => playHover()}
                    className="w-8 h-8 rounded-full bg-red-50/90 dark:bg-red-900/50 border border-red-200 dark:border-red-600/50 hover:bg-red-100 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 flex items-center justify-center transition-all duration-150 shadow-sm backdrop-blur-sm"
                    title="Delete habit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <featureIcons.trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Habit Content Layout */}
                <div className="flex flex-col h-full pr-4">
                  {/* Header Section */}
                  <div className="flex-shrink-0 mb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base leading-snug truncate">
                        {h.title}
                      </h3>
                      <span
                        className={classNames(
                          "text-[10px] px-2.5 py-1 rounded-full border font-medium flex-shrink-0",
                          h.isRecurring 
                            ? "border-emerald-300/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-900/30" 
                            : "border-cyan-300/60 text-cyan-700 dark:text-cyan-300 bg-cyan-50/80 dark:bg-cyan-900/30"
                        )}
                      >
                        {h.isRecurring ? "Recurring" : "Specific"}
                      </span>
                    </div>
                    
                    {/* Habit Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          {h.category}
                        </span>
                        <span>•</span>
                        <span>{h.frequency}</span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{h.xpOnComplete} XP</span>
                      </div>
                      
                      {h.specificDate && !h.isRecurring && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          📅 {new Date(h.specificDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {h.bestStreak && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          🔥 Best streak: {h.bestStreak} {h.bestStreak === 1 ? 'day' : 'days'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button - Bottom */}
                  <div className="flex-shrink-0 mt-auto">
                    <motion.button
                      onClick={() => onHabitComplete(h.id, selectedDate)}
                      className={classNames(
                        "w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 border-2",
                        done
                          ? "bg-emerald-500 hover:bg-emerald-400 border-emerald-400 text-white shadow-sm"
                          : "bg-neutral-50 dark:bg-neutral-700/50 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600/60 text-neutral-700 dark:text-neutral-200 hover:border-blue-300 dark:hover:border-blue-500"
                      )}
                      title={done ? "Undo completion" : "Mark complete"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                    >
                      {done ? (
                        <span className="flex items-center justify-center gap-2">
                          <featureIcons.check className="w-4 h-4" />
                          Completed
                        </span>
                      ) : (
                        "Mark Complete"
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Edit Habit Modal */}
      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          categories={categories}
          onSave={handleSaveEditedHabit}
          onClose={handleCloseEditModal}
        />
      )}

      {/* Delete Habit Modal */}
      {deletingHabit && (
        <DeleteHabitModal
          habit={deletingHabit}
          onConfirm={handleConfirmDeleteHabit}
          onClose={handleCancelDeleteHabit}
        />
      )}
    </motion.div>
  );
};
