import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme.tsx';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  const SunIcon = featureIcons.sun;
  const MoonIcon = featureIcons.moon;
  const MonitorIcon = featureIcons.monitor;

  const themes = [
    { key: 'light',  icon: SunIcon,     label: 'Light'  },
    { key: 'system', icon: MonitorIcon, label: 'System' },
    { key: 'dark',   icon: MoonIcon,    label: 'Dark'   },
  ] as const;

  return (
    <motion.div
      className="
        flex items-center gap-1 rounded-2xl p-1.5
        bg-white/80 dark:bg-neutral-900/70
        border border-neutral-200/50 dark:border-neutral-700/40
        backdrop-blur-md
        shadow-lg shadow-black/5 dark:shadow-black/20
        relative overflow-hidden
      "
      role="group"
      aria-label="Theme"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-neutral-500/5 to-purple-500/5 dark:from-amber-500/8 dark:via-neutral-500/8 dark:to-purple-500/8 rounded-2xl"></div>
      
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-sm"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-sm"></div>
      {themes.map(({ key, icon: Icon, label }, index) => {
        const active = theme === key;
        
        // Define theme-specific colors
        const themeColors = {
          light: {
            active: "bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 text-white shadow-xl shadow-amber-500/40 border border-amber-400/30",
            inactive: "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-700/80 border border-neutral-300/40 dark:border-neutral-600/40 hover:border-amber-400/30",
            hoverGradient: "from-amber-500/10 to-orange-500/10",
            glowColor: "from-amber-400/30 via-orange-400/20 to-amber-500/30",
            shadowColor: "rgba(245, 158, 11, 0.4)",
            focusRing: "ring-amber-500/50 dark:ring-amber-400/50"
          },
          system: {
            active: "bg-gradient-to-br from-neutral-500 via-slate-600 to-gray-600 text-white shadow-xl shadow-neutral-500/40 border border-neutral-400/30",
            inactive: "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-700/80 border border-neutral-300/40 dark:border-neutral-600/40 hover:border-neutral-400/30",
            hoverGradient: "from-neutral-500/10 to-slate-500/10",
            glowColor: "from-neutral-400/30 via-slate-400/20 to-neutral-500/30",
            shadowColor: "rgba(107, 114, 128, 0.4)",
            focusRing: "ring-neutral-500/50 dark:ring-neutral-400/50"
          },
          dark: {
            active: "bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 text-white shadow-xl shadow-purple-500/40 border border-purple-400/30",
            inactive: "bg-white/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-white/80 dark:hover:bg-neutral-700/80 border border-neutral-300/40 dark:border-neutral-600/40 hover:border-purple-400/30",
            hoverGradient: "from-purple-500/10 to-indigo-500/10",
            glowColor: "from-purple-400/30 via-indigo-400/20 to-purple-500/30",
            shadowColor: "rgba(139, 92, 246, 0.4)",
            focusRing: "ring-purple-500/50 dark:ring-purple-400/50"
          }
        };

        const colors = themeColors[key as keyof typeof themeColors];
        
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => {
              setTheme(key);
              playButtonClick();
            }}
            aria-pressed={active}
            title={`Switch to ${label} theme`}
            className={[
              "relative flex items-center justify-center rounded-xl px-3 py-2.5 transition-all duration-100 overflow-hidden",
              "focus-visible:outline-none",
              `focus-visible:ring-2 ${colors.focusRing}`,
              "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900",
              active ? colors.active : colors.inactive
            ].join(" ")}
            whileHover={{ 
              scale: 1.08,
              y: -2,
              boxShadow: active 
                ? `0 20px 35px ${colors.shadowColor}, 0 10px 15px ${colors.shadowColor.replace('0.4', '0.2')}`
                : "0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)",
              transition: { duration: 0.1 }
            }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={active ? { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: [0, -5, 5, 0],
              transition: { 
                opacity: { duration: 0.3 + index * 0.1 },
                scale: { duration: 0.3 + index * 0.1 },
                y: { duration: 0.3 + index * 0.1 },
                rotate: { duration: 0.6 }
              }
            } : {
              opacity: 1,
              scale: 1, 
              y: 0,
              rotate: 0,
              transition: { duration: 0.3 + index * 0.1 }
            }}
          >
            {/* Enhanced background effects for active state */}
            {active && (
              <>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${colors.glowColor} rounded-xl`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 + index * 0.5 }}
                />
              </>
            )}
            
            {/* Inactive hover effect */}
            {!active && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${colors.hoverGradient} rounded-xl opacity-0`}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}
            
            {/* Icon with theme-specific animations */}
            <motion.div
              animate={active ? (() => {
                switch(key) {
                  case 'light':
                    return { 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                      transition: { 
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 0.3 }
                      }
                    };
                  case 'system':
                    return { 
                      scale: [1, 1.05, 1],
                      transition: { duration: 2, repeat: Infinity }
                    };
                  case 'dark':
                    return { 
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1],
                      transition: { 
                        y: { duration: 1.5, repeat: Infinity },
                        scale: { duration: 0.3 }
                      }
                    };
                  default:
                    return {};
                }
              })() : { rotate: 0, scale: 1, y: 0 }}
              className="relative z-10"
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};
