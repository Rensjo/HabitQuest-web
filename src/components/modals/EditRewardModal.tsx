import React, { useState } from "react";
import { motion } from "framer-motion";
import { classNames } from "../../utils";
import { featureIcons, actionIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import type { Reward } from "../../types";

interface EditRewardModalProps {
  reward: Reward;
  onClose: () => void;
  onSave: (updates: Partial<Reward>) => void;
}

export function EditRewardModal({
  reward,
  onClose,
  onSave,
}: EditRewardModalProps) {
  const [name, setName] = useState(reward.name);
  const [cost, setCost] = useState<number>(reward.cost);
  const { playButtonClick } = useSoundEffectsOnly();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    playButtonClick();
    onSave({ 
      name: name.trim(), 
      cost: Math.max(1, Number(cost || 1)) 
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
          bg-white/95 dark:bg-neutral-900/95
          backdrop-blur-md
          border border-purple-200/50 dark:border-purple-700/30
          rounded-3xl p-8 
          shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/40
          relative overflow-hidden
        "
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Enhanced Purple/Amber Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-amber-500/5 to-pink-500/10 dark:from-purple-500/15 dark:via-amber-500/10 dark:to-pink-500/15"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-amber-400/20 dark:from-purple-400/15 dark:to-amber-400/15 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-400/15 to-purple-400/15 dark:from-amber-400/10 dark:to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-pink-400/8 to-purple-400/8 dark:from-pink-400/5 dark:to-purple-400/5 rounded-full blur-3xl"></div>
        
        {/* Enhanced Header */}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/30 to-amber-500/30 dark:from-purple-500/20 dark:to-amber-500/20 backdrop-blur-sm border border-purple-200/30 dark:border-transparent"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <actionIcons.edit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-amber-700 to-pink-700 dark:from-purple-600 dark:via-amber-600 dark:to-pink-600 bg-clip-text text-transparent mb-2">
              Edit Reward
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">
              Update your reward details and point cost
            </p>
          </div>

          {/* Enhanced Form Content */}
          <div className="bg-purple-50/60 dark:bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-700/30 space-y-6 mb-6">
            
            {/* Current Reward Info */}
            <div className="flex items-start gap-3 p-4 bg-amber-50/40 dark:bg-amber-900/10 rounded-xl border border-amber-200/20 dark:border-amber-700/20">
              <div className="p-1.5 rounded-lg bg-amber-500/20 dark:bg-amber-500/15">
                <featureIcons.gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-1">
                  Current Reward
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  "{reward.name}" • {reward.cost} points • ID: {reward.id.slice(0, 8)}...
                </p>
              </div>
            </div>
            
            {/* Reward Name Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                <featureIcons.star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Reward Name
              </label>
              <motion.input
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-white/90 dark:bg-neutral-800/90
                  border border-purple-300/60 dark:border-purple-600/60
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-500 dark:placeholder-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  backdrop-blur-sm transition-all duration-200
                "
                placeholder="e.g., Movie night, Favorite dessert, Weekend treat"
                value={name}
                onChange={(e) => setName(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                required
              />
            </div>

            {/* Cost Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                <featureIcons.gem className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Cost (Points)
              </label>
              <motion.input
                type="number"
                min="1"
                max="10000"
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-white/90 dark:bg-neutral-800/90
                  border border-purple-300/60 dark:border-purple-600/60
                  text-neutral-900 dark:text-neutral-100
                  placeholder-neutral-500 dark:placeholder-neutral-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  backdrop-blur-sm transition-all duration-200
                "
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                whileFocus={{ scale: 1.01 }}
                required
              />
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                <featureIcons.info className="w-3 h-3" />
                Points earned from completing habits (~2 pts per XP)
              </p>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center justify-end gap-3">
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
              disabled={!name.trim()}
              className="
                relative overflow-hidden px-6 py-3 rounded-2xl font-medium text-sm
                bg-gradient-to-r from-purple-500 to-purple-600
                text-white border-0
                shadow-lg shadow-purple-500/25
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
              "
              whileHover={name.trim() ? { 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.4)"
              } : {}}
              whileTap={name.trim() ? { scale: 0.98 } : {}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <actionIcons.edit className="w-4 h-4" />
                Update Reward
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}