import React from "react";
import { motion } from "framer-motion";
import { classNames } from "../../utils";
import { featureIcons, statusIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import type { Reward } from "../../types";

interface DeleteRewardModalProps {
  reward: Reward;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRewardModal({
  reward,
  onClose,
  onConfirm,
}: DeleteRewardModalProps) {
  const { playButtonClick } = useSoundEffectsOnly();

  const handleConfirm = () => {
    playButtonClick();
    onConfirm();
  };

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
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-md
          bg-white/95 dark:bg-neutral-900/95
          backdrop-blur-md
          border border-neutral-200/50 dark:border-neutral-700/50
          rounded-3xl p-8 
          shadow-xl shadow-black/10 dark:shadow-black/40
          relative overflow-hidden
        "
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30 dark:border-red-400/20">
            <featureIcons.trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Delete Reward</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 mb-6">
          <p className="text-neutral-700 dark:text-neutral-300 mb-4">
            Are you sure you want to delete this reward?
          </p>
          
          {/* Reward Preview */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {reward.name}
                </div>
                <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                  Cost: {reward.cost} points
                </div>
              </div>
              <div className="p-2 rounded-lg bg-red-500/20 border border-red-400/30">
                <featureIcons.gift className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/30 rounded-lg">
            <div className="flex items-start gap-2">
              <statusIcons.warning className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-300">
                <strong>Warning:</strong> This reward will be permanently deleted from your shop. Any points spent on this reward will not be refunded.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 relative">
          <motion.button
            type="button"
            onClick={() => {
              onClose();
              playButtonClick();
            }}
            className={classNames(
              "flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              "bg-neutral-200/80 hover:bg-neutral-300/80 dark:bg-neutral-700/80 dark:hover:bg-neutral-600/80",
              "text-neutral-700 dark:text-neutral-300 border border-neutral-300/50 dark:border-neutral-600/50",
              "backdrop-blur-sm"
            )}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            Cancel
          </motion.button>
          <motion.button
            type="button"
            onClick={handleConfirm}
            className={classNames(
              "flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
              "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600",
              "text-white border border-red-500/50",
              "shadow-lg shadow-red-500/20"
            )}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            <featureIcons.trash2 className="w-4 h-4" />
            Delete Reward
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}