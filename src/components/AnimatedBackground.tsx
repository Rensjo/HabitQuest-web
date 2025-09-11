import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export function AnimatedBackground() {
  const { currentGradient } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(45deg, ${currentGradient.primary}, ${currentGradient.secondary})`,
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply dark:mix-blend-screen"
          style={{
            background: `radial-gradient(circle, ${currentGradient.accent}20, transparent)`,
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{
            x: `${20 + i * 30}%`,
            y: `${20 + i * 20}%`,
          }}
        />
      ))}

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-black to-transparent" />
    </div>
  );
}
