import React, { useState } from "react";
import { motion } from "framer-motion";
import { FREQUENCIES } from "../../constants";
import { classNames } from "../../utils";
import { featureIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import { CustomSelect } from "../ui/CustomSelect";
import type { Frequency, Habit } from "../../types";

export function AddHabitModal({
  onClose,
  onSave,
  categories,
}: {
  onClose: () => void;
  onSave: (h: Partial<Habit>) => void;
  categories: string[];
}) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [category, setCategory] = useState<string>(categories[0] || "");
  const { playButtonClick, playHover } = useSoundEffectsOnly();
  const [xpOnComplete, setXpOnComplete] = useState(10);
  const [isRecurring, setIsRecurring] = useState(true);
  const [specificDate, setSpecificDate] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    playButtonClick();
    onSave({
      title,
      frequency,
      category,
      xpOnComplete,
      isRecurring,
      specificDate: isRecurring ? null : specificDate || null,
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
        {/* Purple/Violet Theme Gradient Background - Matching Shop Design */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-blue-500/10 dark:from-purple-500/15 dark:via-violet-500/10 dark:to-blue-500/15"></div>
        
        {/* Floating Gradient Orbs - Matching Shop Design */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-violet-400/20 dark:from-purple-400/15 dark:to-violet-400/15 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-violet-400/15 to-blue-400/15 dark:from-violet-400/10 dark:to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-purple-400/10 dark:from-pink-400/5 dark:to-purple-400/5 rounded-full blur-xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/30 to-violet-500/30 dark:from-purple-500/20 dark:to-violet-500/20 backdrop-blur-sm border border-purple-200/30 dark:border-transparent"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <featureIcons.sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-violet-700 to-blue-700 dark:from-purple-600 dark:via-violet-600 dark:to-blue-600 bg-clip-text text-transparent mb-2">
              Create New Habit
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Build consistency and earn XP</p>
          </div>

          {/* Form Content */}
          <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Habit Title
                </label>
                <input
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  placeholder="e.g., 25-min morning workout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Frequency and Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* XP and Type Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    XP Reward
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="
                      w-full rounded-xl px-4 py-3 text-sm
                      bg-white/80 dark:bg-neutral-800/50
                      border border-neutral-300/50 dark:border-neutral-600/30
                      text-neutral-900 dark:text-neutral-100
                      placeholder-neutral-500 dark:placeholder-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                      backdrop-blur-sm transition-all duration-200
                    "
                    value={xpOnComplete}
                    onChange={(e) => setXpOnComplete(Number(e.target.value || 0))}
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Points earned on completion</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Type
                  </label>
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      className={classNames(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isRecurring 
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg border-0" 
                          : "bg-white/60 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 border border-neutral-300/50 dark:border-neutral-600/30"
                      )}
                      onClick={() => {
                        setIsRecurring(true);
                        playButtonClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => playHover()}
                      whileTap={{ scale: 0.98 }}
                    >
                      Recurring
                    </motion.button>
                    <motion.button
                      type="button"
                      className={classNames(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        !isRecurring 
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg border-0" 
                          : "bg-white/60 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 border border-neutral-300/50 dark:border-neutral-600/30"
                      )}
                      onClick={() => {
                        setIsRecurring(false);
                        playButtonClick();
                      }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => playHover()}
                      whileTap={{ scale: 0.98 }}
                    >
                      Specific
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Specific Date (conditional) */}
              {!isRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Specific Date
                  </label>
                  <input
                    type="date"
                    className="
                      w-full rounded-xl px-4 py-3 text-sm
                      bg-white/80 dark:bg-neutral-800/50
                      border border-neutral-300/50 dark:border-neutral-600/30
                      text-neutral-900 dark:text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                      backdrop-blur-sm transition-all duration-200
                    "
                    value={specificDate}
                    onChange={(e) => setSpecificDate(e.target.value)}
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    For weekly/monthly/yearly habits, this anchors the period they belong to.
                  </p>
                </motion.div>
              )}
            </div>
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
                bg-gradient-to-r from-purple-600 to-violet-600
                text-white border-0
                shadow-lg shadow-purple-500/25
                transition-all duration-300
              "
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.sparkles className="w-4 h-4" />
                Create Habit
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}