import React from 'react';
import { motion } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { generateInventoryKey } from '../../utils/keyUtils';
import type { Reward, InventoryItem } from '../../types';

interface RewardShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReward: () => void;
  shop: Reward[];
  inventory: InventoryItem[];
  points: number;
  onDeleteReward: (rewardId: string) => void;
  onRedeemReward: (reward: Reward) => void;
}

export const RewardShopModal: React.FC<RewardShopModalProps> = ({
  isOpen,
  onClose,
  onAddReward,
  shop,
  inventory,
  points,
  onDeleteReward,
  onRedeemReward
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
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          className="
            relative w-full max-w-4xl max-h-[90vh] overflow-hidden
            bg-white/90 dark:bg-neutral-900/90
            backdrop-blur-xl
            rounded-3xl
            shadow-2xl shadow-black/20 dark:shadow-black/40
            border border-white/20 dark:border-neutral-700/30
          "
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Shop Header Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-red-500/15 rounded-3xl"></div>
          
          {/* Floating Gradient Orbs */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-400/15 dark:to-orange-400/15 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-orange-400/15 to-red-400/15 dark:from-orange-400/10 dark:to-red-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 dark:from-yellow-400/5 dark:to-amber-400/5 rounded-full blur-xl"></div>

          <div className="relative z-10 p-8">
            {/* Shop Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-400/15 dark:to-orange-500/15 border border-amber-200/30 dark:border-transparent"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <featureIcons.gift className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                    Rewards Shop
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                    Spend your {points} points on real-life perks. You earn ~2 pts per XP.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => {
                    onAddReward();
                    playButtonClick();
                  }}
                  className="
                    relative overflow-hidden rounded-2xl px-4 py-2.5
                    bg-gradient-to-r from-amber-500 to-orange-600
                    backdrop-blur-md
                    border border-amber-300/30 dark:border-0 
                    text-white font-semibold text-sm
                    shadow-lg shadow-amber-500/30 dark:shadow-amber-500/25
                    hover:shadow-xl hover:shadow-amber-500/40
                    transition-all duration-100
                  "
                  whileHover={{ scale: 1.05, y: -2 }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center gap-2">
                    <featureIcons.plus className="w-4 h-4" />
                    Add Reward
                  </div>
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    onClose();
                    playButtonClick();
                  }}
                  className="
                    p-2 rounded-xl
                    bg-white/60 dark:bg-neutral-800/60
                    border border-neutral-300/50 dark:border-neutral-600/50
                    hover:bg-white/80 dark:hover:bg-neutral-700/80
                    hover:border-red-400/40 dark:hover:border-red-500/40
                    text-neutral-700 dark:text-neutral-300
                    transition-all duration-100
                    backdrop-blur-sm
                  "
                  whileHover={{ scale: 1.05, y: -2 }}
                  onMouseEnter={() => playHover()}
                  whileTap={{ scale: 0.95, y: 0 }}
                >
                  <featureIcons.x className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Rewards Grid */}
            <div className="relative">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto light-scrollbar dark:dark-scrollbar" id="rewards-grid">
                {shop.length > 0 ? (
                  shop.map((r, index) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 + index * 0.1 }}
                      className="
                        border border-neutral-300/50 dark:border-neutral-700/50 
                        bg-white/60 dark:bg-neutral-800/60 
                        backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3
                        hover:bg-white/80 dark:hover:bg-neutral-700/80
                        transition-all duration-100
                      "
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{r.name}</div>
                          <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">Cost: {r.cost} pts</div>
                        </div>
                        <motion.button
                          onClick={() => {
                            onDeleteReward(r.id);
                            playButtonClick();
                          }}
                          className="
                            px-2 py-1 rounded-lg text-xs border 
                            bg-red-500/20 border-red-500/40 
                            hover:bg-red-500/30 text-red-600 dark:text-red-400
                            transition-all duration-100
                          "
                          whileHover={{ scale: 1.05, y: -1 }}
                          onMouseEnter={() => playHover()}
                          whileTap={{ scale: 0.95, y: 0 }}
                          title="Delete reward"
                        >
                          Delete
                        </motion.button>
                      </div>
                      
                      <motion.button
                        onClick={() => onRedeemReward(r)}
                        className="
                          px-3 py-2 rounded-xl text-sm font-medium border 
                          bg-emerald-400 text-black border-emerald-300 
                          hover:opacity-90 disabled:opacity-50
                          disabled:bg-neutral-300 disabled:text-neutral-500
                          transition-all duration-100
                        "
                        disabled={points < r.cost}
                        whileHover={points >= r.cost ? { scale: 1.05, y: -2 } : {}}
                        onMouseEnter={points >= r.cost ? () => playHover() : undefined}
                        whileTap={points >= r.cost ? { scale: 0.95, y: 0 } : {}}
                      >
                        {points < r.cost ? "Not enough points" : "Redeem"}
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <motion.div
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-amber-400/5 dark:to-orange-500/5 mb-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <featureIcons.gift className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">No Rewards Yet</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                      Create your first reward to start motivating yourself!
                    </p>
                    <motion.button
                      onClick={() => {
                        onAddReward();
                        playButtonClick();
                      }}
                      className="
                        px-4 py-2 rounded-xl text-sm font-medium
                        bg-gradient-to-r from-amber-500 to-orange-600
                        text-white shadow-lg shadow-amber-500/30
                        hover:shadow-xl hover:shadow-amber-500/40
                        transition-all duration-100
                      "
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95, y: 0 }}
                    >
                      Add Your First Reward
                    </motion.button>
                  </div>
                )}
              </div>
              
              {/* Scroll to Top Button */}
              {shop.length > 6 && (
                <motion.button
                  onClick={() => {
                    const grid = document.getElementById('rewards-grid');
                    if (grid) {
                      grid.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="
                    absolute bottom-4 right-4 p-2 rounded-full
                    bg-amber-500/90 hover:bg-amber-600/90
                    text-white shadow-lg
                    transition-all duration-100
                    backdrop-blur-sm
                  "
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <featureIcons.chevronUp className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Inventory Section */}
            {inventory.length > 0 && (
              <motion.div
                className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <featureIcons.trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  Your Inventory ({inventory.length})
                </h3>
                <div className="grid gap-2 max-h-32 overflow-y-auto light-scrollbar dark:dark-scrollbar">
                  {inventory.map((it, idx) => (
                    <motion.div
                      key={generateInventoryKey(it, idx, 'inventory-2')} 
                      className="
                        border border-amber-200/50 dark:border-amber-800/50 
                        bg-amber-50/50 dark:bg-amber-900/20 
                        rounded-xl p-3 text-sm
                        hover:bg-amber-100/50 dark:hover:bg-amber-900/30
                        transition-all duration-100
                      "
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                    >
                      <div className="font-medium text-amber-800 dark:text-amber-200">{it.name}</div>
                      <div className="text-amber-600 dark:text-amber-400 text-xs">
                        Redeemed {new Date(it.redeemedAt).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
