import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RewardShopModal, DayInsightsModal, AnalyticsModal, SettingsModal } from './index';

interface ModalSystemProps {
  // Modal states
  showRewardShop: boolean;
  showDayInsights: boolean;
  activeAnalytics: boolean;
  activeSettings: boolean;
  
  // Modal handlers
  onCloseRewardShop: () => void;
  onCloseDayInsights: () => void;
  onCloseAnalytics: () => void;
  onCloseSettings: () => void;
  
  // Modal props
  shop: any[];
  inventory: any[];
  points: number;
  onEditReward: (id: string) => void;
  onDeleteReward: (id: string) => void;
  onRedeemReward: (reward: any) => void;
  onAddReward: () => void;
  selectedDate: Date;
  dayInsights: any;
  onHabitComplete: (habitId: string, date: Date) => void;
  getPeriodKey: (frequency: string, date: Date) => string;
  habits: any[];
  categories: any[];
  habitStats: any;
  totalXP: number;
  level: number;
  goals: any;
  
  // Sound effects
  playButtonClick: () => void;
}

export function ModalSystem({
  showRewardShop,
  showDayInsights,
  activeAnalytics,
  activeSettings,
  onCloseRewardShop,
  onCloseDayInsights,
  onCloseAnalytics,
  onCloseSettings,
  shop,
  inventory,
  points,
  onEditReward,
  onDeleteReward,
  onRedeemReward,
  onAddReward,
  selectedDate,
  dayInsights,
  onHabitComplete,
  getPeriodKey,
  habits,
  categories,
  habitStats,
  totalXP,
  level,
  goals,
  playButtonClick
}: ModalSystemProps) {
  return (
    <>
      {/* Reward Shop Modal */}
      <AnimatePresence>
        <RewardShopModal
          isOpen={showRewardShop}
          onClose={onCloseRewardShop}
          onAddReward={onAddReward}
          shop={shop}
          inventory={inventory}
          points={points}
          onEditReward={onEditReward}
          onDeleteReward={onDeleteReward}
          onRedeemReward={onRedeemReward}
        />
      </AnimatePresence>

      {/* Day Insights Modal */}
      <AnimatePresence>
        <DayInsightsModal
          isOpen={showDayInsights}
          onClose={onCloseDayInsights}
          selectedDate={selectedDate}
          dayInsights={dayInsights}
          onHabitComplete={onHabitComplete}
          getPeriodKey={getPeriodKey}
        />
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={activeAnalytics}
        onClose={onCloseAnalytics}
        habits={habits}
        categories={categories}
        habitStats={habitStats}
        totalXP={totalXP}
        level={level}
        dayInsights={dayInsights}
        selectedDate={selectedDate}
        getPeriodKey={getPeriodKey}
        goals={goals}
        inventory={inventory}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {activeSettings && (
          <SettingsModal
            isOpen={activeSettings}
            onClose={onCloseSettings}
            audioEnabled={true}
            backgroundMusicEnabled={false}
            soundEffectsVolume={0.75}
            backgroundMusicVolume={0.5}
            onAudioEnabledChange={() => {}}
            onBackgroundMusicEnabledChange={() => {}}
            onSoundEffectsVolumeChange={() => {}}
            onBackgroundMusicVolumeChange={() => {}}
          />
        )}
      </AnimatePresence>
    </>
  );
}
