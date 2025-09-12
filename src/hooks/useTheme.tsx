import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { ThemeColors } from '../types';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  gradientColors: string[];
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setGradientColors: (colors: string[]) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const lightTheme: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#10b981',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const darkTheme: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#10b981',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useAppStore();
  
  const effectiveTheme = useMemo(() => {
    if (settings.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.theme;
  }, [settings.theme]);

  const colors = effectiveTheme === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const setGradientColors = (gradientColors: string[]) => {
    updateSettings({ gradientColors });
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    
    // Set CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, [effectiveTheme, colors]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const value: ThemeContextType = {
    theme: effectiveTheme,
    colors,
    gradientColors: settings.gradientColors,
    toggleTheme,
    setTheme,
    setGradientColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
