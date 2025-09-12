import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { SoundButton } from '../ui/SoundButton';

interface StatsPanelProps {
  totalXP: number;
  level: number;
  completionRate: number;
  selectedDate: Date;
  completedToday: number;
  totalWeeklyCompletionRate: number;
  averageStreak: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  totalXP,
  level,
  completionRate,
  selectedDate,
  completedToday,
  totalWeeklyCompletionRate,
  averageStreak
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const stats = [
    {
      id: 'selected-day',
      title: 'Selected Day',
      value: formatDate(selectedDate),
      icon: featureIcons.calendar,
      color: 'from-blue-500 to-cyan-600',
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20'
    },
    {
      id: 'completion-rate',
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: featureIcons.trending,
      color: 'from-emerald-500 to-green-600',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20'
    },
    {
      id: 'current-level',
      title: 'Current Level',
      value: `Level ${level}`,
      icon: featureIcons.trophy,
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/20'
    },
    {
      id: 'total-xp',
      title: 'Total XP',
      value: totalXP.toString(),
      icon: featureIcons.star,
      color: 'from-purple-500 to-violet-600',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/20'
    },
    {
      id: 'completed-today',
      title: 'Completed Today',
      value: completedToday.toString(),
      icon: featureIcons.checkCircle,
      color: 'from-green-500 to-emerald-600',
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 dark:bg-green-500/20'
    },
    {
      id: 'weekly-completion',
      title: 'Weekly Completion',
      value: `${totalWeeklyCompletionRate}%`,
      icon: featureIcons.trending,
      color: 'from-indigo-500 to-purple-600',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20'
    },
    {
      id: 'avg-streak',
      title: 'Average Streak',
      value: `${averageStreak} days`,
      icon: featureIcons.flame,
      color: 'from-orange-500 to-red-600',
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10 dark:bg-orange-500/20'
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.id}
            className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-700/50 cursor-pointer group"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
              transition: { duration: 0.1, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.95, 
              transition: { duration: 0.1, ease: "easeOut" }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
            </div>
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {stat.title}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
