/**
 * ================================================================================================
 * HABITQUEST MODAL COMPONENTS
 * ================================================================================================
 * 
 * Modal components for creating habits, rewards, and categories
 * 
 * @version 4.0.0
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FREQUENCIES } from "../../constants";
import { classNames } from "../../utils";
import { featureIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import type { Frequency, Habit } from "../../types";

// ================================================================================================
// ADD HABIT MODAL
// ================================================================================================

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
          bg-white/95 dark:bg-neutral-900/60
          backdrop-blur-md
          border border-neutral-200/50 dark:border-0
          rounded-3xl p-8 
          shadow-xl shadow-black/10 dark:shadow-black/40
          relative overflow-hidden
        "
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
          ...(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? {
            background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.8) 100%)'
          } : {})
        }}
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Academic Quest Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/8 via-blue-600/8 to-violet-600/8 dark:from-purple-600/10 dark:via-blue-600/10 dark:to-violet-600/10"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-purple-400/25 to-violet-600/25 dark:from-purple-400/20 dark:to-violet-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-blue-400/25 to-cyan-600/25 dark:from-blue-400/20 dark:to-cyan-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-600/20 dark:from-pink-400/15 dark:to-purple-600/15 rounded-full blur-2xl"></div>
        </div>

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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-violet-700 dark:from-purple-600 dark:via-blue-600 dark:to-violet-600 bg-clip-text text-transparent mb-2">
              Create New Habit
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Build consistency and earn XP</p>
          </div>

          {/* Form Content */}
          <div className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30">
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
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Frequency
                  </label>
                  <select
                    className="
                      w-full rounded-xl px-4 py-3 text-sm
                      bg-white/80 dark:bg-neutral-800/50
                      border border-neutral-300/50 dark:border-neutral-600/30
                      text-neutral-900 dark:text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                      backdrop-blur-sm transition-all duration-200
                    "
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as Frequency)}
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f} className="capitalize bg-white dark:bg-neutral-800">{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Category
                  </label>
                  <select
                    className="
                      w-full rounded-xl px-4 py-3 text-sm
                      bg-white/80 dark:bg-neutral-800/50
                      border border-neutral-300/50 dark:border-neutral-600/30
                      text-neutral-900 dark:text-neutral-100
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                      backdrop-blur-sm transition-all duration-200
                    "
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-neutral-800">{c}</option>
                    ))}
                  </select>
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

// ================================================================================================
// ADD REWARD MODAL
// ================================================================================================

export function AddRewardModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (p: { name: string; cost: number }) => void;
}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState<number>(100);
  const { playButtonClick } = useSoundEffectsOnly();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    playButtonClick();
    onSave({ name, cost: Math.max(1, Number(cost || 1)) });
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
          bg-white/95 dark:bg-neutral-900/60
          backdrop-blur-md
          border border-neutral-200/50 dark:border-0
          rounded-3xl p-8 
          shadow-xl shadow-black/10 dark:shadow-black/40
          relative overflow-hidden
        "
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
          ...(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? {
            background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.8) 100%)'
          } : {})
        }}
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Amber/Orange Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-600/8 via-orange-600/8 to-red-600/8 dark:from-amber-600/10 dark:via-orange-600/10 dark:to-red-600/10"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-amber-400/25 to-orange-600/25 dark:from-amber-400/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-yellow-400/25 to-amber-600/25 dark:from-yellow-400/20 dark:to-amber-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-600/20 dark:from-orange-400/15 dark:to-red-600/15 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 dark:from-amber-500/20 dark:to-orange-500/20 backdrop-blur-sm border border-amber-200/30 dark:border-transparent"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <featureIcons.gift className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 bg-clip-text text-transparent mb-2">
              Create New Reward
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Set motivating incentives for your progress</p>
          </div>

          {/* Form Content */}
          <div className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30">
            <div className="space-y-5">
              {/* Reward Name Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Reward Name
                </label>
                <input
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  placeholder="e.g., Friday movie night"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Cost Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cost (Points)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value || 0))}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Points required to redeem this reward</p>
              </div>
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
                bg-gradient-to-r from-amber-600 to-orange-600
                text-white border-0
                shadow-lg shadow-amber-500/25
                transition-all duration-300
              "
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.gift className="w-4 h-4" />
                Create Reward
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

// ================================================================================================
// ADD CATEGORY MODAL
// ================================================================================================

// Export the new modal components
export { RewardShopModal } from './RewardShopModal';
export { DayInsightsModal } from './DayInsightsModal';
export { AnalyticsModal } from './AnalyticsModal';
export { SettingsModal } from './SettingsModal';
export { ModalSystem } from './ModalSystem';

export function AddCategoryModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (p: { name: string; target: number }) => void;
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState<number>(200);
  const { playButtonClick } = useSoundEffectsOnly();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    playButtonClick();
    onSave({ name, target });
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
          bg-white/95 dark:bg-neutral-900/60
          backdrop-blur-md
          border border-neutral-200/50 dark:border-0
          rounded-3xl p-8 
          shadow-xl shadow-black/10 dark:shadow-black/40
          relative overflow-hidden
        "
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
          ...(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? {
            background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.8) 100%)'
          } : {})
        }}
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Emerald/Cyan Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-600/8 via-cyan-600/8 to-teal-600/8 dark:from-emerald-600/10 dark:via-cyan-600/10 dark:to-teal-600/10"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-emerald-400/25 to-cyan-600/25 dark:from-emerald-400/20 dark:to-cyan-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-cyan-400/25 to-teal-600/25 dark:from-cyan-400/20 dark:to-teal-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-600/20 dark:from-green-400/15 dark:to-emerald-600/15 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 dark:from-emerald-500/20 dark:to-cyan-500/20 backdrop-blur-sm border border-emerald-200/30 dark:border-transparent"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <featureIcons.target className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-cyan-700 to-teal-700 dark:from-emerald-600 dark:via-cyan-600 dark:to-teal-600 bg-clip-text text-transparent mb-2">
              Create New Category
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Organize your habits by life areas</p>
          </div>

          {/* Form Content */}
          <div className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30">
            <div className="space-y-5">
              {/* Category Name Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Category Name
                </label>
                <input
                  className="
                    w-full rounded-xl px-4 py-3 text-sm uppercase
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  placeholder="e.g., HEALTH"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Names are automatically stored in uppercase for consistency
                </p>
              </div>

              {/* Monthly Target Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Monthly XP Target
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value || 0))}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">XP goal for this category each month</p>
              </div>
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
                bg-gradient-to-r from-emerald-600 to-cyan-600
                text-white border-0
                shadow-lg shadow-emerald-500/25
                transition-all duration-300
              "
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.target className="w-4 h-4" />
                Create Category
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

