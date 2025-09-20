import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { featureIcons } from '../../utils/icons';
import { classNames } from '../../utils';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  label,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const option = options[highlightedIndex];
          if (!option.disabled) {
            onChange(option.value);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => {
            const next = prev + 1;
            return next >= options.length ? 0 : next;
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => {
            const next = prev - 1;
            return next < 0 ? options.length - 1 : next;
          });
        }
        break;
    }
  };

  const handleOptionClick = (option: Option) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={classNames(
            "w-full rounded-xl px-4 py-3 text-sm text-left cursor-pointer",
            "bg-white/90 dark:bg-neutral-800/90",
            "border border-neutral-300/60 dark:border-neutral-600/60",
            "text-neutral-900 dark:text-neutral-100",
            "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50",
            "backdrop-blur-sm transition-all duration-200",
            "hover:border-purple-400/50 dark:hover:border-purple-500/50",
            "shadow-sm hover:shadow-md",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className
          )}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? "" : "text-neutral-500 dark:text-neutral-400"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <featureIcons.chevronUp 
              className={classNames(
                "w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200",
                isOpen ? "rotate-0" : "rotate-180"
              )} 
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 w-full mb-2 bottom-full"
            >
              <div 
                ref={optionsRef}
                className={classNames(
                  "bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-xl",
                  "border border-neutral-300/60 dark:border-neutral-600/60",
                  "shadow-lg dark:shadow-neutral-900/20",
                  "py-2 max-h-60 overflow-y-auto",
                  "light-scrollbar dark:dark-scrollbar"
                )}
              >
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    disabled={option.disabled}
                    className={classNames(
                      "w-full px-4 py-2.5 text-sm text-left transition-all duration-150",
                      "hover:bg-purple-50 dark:hover:bg-neutral-700/50",
                      "focus:outline-none focus:bg-purple-50 dark:focus:bg-neutral-700/50",
                      highlightedIndex === index ? "bg-purple-50 dark:bg-neutral-700/50" : "",
                      value === option.value ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium" : "text-neutral-900 dark:text-neutral-100",
                      option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {value === option.value && (
                        <featureIcons.checkCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}