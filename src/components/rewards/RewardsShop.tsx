import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { featureIcons, actionIcons } from '../../utils/icons';
import { useSoundEffectsOnly } from '../../hooks/useSoundEffects';
import { generateInventoryKey } from '../../utils/keyUtils';
import { DeleteRewardConfirmModal } from '../modals';
import type { Reward, InventoryItem } from '../../types';

interface RewardsShopProps {
  shop: Reward[];
  inventory: InventoryItem[];
  points: number;
  onOpenShop: () => void;
  onEditReward: (rewardId: string) => void;
  onDeleteReward: (rewardId: string) => void;
  onRedeemReward: (reward: Reward) => void;
}

export const RewardsShop: React.FC<RewardsShopProps> = ({
  shop,
  inventory,
  points,
  onOpenShop,
  onEditReward,
  onDeleteReward,
  onRedeemReward
}) => {
  const { playButtonClick, playHover } = useSoundEffectsOnly();
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);

  const handleDeleteReward = (reward: Reward) => {
    playButtonClick();
    setDeletingReward(reward);
  };

  const handleConfirmDeleteReward = () => {
    if (deletingReward) {
      onDeleteReward(deletingReward.id);
      setDeletingReward(null);
    }
  };

  const handleCancelDeleteReward = () => {
    setDeletingReward(null);
  };

  return (
    <motion.div 
      className="mt-10"
      data-section="rewards-shop"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 dark:border-purple-400/20">
              <featureIcons.gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Rewards Shop</h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">Spend your points on real-life perks. You earn ~2 pts per XP.</p>
        </div>
        <motion.button
          onClick={() => {
            onOpenShop();
            playButtonClick();
          }}
          className="
            relative overflow-hidden rounded-3xl px-5 py-2.5
            bg-gradient-to-r from-amber-500 to-orange-600
            backdrop-blur-md
            border border-amber-300/30 dark:border-0 
            text-white font-semibold text-sm
            shadow-xl shadow-amber-500/30 dark:shadow-amber-500/25
            transition-all duration-100
          "
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.4), 0 10px 10px -5px rgba(245, 158, 11, 0.2)",
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          onMouseEnter={() => playHover()}
          whileTap={{ scale: 0.95, y: 0 }}
        >
          {/* Gradient Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-95"></div>
          
          {/* Floating Gradient Orb */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400/40 to-amber-400/40 dark:from-yellow-400/30 dark:to-amber-400/30 rounded-full blur-lg"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            <featureIcons.gift className="w-4 h-4 drop-shadow-sm" />
            Open Shop
          </div>
        </motion.button>
      </motion.div>

      <motion.div 
        layout 
        className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {shop.map((r, index) => (
          <motion.div
            key={generateInventoryKey(r, index, 'shop')}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 + index * 0.1 }}
            className="group relative border border-neutral-300/50 dark:border-neutral-700/50 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-2"
            whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.1, ease: "easeOut" } }}
            onMouseEnter={() => playHover()}
            whileTap={{ scale: 0.95, y: 0 }}
          >
            {/* Hover Action Buttons - Top Right Corner */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex gap-1.5">
              <motion.button
                onClick={() => {
                  onEditReward(r.id);
                  playButtonClick();
                }}
                onMouseEnter={() => playHover()}
                className="w-8 h-8 rounded-full bg-blue-50/90 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-600/50 hover:bg-blue-100 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-150 shadow-sm backdrop-blur-sm"
                title="Edit reward"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <actionIcons.edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => handleDeleteReward(r)}
                onMouseEnter={() => playHover()}
                className="w-8 h-8 rounded-full bg-red-50/90 dark:bg-red-900/50 border border-red-200 dark:border-red-600/50 hover:bg-red-100 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 flex items-center justify-center transition-all duration-150 shadow-sm backdrop-blur-sm"
                title="Delete reward"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <actionIcons.delete className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">Cost: {r.cost} pts</div>
              </div>
            </div>
            <motion.button
              onClick={() => {
                onRedeemReward(r);
                playButtonClick();
              }}
              className="mt-2 px-3 py-2 rounded-xl text-sm border bg-emerald-400 text-black border-emerald-300 hover:opacity-90 disabled:opacity-50"
              disabled={points < r.cost}
              whileHover={points >= r.cost ? { scale: 1.05, y: -2, transition: { duration: 0.1, ease: "easeOut" } } : {}}
              onMouseEnter={points >= r.cost ? () => playHover() : undefined}
              whileTap={points >= r.cost ? { scale: 0.95, y: 0 } : {}}
            >
              {points < r.cost ? "Not enough points" : "Redeem"}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Inventory Section */}
      {inventory.length > 0 && (
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Inventory Header */}
          <motion.div 
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30">
              <featureIcons.trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Your Inventory</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {inventory.length} reward{inventory.length > 1 ? "s" : ""} earned
              </p>
            </div>
          </motion.div>

          {/* Inventory Grid */}
          <motion.div 
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {inventory.map((it, idx) => (
              <motion.div
                key={generateInventoryKey(it, idx, 'inventory-1')}
                className="
                  group relative overflow-hidden
                  bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20
                  border border-amber-200/50 dark:border-amber-700/50
                  rounded-2xl p-4
                  hover:shadow-lg hover:shadow-amber-500/10 dark:hover:shadow-amber-500/5
                  transition-all duration-300
                "
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 4px 6px -1px rgba(245, 158, 11, 0.05)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
                        <featureIcons.gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                        {it.name}
                      </h4>
                    </div>
                    <div className="p-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20">
                      <featureIcons.check className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  
                  <div className="text-xs text-amber-700/80 dark:text-amber-300/80">
                    Redeemed {new Date(it.redeemedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/0 group-hover:border-amber-400/30 transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State (if no items) */}
          {inventory.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-4 rounded-full bg-amber-100/50 dark:bg-amber-900/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <featureIcons.gift className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                No rewards yet
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete habits to earn points and redeem rewards!
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Delete Reward Confirmation Modal */}
      {deletingReward && (
        <DeleteRewardConfirmModal
          reward={deletingReward}
          onConfirm={handleConfirmDeleteReward}
          onClose={handleCancelDeleteReward}
        />
      )}
    </motion.div>
  );
};
