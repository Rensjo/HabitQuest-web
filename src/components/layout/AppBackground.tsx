import React from 'react';
import { DynamicContainer } from './index';

interface AppBackgroundProps {
  children: React.ReactNode;
}

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-black text-neutral-900 dark:text-neutral-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl transform translate-y-1/2"></div>
      </div>
      
      {/* Grid Pattern Overlay - visible in both themes */}
      <div className="absolute inset-0">
        <div className="w-full h-full opacity-[0.4] dark:opacity-[0.4]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,116,139,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="w-full h-full opacity-[0.2] dark:opacity-[0.2]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.6) 1px, transparent 1px)`,
          backgroundSize: '18px 18px'
        }}></div>
      </div>

      <DynamicContainer maxWidth="7xl" padding="lg" className="relative z-10">
        {children}
      </DynamicContainer>
    </div>
  );
}
