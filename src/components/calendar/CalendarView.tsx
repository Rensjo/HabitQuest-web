import React from 'react';
import { motion } from 'framer-motion';
import { WEEKDAYS } from '../../constants';
import { classNames, startOfMonth, endOfMonth, sameDay } from '../../utils';
import { featureIcons } from '../../utils/icons';
import { SoundButton } from '../ui/SoundButton';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onDayInsights: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  completedDaysSet: Set<string>;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  onDayInsights,
  onPrevMonth,
  onNextMonth,
  onToday,
  completedDaysSet
}) => {
  // Calendar logic
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const cells = [];
  let day = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    const isInMonth = day >= monthStart && day <= monthEnd;
    cells.push(isInMonth ? new Date(day) : null);
    day.setDate(day.getDate() + 1);
  }

  return (
    <motion.div
      className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <SoundButton
            variant="outline"
            size="sm"
            onClick={() => onDayInsights(selectedDate)}
            className="hidden md:inline-flex"
            icon="calendar"
          >
            View Day Insights
          </SoundButton>
          
          <SoundButton
            variant="outline"
            size="sm"
            onClick={onPrevMonth}
            icon="chevronLeft"
            className="p-2"
          />
          
          <SoundButton
            variant="gradient"
            size="sm"
            onClick={onToday}
            gradientFrom="from-emerald-500"
            gradientTo="to-green-600"
          >
            Today
          </SoundButton>
          
          <SoundButton
            variant="outline"
            size="sm"
            onClick={onNextMonth}
            icon="chevronRight"
            className="p-2"
          />
        </motion.div>
      </div>

      {/* Weekday Headers */}
      <div className="mt-3 grid grid-cols-7 text-xs text-neutral-500 dark:text-neutral-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="p-2 text-center">{w}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <motion.div layout className="grid grid-cols-7 gap-2">
        {cells.map((date, idx) => {
          const isToday = date && sameDay(date, new Date());
          const isSelected = date && sameDay(date, selectedDate);
          const key = date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : `blank-${idx}`;
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
                onDayInsights(date);
              }}
              whileHover={date ? { scale: 1.02 } : undefined}
              whileTap={date ? { scale: 0.98 } : undefined}
            >
              {date ? (
                <>
                  <div className="text-sm font-medium">{date.getDate()}</div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{WEEKDAYS[date.getDay()]}</div>
                  {hasDone && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-emerald-500 rounded-full mt-1"
                    />
                  )}
                </>
              ) : null}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
