import React, { useState } from "react";
import { motion } from "framer-motion";
import { FREQUENCIES } from "../../constants";
import { featureIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import { CustomSelect } from "../ui/CustomSelect";
import type { Frequency, Habit } from "../../types";

interface EditHabitModalProps {
  habit: Habit;
  categories: string[];
  onClose: () => void;
  onSave: (updates: Partial<Habit>) => void;
}

export function EditHabitModal({
  habit,
  categories,
  onClose,
  onSave
}: EditHabitModalProps) {
  const [title, setTitle] = useState(habit.title);
  const [frequency, setFrequency] = useState<Frequency>(habit.frequency);
  const [category, setCategory] = useState(habit.category);
  const [xpOnComplete, setXpOnComplete] = useState(habit.xpOnComplete);
  const [isRecurring, setIsRecurring] = useState(habit.isRecurring ?? true);
  const [specificDate, setSpecificDate] = useState(habit.specificDate || "");
  
  const { playButtonClick } = useSoundEffectsOnly();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    
    playButtonClick();
    onSave({
      title: title.trim(),
      frequency,
      category,
      xpOnComplete,
      isRecurring,
      specificDate: specificDate || null,
    });
  }

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
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-lg
          bg-white/90 dark:bg-neutral-900/90
          backdrop-blur-xl
          border border-white/20 dark:border-neutral-700/30
          rounded-3xl p-8 
          shadow-2xl shadow-black/20 dark:shadow-black/40
          relative overflow-hidden
        "
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Blue/Purple Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 dark:from-blue-500/15 dark:via-purple-500/10 dark:to-indigo-500/15"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-400/15 dark:to-purple-400/15 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-indigo-400/15 dark:from-purple-400/10 dark:to-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-blue-200/30 dark:border-transparent"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <featureIcons.settings className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 bg-clip-text text-transparent mb-2">
              Edit Habit
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">
              Modify your habit details
            </p>
          </div>

          {/* Form Content */}
          <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 space-y-5">
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Habit Title
              </label>
              <input
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-white/90 dark:bg-neutral-800/90
                  border border-neutral-300/60 dark:border-neutral-600/60
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-500 dark:placeholder-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  backdrop-blur-sm transition-all duration-200
                "
                placeholder="What do you want to achieve?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Frequency and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Frequency Dropdown */}
              <div>
                <CustomSelect
                  label="Frequency"
                  options={FREQUENCIES.map(f => ({
                    value: f,
                    label: f.charAt(0).toUpperCase() + f.slice(1)
                  }))}
                  value={frequency}
                  onChange={(value) => setFrequency(value as Frequency)}
                  placeholder="Select frequency"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <CustomSelect
                  label="Category"
                  options={categories.map(c => ({
                    value: c,
                    label: c
                  }))}
                  value={category}
                  onChange={setCategory}
                  placeholder="Select category"
                />
              </div>
            </div>

            {/* XP Points */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                XP Reward
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-white/90 dark:bg-neutral-800/90
                  border border-neutral-300/60 dark:border-neutral-600/60
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-500 dark:placeholder-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  backdrop-blur-sm transition-all duration-200
                "
                value={xpOnComplete}
                onChange={(e) => setXpOnComplete(Number(e.target.value || 1))}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                XP earned when completing this habit
              </p>
            </div>

            {/* Habit Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Habit Type
              </label>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => setIsRecurring(true)}
                  className={`
                    flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200
                    ${isRecurring 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300/60 dark:hover:bg-neutral-600/60'
                    }
                  `}
                  whileTap={{ scale: 0.98 }}
                >
                  Recurring
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setIsRecurring(false)}
                  className={`
                    flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200
                    ${!isRecurring 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300/60 dark:hover:bg-neutral-600/60'
                    }
                  `}
                  whileTap={{ scale: 0.98 }}
                >
                  Specific Date
                </motion.button>
              </div>
            </div>

            {/* Specific Date Input (if not recurring) */}
            {!isRecurring && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Specific Date
                </label>
                <input
                  type="date"
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/90 dark:bg-neutral-800/90
                    border border-neutral-300/60 dark:border-neutral-600/60
                    text-neutral-900 dark:text-neutral-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <motion.button
              type="button"
              onClick={() => {
                onClose();
                playButtonClick();
              }}
              className="
                px-6 py-3 rounded-2xl font-medium text-sm
                bg-white/80 dark:bg-neutral-800/50
                text-neutral-700 dark:text-neutral-300
                border border-neutral-300/50 dark:border-neutral-600/30
                hover:bg-neutral-100/80 dark:hover:bg-neutral-700/50
                backdrop-blur-sm transition-all duration-200
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="
                relative overflow-hidden px-6 py-3 rounded-2xl font-medium text-sm
                bg-gradient-to-r from-blue-600 to-purple-600
                text-white border-0
                shadow-lg shadow-blue-500/25
                transition-all duration-300
              "
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.check className="w-4 h-4" />
                Save Changes
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}