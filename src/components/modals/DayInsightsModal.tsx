import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { generateHabitKey } from '../../utils/keyUtils';
import { classNames } from '../../utils';
import type { DayInsights } from '../../types';

interface DayInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  dayInsights: DayInsights;
  onHabitComplete: (habitId: string, date: Date) => void;
  getPeriodKey: (frequency: string, date: Date) => string;
}

export const DayInsightsModal: React.FC<DayInsightsModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  dayInsights,
  onHabitComplete,
  getPeriodKey
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          onClose();
          playButtonClick();
        }}
      />
      <motion.div 
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        onClick={() => {
          onClose();
          playButtonClick();
        }}
      >
        <motion.div
          className="
            w-full max-w-2xl rounded-3xl p-8 
            bg-white/95 dark:bg-neutral-900/60
            backdrop-blur-md
            border border-neutral-200/50 dark:border-0
            shadow-xl
            relative overflow-hidden
          "
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(248, 250, 252, 0.9) 50%, 
              rgba(241, 245, 249, 0.85) 100%)`,
            ...(document.documentElement.classList.contains('dark') && {
              background: `linear-gradient(135deg, 
                rgba(15, 23, 42, 0.6) 0%, 
                rgba(30, 41, 59, 0.65) 50%, 
                rgba(51, 65, 85, 0.7) 100%)`
            })
          }}
        >
          {/* Academic Quest Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/6 to-cyan-500/8 dark:from-blue-500/12 dark:via-purple-500/10 dark:to-cyan-500/12 rounded-3xl opacity-60"></div>
          
          {/* Floating Gradient Orbs */}
          <motion.div 
            className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-400/30 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 dark:from-cyan-400/20 dark:to-emerald-400/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/3 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400/25 to-indigo-400/25 dark:from-purple-400/15 dark:to-indigo-400/15 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            {/* Enhanced Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Animated Icon Container */}
                <motion.div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 dark:from-blue-500/15 dark:to-purple-600/15 border border-blue-200/30 dark:border-transparent backdrop-blur-sm"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <featureIcons.barChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </motion.div>
                
                <div>
                  <motion.h3 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-600 dark:to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Day Insights
                  </motion.h3>
                  <motion.div 
                    className="text-sm text-neutral-700 dark:text-neutral-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </motion.div>
                </div>
              </div>
              
              {/* Enhanced Close Button */}
              <motion.button
                className="
                  relative px-4 py-2 rounded-xl border overflow-hidden
                  bg-white/60 dark:bg-neutral-800/60 
                  border-neutral-300/50 dark:border-neutral-600/50
                  hover:bg-white/80 dark:hover:bg-neutral-700/80 
                  hover:border-red-400/40 dark:hover:border-red-500/40
                  text-neutral-700 dark:text-neutral-300 
                  transition-all duration-100
                  backdrop-blur-sm
                "
                onClick={() => {
                  onClose();
                  playButtonClick();
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="relative z-10 font-medium">Close</span>
              </motion.button>
            </div>

            {/* Enhanced Stats Cards */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, staggerChildren: 0.1 }}
            >
              <motion.div 
                className="
                  bg-white/70 dark:bg-neutral-800/70 
                  backdrop-blur-sm
                  border border-neutral-200/50 dark:border-neutral-700/40
                  rounded-2xl p-4 text-center
                  shadow-md shadow-black/5 dark:shadow-black/15
                  relative overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3}}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Emerald Theme Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 to-green-500/8 dark:from-emerald-500/10 dark:to-green-500/10 rounded-2xl"></div>
                
                {/* Icon */}
                <div className="relative z-10 mb-2">
                  <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/15 dark:to-green-500/15">
                    <featureIcons.checkCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                </div>
                
                <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 bg-clip-text text-transparent mb-1">
                  {dayInsights.completedCount}
                </div>
                <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Completed</div>
              </motion.div>

              <motion.div 
                className="
                  bg-white/70 dark:bg-neutral-800/70 
                  backdrop-blur-sm
                  border border-neutral-200/50 dark:border-neutral-700/40
                  rounded-2xl p-4 text-center
                  shadow-md shadow-black/5 dark:shadow-black/15
                  relative overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3}}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Blue Theme Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-cyan-500/8 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-2xl"></div>
                
                {/* Icon */}
                <div className="relative z-10 mb-2">
                  <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 dark:from-blue-400/15 dark:to-cyan-500/15">
                    <featureIcons.calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-700 dark:from-blue-500 dark:to-cyan-600 bg-clip-text text-transparent mb-1">
                  {dayInsights.totalCount}
                </div>
                <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Total Tasks</div>
              </motion.div>

              <motion.div 
                className="
                  bg-white/70 dark:bg-neutral-800/70 
                  backdrop-blur-sm
                  border border-neutral-200/50 dark:border-neutral-700/40
                  rounded-2xl p-4 text-center
                  shadow-md shadow-black/5 dark:shadow-black/15
                  relative overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Purple Theme Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-violet-500/8 dark:from-purple-500/10 dark:to-violet-500/10 rounded-2xl"></div>
                
                {/* Icon */}
                <div className="relative z-10 mb-2">
                  <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-purple-400/20 to-violet-500/20 dark:from-purple-400/15 dark:to-violet-500/15">
                    <featureIcons.trending className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  </div>
                </div>
                
                <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-500 dark:to-violet-600 bg-clip-text text-transparent mb-1">
                  {dayInsights.completionRate}%
                </div>
                <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">Completion Rate</div>
              </motion.div>

              <motion.div 
                className="
                  bg-white/70 dark:bg-neutral-800/70 
                  backdrop-blur-sm
                  border border-neutral-200/50 dark:border-neutral-700/40
                  rounded-2xl p-4 text-center
                  shadow-md shadow-black/5 dark:shadow-black/15
                  relative overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Amber Theme Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 to-orange-500/8 dark:from-amber-500/10 dark:to-orange-500/10 rounded-2xl"></div>
                
                {/* Icon */}
                <div className="relative z-10 mb-2">
                  <div className="inline-flex p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-400/15 dark:to-orange-500/15">
                    <featureIcons.zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
                
                <div className="relative z-10 text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 dark:from-amber-500 dark:to-orange-600 bg-clip-text text-transparent mb-1">
                  {dayInsights.xpEarned}
                </div>
                <div className="relative z-10 text-xs font-medium text-neutral-700 dark:text-neutral-400">XP Earned</div>
              </motion.div>
            </motion.div>

            {/* Enhanced Habit List */}
            <motion.div 
              className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 light-scrollbar dark:dark-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {dayInsights.habitsForDay.length === 0 ? (
                <motion.div 
                  className="
                    text-center py-8
                    bg-white/60 dark:bg-neutral-800/60 
                    backdrop-blur-sm
                    border border-neutral-200/50 dark:border-neutral-700/40
                    rounded-2xl
                  "
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-neutral-500 dark:text-neutral-400 text-sm">No habits scheduled for this day.</div>
                </motion.div>
              ) : (
                dayInsights.habitsForDay.map((h, index) => {
                  const pk = getPeriodKey(h.frequency, selectedDate);
                  const done = Boolean(h.completions?.[pk]);
                  return (
                    <motion.div 
                      key={generateHabitKey(h, index, 'insights')} 
                      className="
                        flex items-center justify-between 
                        bg-white/70 dark:bg-neutral-800/70 
                        backdrop-blur-sm
                        border border-neutral-200/50 dark:border-neutral-700/40
                        rounded-2xl p-4
                        shadow-sm shadow-black/5 dark:shadow-black/10
                        relative overflow-hidden
                      "
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -1 }}
                    >
                      {/* Subtle background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-500/5 to-transparent dark:from-neutral-400/5 dark:to-transparent rounded-2xl"></div>
                      
                      <div className="relative z-10">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{h.title}</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          <span className="px-2 py-1 bg-neutral-200/60 dark:bg-neutral-700/60 rounded-lg">{h.category}</span>
                          <span>•</span>
                          <span className="capitalize">{h.frequency}</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-medium">{h.xpOnComplete} XP</span>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => onHabitComplete(h.id, selectedDate)}
                        className={classNames(
                          "relative px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 overflow-hidden",
                          done
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30"
                            : "bg-white/60 dark:bg-neutral-700/60 border-neutral-300/50 dark:border-neutral-600/50 hover:bg-white/80 dark:hover:bg-neutral-600/80 text-neutral-700 dark:text-neutral-300 hover:border-emerald-400/40"
                        )}
                        title={done ? "Undo completion" : "Mark complete"}
                        whileHover={{ scale: 1.02 }}
                        onMouseEnter={() => playHover()}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                      >
                        {/* Button gradient effect */}
                        {!done && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        <span className="relative z-10">
                          {done ? "Completed" : "Complete"}
                        </span>
                      </motion.button>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
