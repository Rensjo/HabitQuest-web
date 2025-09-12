import React from 'react';
import { motion } from 'framer-motion';
import { WEEKDAYS } from '../../constants';
import { classNames, sameDay } from '../../utils';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';

interface CalendarSectionProps {
  selectedDate: Date;
  completedDaysSet: Set<string>;
  periodKey: string;
  onDateSelect: (date: Date) => void;
  onDayInsights: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  completedDaysSet,
  periodKey,
  onDateSelect,
  onDayInsights,
  onPrevMonth,
  onNextMonth,
  onToday
}) => {
  const { playButtonClick } = useSoundEffectsOnly();

  // Calendar logic
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const leadingBlanks = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const cells: Array<Date | null> = [];
  
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <motion.div 
      className="mt-2 border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="font-semibold text-neutral-900 dark:text-neutral-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {selectedDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <motion.button
            className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-800/70 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 transition-colors"
            onClick={() => {
              onDayInsights();
              playButtonClick();
            }}
            whileHover={{ scale: 1.05, y: -1 }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
            title="View Day Insights"
          >
            <featureIcons.barChart className="w-4 h-4" />
            {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </motion.button>
          
          <motion.button
            className="
              relative px-4 py-2 rounded-xl border overflow-hidden
              bg-white/70 dark:bg-neutral-800/70 
              border-neutral-300/50 dark:border-neutral-600/50
              hover:bg-white/90 dark:hover:bg-neutral-700/90 
              hover:border-blue-400/40 dark:hover:border-blue-500/40
              text-neutral-700 dark:text-neutral-300 
              transition-all duration-100
              backdrop-blur-sm
              shadow-md shadow-black/5 dark:shadow-black/15
            "
            onClick={() => {
              onPrevMonth();
              playButtonClick();
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -3,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
              transition: { duration: 0.1 }
            }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 10, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Background gradient on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Animated arrow */}
            <motion.div 
              className="relative z-10 flex items-center gap-1"
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                whileHover={{ x: -1, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                ‹
              </motion.span>
              <span className="font-medium">Prev</span>
            </motion.div>
            
            {/* Subtle glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            className="
              relative px-4 py-2 rounded-xl border overflow-hidden
              bg-gradient-to-br from-emerald-500/90 to-green-600/90 
              border-emerald-400/40 dark:border-emerald-500/40
              text-white font-semibold
              transition-all duration-100
              backdrop-blur-sm
              shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/25
            "
            onClick={() => {
              onToday();
              playButtonClick();
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -3,
              boxShadow: "0 20px 35px rgba(16, 185, 129, 0.4), 0 10px 15px rgba(16, 185, 129, 0.2)",
              transition: { duration: 0.1 }
            }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Enhanced gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-emerald-400/40 via-green-400/30 to-emerald-500/40 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            
            {/* Animated content */}
            <motion.div 
              className="relative z-10 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 1 
                }}
              >
                <featureIcons.sun className="w-4 h-4" />
              </motion.div>
              <span>Today</span>
            </motion.div>
            
            {/* Pulsing glow */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-emerald-400/40 to-green-400/40 rounded-xl blur-sm"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
          
          <motion.button
            className="
              relative px-4 py-2 rounded-xl border overflow-hidden
              bg-white/70 dark:bg-neutral-800/70 
              border-neutral-300/50 dark:border-neutral-600/50
              hover:bg-white/90 dark:hover:bg-neutral-700/90 
              hover:border-purple-400/40 dark:hover:border-purple-500/40
              text-neutral-700 dark:text-neutral-300 
              transition-all duration-100
              backdrop-blur-sm
              shadow-md shadow-black/5 dark:shadow-black/15
            "
            onClick={() => {
              onNextMonth();
              playButtonClick();
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -3,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
              transition: { duration: 0.1 }
            }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 10, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Background gradient on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Animated arrow */}
            <motion.div 
              className="relative z-10 flex items-center gap-1"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-medium">Next</span>
              <motion.span
                whileHover={{ x: 1, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                ›
              </motion.span>
            </motion.div>
            
            {/* Subtle glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl blur-sm opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>

      <div className="mt-3 grid grid-cols-7 text-xs text-neutral-500 dark:text-neutral-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="p-2 text-center">{w}</div>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-7 gap-2">
        {cells.map((date, idx) => {
          const isToday = date && sameDay(date, new Date());
          const isSelected = date && sameDay(date, selectedDate);
          const key = date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : `b-${idx}`;
          const hasDone = date ? completedDaysSet.has(key) : false;
          
          return (
            <motion.button
              key={key}
              layout
              className={classNames(
                "h-20 rounded-xl border flex flex-col items-center justify-center transition-all",
                date ? "border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/40 dark:bg-neutral-900/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100" : "border-transparent",
                "disabled:bg-transparent disabled:border-transparent disabled:opacity-40 disabled:shadow-none disabled:cursor-default",
                isSelected && "ring-2 ring-cyan-400",
                isToday && "outline outline-1 outline-emerald-400"
              )}
              disabled={!date}
              onClick={() => {
                if (!date) return;
                onDateSelect(date);
                onDayInsights();
                playButtonClick();
              }}
              whileHover={date ? { scale: 1.02 } : undefined}
              whileTap={date ? { scale: 0.98 } : undefined}
            >
              {date ? (
                <>
                  <div className="text-sm font-medium">{date.getDate()}</div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{WEEKDAYS[date.getDay()]}</div>
                  {hasDone && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                </>
              ) : (
                <span />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div 
        className="mt-3 text-xs text-neutral-600 dark:text-neutral-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Viewing period key: <span className="text-neutral-800 dark:text-neutral-200">{periodKey}</span>
      </motion.div>
    </motion.div>
  );
};
