import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { FREQUENCIES } from '../../types';
import type { Frequency } from '../../types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<string, string> = {
  'CAREER': 'briefcase',
  'CREATIVE': 'palette',
  'FINANCIAL': 'dollar',
  'PERSONAL DEVELOPMENT': 'brain',
  'RELATIONSHIPS': 'heart',
  'SPIRITUAL': 'star',
};

const categoryColors: Record<string, string> = {
  'CAREER': '#3b82f6',
  'CREATIVE': '#8b5cf6',
  'FINANCIAL': '#10b981',
  'PERSONAL DEVELOPMENT': '#f59e0b',
  'RELATIONSHIPS': '#ef4444',
  'SPIRITUAL': '#06b6d4',
};

export function AddHabitModal({ isOpen, onClose }: AddHabitModalProps) {
  const { addHabit, categories } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [category, setCategory] = useState<string>(categories[0] || '');
  const [xpOnComplete, setXpOnComplete] = useState(10);
  const [isRecurring, setIsRecurring] = useState(true);
  const [specificDate, setSpecificDate] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('target');
  const [selectedColor, setSelectedColor] = useState('#10b981');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addHabit({
      title: title.trim(),
      frequency,
      category,
      xpOnComplete,
      isRecurring,
      specificDate: isRecurring ? null : (specificDate || null),
      icon: selectedIcon,
      color: selectedColor,
    });
    
    // Reset form
    setTitle('');
    setFrequency('daily');
    setCategory(categories[0] || '');
    setXpOnComplete(10);
    setIsRecurring(true);
    setSpecificDate('');
    setSelectedIcon('target');
    setSelectedColor('#10b981');
    
    onClose();
  };

  const iconOptions = [
    'target', 'dumbbell', 'book', 'brain', 'heart', 'briefcase', 
    'palette', 'dollar', 'star', 'calendar', 'timer', 'trophy'
  ];

  const colorOptions = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
    '#ef4444', '#06b6d4', '#84cc16', '#f97316'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Habit" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Habit Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 30-minute workout"
            required
          />
        </div>

        {/* Frequency and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq} value={freq} className="capitalize">
                  {freq}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* XP and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">XP Reward</label>
            <input
              type="number"
              value={xpOnComplete}
              onChange={(e) => setXpOnComplete(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isRecurring ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsRecurring(true)}
              >
                Recurring
              </Button>
              <Button
                type="button"
                variant={!isRecurring ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsRecurring(false)}
              >
                Specific Date
              </Button>
            </div>
          </div>
        </div>

        {/* Specific Date (if not recurring) */}
        {!isRecurring && (
          <div>
            <label className="block text-sm font-medium mb-2">Specific Date</label>
            <input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedIcon === icon
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <Icon name={icon} size={20} />
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-gray-900 dark:border-white scale-110'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div 
              className="p-2 rounded-lg" 
              style={{ backgroundColor: `${selectedColor}20` }}
            >
              <Icon name={selectedIcon} size={20} color={selectedColor} />
            </div>
            <div>
              <div className="font-medium">{title || 'Habit Title'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {category} • {frequency} • {xpOnComplete} XP
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon="plus">
            Add Habit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
