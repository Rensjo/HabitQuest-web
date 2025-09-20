import React from "react";
import { motion } from "framer-motion";
import { featureIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";
import type { Reward } from "../../types";

interface DeleteRewardConfirmModalProps {
  reward: Reward;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRewardConfirmModal({
  reward,
  onClose,
  onConfirm,
}: DeleteRewardConfirmModalProps) {
  const { playButtonClick } = useSoundEffectsOnly();

  const handleConfirm = () => {
    playButtonClick();
    onConfirm();
  };

  const handleCancel = () => {
    playButtonClick();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleCancel}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-md
          bg-white/95 dark:bg-neutral-900/95
          backdrop-blur-md
          border border-red-200/50 dark:border-red-700/30
          rounded-3xl p-8 
          shadow-2xl shadow-red-500/20 dark:shadow-red-500/40
          relative overflow-hidden
        "
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Red Warning Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-pink-500/10 dark:from-red-500/15 dark:via-orange-500/10 dark:to-pink-500/15"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-red-400/20 to-pink-400/20 dark:from-red-400/15 dark:to-pink-400/15 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-orange-400/15 to-red-400/15 dark:from-orange-400/10 dark:to-red-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-500/30 dark:from-red-500/20 dark:to-orange-500/20 backdrop-blur-sm border border-red-200/30 dark:border-transparent"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <featureIcons.trash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-700 via-orange-700 to-pink-700 dark:from-red-600 dark:via-orange-600 dark:to-pink-600 bg-clip-text text-transparent mb-2">
              Delete Reward
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">
              Are you sure you want to delete "{reward.name}"?
            </p>
          </div>

          {/* Warning Content */}
          <div className="bg-red-50/60 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-200/30 dark:border-red-700/30 mb-6">
            <div className="space-y-4">
              {/* Reward Details */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 dark:bg-amber-500/15">
                  <featureIcons.gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-1">
                    Reward Details
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Cost: {reward.cost} points • ID: {reward.id.slice(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Points Investment Warning */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/20 dark:bg-blue-500/15">
                  <featureIcons.info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-1">
                    Points Investment
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    This reward costs {reward.cost} points to redeem. Deleting it will remove it from your rewards shop permanently.
                  </p>
                </div>
              </div>

              {/* Permanent Action Warning */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-red-500/20 dark:bg-red-500/15">
                  <featureIcons.info className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm mb-1">
                    Permanent Action
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    This action cannot be undone. Consider editing the reward instead if you want to make changes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <motion.button
              type="button"
              onClick={handleCancel}
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
              type="button"
              onClick={handleConfirm}
              className="
                relative overflow-hidden px-6 py-3 rounded-2xl font-medium text-sm
                bg-gradient-to-r from-red-500 to-red-600
                text-white border-0
                shadow-lg shadow-red-500/25
                transition-all duration-300
              "
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.trash2 className="w-4 h-4" />
                Delete Reward
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};