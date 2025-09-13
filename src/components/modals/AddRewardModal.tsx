import React, { useState } from "react";
import { motion } from "framer-motion";
import { classNames } from "../../utils";
import { featureIcons } from "../../utils/icons";
import { useSoundEffectsOnly } from "../../hooks/useSoundEffects";

export function AddRewardModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (p: { name: string; cost: number }) => void;
}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState<number>(100);
  const { playButtonClick } = useSoundEffectsOnly();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    playButtonClick();
    onSave({ name, cost: Math.max(1, Number(cost || 1)) });
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
          border border-neutral-200/50 dark:border-neutral-700/50
          rounded-3xl p-8 
          shadow-xl shadow-black/10 dark:shadow-black/40
          relative overflow-hidden
        "
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Amber/Orange Theme Gradient Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-600/8 via-orange-600/8 to-red-600/8 dark:from-amber-600/10 dark:via-orange-600/10 dark:to-red-600/10"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-amber-400/25 to-orange-600/25 dark:from-amber-400/20 dark:to-orange-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-yellow-400/25 to-amber-600/25 dark:from-yellow-400/20 dark:to-amber-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-600/20 dark:from-orange-400/15 dark:to-red-600/15 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 dark:from-amber-500/20 dark:to-orange-500/20 backdrop-blur-sm border border-amber-200/30 dark:border-transparent"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <featureIcons.gift className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 bg-clip-text text-transparent mb-2">
              Create New Reward
            </h2>
            <p className="text-neutral-700 dark:text-neutral-400 text-sm font-medium">Set motivating incentives for your progress</p>
          </div>

          {/* Form Content */}
          <div className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30">
            <div className="space-y-5">
              {/* Reward Name Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Reward Name
                </label>
                <input
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  placeholder="e.g., Friday movie night"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Cost Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cost (Points)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-white/80 dark:bg-neutral-800/50
                    border border-neutral-300/50 dark:border-neutral-600/30
                    text-neutral-900 dark:text-neutral-100
                    placeholder-neutral-500 dark:placeholder-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50
                    backdrop-blur-sm transition-all duration-200
                  "
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value || 0))}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Points required to redeem this reward</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
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
              className="
                relative overflow-hidden px-6 py-3 rounded-2xl font-medium text-sm
                bg-gradient-to-r from-amber-600 to-orange-600
                text-white border-0
                shadow-lg shadow-amber-500/25
                transition-all duration-300
              "
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-95"></div>
              <div className="relative z-10 flex items-center gap-2">
                <featureIcons.gift className="w-4 h-4" />
                Create Reward
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}