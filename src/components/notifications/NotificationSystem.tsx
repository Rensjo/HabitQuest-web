import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationSystemProps {
  showLevelUp: boolean;
  showPurchaseSuccess: boolean;
  showHabitComplete: boolean;
  notificationMessage: string;
  lastCompletedHabit: string;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  showLevelUp,
  showPurchaseSuccess,
  showHabitComplete,
  notificationMessage,
  lastCompletedHabit
}) => {
  return (
    <>
      {/* Level Up Notification */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500
                text-white p-8 rounded-3xl shadow-2xl
                border-2 border-amber-300
                max-w-md mx-4 text-center
              "
              initial={{ scale: 0.5, y: 50, rotateY: -180 }}
              animate={{ scale: 1, y: 0, rotateY: 0 }}
              exit={{ scale: 0.5, y: 50, rotateY: 180 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                duration: 0.6 
              }}
            >
              {/* Floating particles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-3 w-3 h-3 bg-orange-300 rounded-full animate-ping animation-delay-200"></div>
              <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-amber-300 rounded-full animate-ping animation-delay-400"></div>
              <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping animation-delay-600"></div>
              
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2,
                  repeatDelay: 0.5
                }}
              >
                🎉
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
              <p className="text-xl font-semibold mb-4">{notificationMessage}</p>
              <p className="text-amber-100 text-sm">Keep up the great work!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Success Notification */}
      <AnimatePresence>
        {showPurchaseSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500
                text-white p-6 rounded-2xl shadow-2xl
                border-2 border-emerald-300
                max-w-sm mx-4 text-center
              "
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                duration: 0.4 
              }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: 1
                }}
              >
                ✅
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2">Purchase Successful!</h3>
              <p className="text-emerald-100 text-sm">{notificationMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habit Completion Notification */}
      <AnimatePresence>
        {showHabitComplete && (
          <motion.div
            className="fixed top-4 right-4 z-50 pointer-events-none"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.3 
            }}
          >
            <motion.div
              className="
                bg-gradient-to-r from-emerald-500 to-green-600
                text-white p-4 rounded-xl shadow-lg
                border border-emerald-400/50
                max-w-xs
              "
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="text-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.6,
                    repeat: 1
                  }}
                >
                  🎯
                </motion.div>
                <div>
                  <p className="font-semibold text-sm">Habit Completed!</p>
                  <p className="text-emerald-100 text-xs">{lastCompletedHabit}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
