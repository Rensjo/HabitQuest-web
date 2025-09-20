import React, { useState } from "react";
import { motion } from "framer-motion";
import { featureIcons, actionIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import { PROTECTED_FALLBACK_CATEGORY } from "../../constants";
import type { Habit } from "../../types";

interface UncategorizedHabitsModalProps {
  habits: Habit[];
  categories: string[];
  onClose: () => void;
  onEditHabit: (habit: Habit) => void;
  onMoveHabit: (habitId: string, categoryId: string) => void;
}

export function UncategorizedHabitsModal({
  habits,
  categories,
  onClose,
  onEditHabit,
  onMoveHabit
}: UncategorizedHabitsModalProps) {
  const { playButtonClick } = useSoundEffectsOnly();
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

  // Filter out protected fallback category from available categories
  const availableCategories = categories.filter(cat => cat !== PROTECTED_FALLBACK_CATEGORY);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        onClose();
        playButtonClick();
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-2xl max-h-[80vh]
          bg-white/95 dark:bg-neutral-900/95
          backdrop-blur-md
          border border-amber-200/50 dark:border-amber-700/30
          rounded-3xl p-6 
          shadow-2xl shadow-amber-500/20 dark:shadow-amber-500/40
          relative overflow-hidden
          flex flex-col
        "
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Amber Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-yellow-500/15"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-lg"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-yellow-400/30 to-amber-400/30 rounded-full blur-lg"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="
                w-12 h-12 rounded-2xl 
                bg-gradient-to-br from-amber-400 to-orange-500
                flex items-center justify-center
                shadow-lg shadow-amber-500/25
              ">
                <featureIcons.info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  Uncategorized Habits
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {habits.length} habit{habits.length === 1 ? '' : 's'} need{habits.length === 1 ? 's' : ''} categorizing
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => {
                onClose();
                playButtonClick();
              }}
              className="
                w-8 h-8 rounded-full 
                bg-neutral-200/80 dark:bg-neutral-700/80
                text-neutral-600 dark:text-neutral-400
                flex items-center justify-center
                hover:bg-neutral-300/80 dark:hover:bg-neutral-600/80
                transition-colors duration-200
              "
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <featureIcons.x className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Habits List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                className="
                  relative overflow-hidden rounded-2xl p-4
                  bg-white/60 dark:bg-neutral-800/60
                  border border-amber-200/50 dark:border-amber-700/30
                  backdrop-blur-sm
                "
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {habit.title}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      {habit.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <featureIcons.calendar className="w-3 h-3" />
                        {habit.frequency}
                      </span>
                      <span className="flex items-center gap-1">
                        <featureIcons.zap className="w-3 h-3" />
                        {habit.xpOnComplete} XP
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => {
                        setExpandedHabit(expandedHabit === habit.id ? null : habit.id);
                        playButtonClick();
                      }}
                      className="
                        w-8 h-8 rounded-xl 
                        bg-amber-100 dark:bg-amber-900/30
                        text-amber-600 dark:text-amber-400
                        flex items-center justify-center
                        hover:bg-amber-200 dark:hover:bg-amber-800/50
                        transition-colors duration-200
                      "
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <featureIcons.chevronRight className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        onEditHabit(habit);
                        playButtonClick();
                      }}
                      className="
                        w-8 h-8 rounded-xl 
                        bg-blue-100 dark:bg-blue-900/30
                        text-blue-600 dark:text-blue-400
                        flex items-center justify-center
                        hover:bg-blue-200 dark:hover:bg-blue-800/50
                        transition-colors duration-200
                      "
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <actionIcons.edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Category Selection (expanded state) */}
                {expandedHabit === habit.id && availableCategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-700/30"
                  >
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Move to category:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableCategories.map((category) => (
                        <motion.button
                          key={category}
                          onClick={() => {
                            onMoveHabit(habit.id, category);
                            setExpandedHabit(null);
                            playButtonClick();
                          }}
                          className="
                            flex items-center gap-2 p-3 rounded-xl
                            bg-gradient-to-r from-neutral-100/80 to-neutral-200/80
                            dark:from-neutral-700/80 dark:to-neutral-800/80
                            text-neutral-700 dark:text-neutral-300
                            hover:from-neutral-200/80 hover:to-neutral-300/80
                            dark:hover:from-neutral-600/80 dark:hover:to-neutral-700/80
                            transition-all duration-200 text-sm text-left
                          "
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 bg-neutral-400"
                          />
                          <span className="truncate">{category}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Click the edit button to modify habits or use the move button to assign categories
              </p>
              <motion.button
                onClick={() => {
                  onClose();
                  playButtonClick();
                }}
                className="
                  px-4 py-2 rounded-xl font-medium text-sm
                  bg-gradient-to-r from-amber-500 to-orange-500
                  text-white shadow-lg shadow-amber-500/25
                  transition-all duration-200
                "
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 20px -5px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Done
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}