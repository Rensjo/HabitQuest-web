import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/design';
import { featureIcons, iconSizes } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';

interface GamificationStatusProps {
  level: number;
  currentXP: number;
  xpToNext: number;
  levelProgress: number;
  streakDays: number;
  points: number;
  onRewardShopClick: () => void;
  className?: string;
}

export const GamificationStatus: React.FC<GamificationStatusProps> = ({
  level,
  currentXP,
  xpToNext,
  levelProgress,
  streakDays,
  points,
  onRewardShopClick,
  className,
}) => {
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const { playButtonClick, playHover } = useSoundEffectsOnly();

  const CurrentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const StarIcon = featureIcons.star;
  const FlameIcon = featureIcons.flame;
  const TrophyIcon = featureIcons.trophy;
  const GiftIcon = featureIcons.gift;
  const ZapIcon = featureIcons.zap;

  return (
    <>
      <motion.div
        className={cn(
          "bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-neutral-300/50 dark:border-neutral-700/50 rounded-2xl shadow-xl",
          "hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80 hover:border-neutral-400/50 dark:hover:border-neutral-600/50 transition-all duration-300",
          "min-w-[350px] max-w-[400px] relative",
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Date Header */}
        <div className="text-center p-4 pb-2">
          <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wide font-medium">
            {CurrentDate}
          </div>
        </div>

        {/* Adventurer Status */}
        <div className="px-4 pb-4">
          <div className="text-center mb-4">
            <div className="text-xs text-neutral-700 dark:text-neutral-500 uppercase tracking-wide font-medium mb-2">
              ADVENTURER STATUS
            </div>
            
            {/* Level Badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div 
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StarIcon size={iconSizes.md} className="text-yellow-400" />
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-lg">Lvl {level}</span>
              </motion.div>
            </div>

            {/* XP Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                <div className="flex items-center gap-1">
                  <ZapIcon size={iconSizes.xs} className="text-cyan-400" />
                  <span>{currentXP.toLocaleString()} XP</span>
                </div>
                <span>{xpToNext.toLocaleString()} to next</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="relative h-3 bg-neutral-300 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                  }}
                  style={{ width: "30%" }}
                />
              </div>
              <div className="text-center text-xs text-neutral-500 mt-1">
                {levelProgress}% complete
              </div>
            </div>

            {/* Points Display */}
            <div className="mb-4">
              <motion.div 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg py-2 px-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  💰
                </motion.div>
                <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">{points.toLocaleString()}</span>
                <span className="text-amber-500 dark:text-amber-300 text-sm font-medium">Points</span>
              </motion.div>
            </div>

            {/* Bottom Row - Buttons Left, Streak Right */}
            <div className="flex items-center gap-3">
              {/* Action Buttons - Icon Only - Left Side */}
              <div className="flex gap-2 flex-shrink-0">
                <motion.button
                  onClick={() => {
                    setShowStatusPanel(!showStatusPanel);
                    playButtonClick();
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl p-2 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Status & Achievements"
                  onMouseEnter={() => playHover()}
                >
                  <TrophyIcon size={iconSizes.sm} />
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    onRewardShopClick();
                    playButtonClick();
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl p-2 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95 }}
                  title="Reward Shop"
                >
                  <GiftIcon size={iconSizes.sm} />
                </motion.button>
              </div>

              {/* Streak Counter - Compact - Right Side */}
              <motion.div 
                className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg py-1.5 px-3 flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <FlameIcon size={iconSizes.sm} className="text-orange-400" />
                <span className="text-orange-400 font-bold">{streakDays} Day Streak</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Status Panel */}
      <AnimatePresence>
        {showStatusPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusPanel(false)}
            />
            
            {/* Panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50" onClick={() => setShowStatusPanel(false)}>
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="
                  bg-white/95 dark:bg-neutral-900/95
                  backdrop-blur-md
                  border border-neutral-200/50 dark:border-neutral-700/50
                  rounded-3xl p-8 
                  shadow-xl shadow-black/10 dark:shadow-black/40
                  min-w-[400px] max-w-[500px] w-full
                  relative overflow-hidden
                "
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
              {/* Green/Emerald Theme Gradient Background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/8 via-emerald-500/8 to-teal-500/8 dark:from-green-500/10 dark:via-emerald-500/10 dark:to-teal-500/10"></div>
              
              {/* Floating Gradient Orbs */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-green-400/25 to-emerald-600/25 dark:from-green-400/20 dark:to-emerald-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-emerald-400/25 to-teal-600/25 dark:from-emerald-400/20 dark:to-teal-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-green-600/20 dark:from-cyan-400/15 dark:to-green-600/15 rounded-full blur-2xl"></div>
              </div>
              <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    className="p-3 rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 dark:from-green-500/20 dark:to-emerald-500/20 backdrop-blur-sm border border-green-200/30 dark:border-transparent"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TrophyIcon size={iconSizes.lg} className="text-green-500 dark:text-green-400" />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 bg-clip-text text-transparent mb-2">
                  Adventurer Status
                </h2>
                <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Level 46 Academic Explorer</p>
              </div>

              <div className="space-y-4">
                {/* Level Progress Card */}
                <div className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400/30 to-yellow-500/30 dark:from-amber-400/20 dark:to-yellow-500/20 border border-amber-200/20 dark:border-transparent">
                      <StarIcon size={iconSizes.md} className="text-amber-500 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">Level {level}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">{currentXP.toLocaleString()} / {(currentXP + xpToNext).toLocaleString()} XP</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{levelProgress}%</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{xpToNext.toLocaleString()} to next</div>
                    </div>
                  </div>
                  <div className="h-3 bg-neutral-300/50 dark:bg-neutral-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      transition={{ duration: 1.5 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <motion.div 
                    className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-4 text-center border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 dark:from-cyan-400/20 dark:to-blue-500/20 inline-block mb-3 border border-cyan-200/20 dark:border-transparent">
                      <ZapIcon size={iconSizes.lg} className="text-cyan-500 dark:text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 bg-clip-text text-transparent">{currentXP.toLocaleString()}</div>
                    <div className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Total XP</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-4 text-center border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400/30 to-orange-500/30 dark:from-amber-400/20 dark:to-orange-500/20 inline-block mb-3 border border-amber-200/20 dark:border-transparent">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-2xl"
                      >
                        💰
                      </motion.div>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 dark:from-amber-500 dark:to-orange-600 bg-clip-text text-transparent">{points.toLocaleString()}</div>
                    <div className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Points</div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-4 text-center border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400/30 to-red-500/30 dark:from-orange-400/20 dark:to-red-500/20 inline-block mb-3 border border-orange-200/20 dark:border-transparent">
                      <FlameIcon size={iconSizes.lg} className="text-orange-500 dark:text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-700 dark:from-orange-500 dark:to-red-600 bg-clip-text text-transparent">{streakDays}</div>
                    <div className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Current Streak</div>
                  </motion.div>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={() => {
                    setShowStatusPanel(false);
                    playButtonClick();
                  }}
                  className="
                    w-full relative overflow-hidden rounded-2xl px-6 py-3
                    bg-gradient-to-r from-gray-500/90 to-slate-600/90
                    backdrop-blur-md border-0 text-white font-semibold text-sm
                    shadow-lg shadow-gray-500/25
                    transition-all duration-300
                  "
                  whileHover={{ 
                    scale: 1.02, 
                    y: -1,
                    boxShadow: "0 10px 25px -5px rgba(107, 114, 128, 0.4)"
                  }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient Background Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-slate-600 to-neutral-700 opacity-90"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>Close</span>
                  </div>
                </motion.button>
              </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
