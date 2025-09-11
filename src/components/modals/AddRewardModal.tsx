import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useAppStore } from '../../store/appStore';
import type { Reward } from '../../types';

interface AddRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRewardModal({ isOpen, onClose }: AddRewardModalProps) {
  const addReward = useAppStore(state => state.addReward);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 100,
    category: 'entertainment',
    isAvailable: true
  });

  const [selectedIcon, setSelectedIcon] = useState('Gift');

  const rewardIcons = [
    'Gift', 'Trophy', 'Star', 'Crown', 'Diamond', 'Heart',
    'Coffee', 'Music', 'GameController2', 'Camera',
    'Book', 'Headphones', 'Pizza', 'IceCream'
  ];

  const rewardCategories = [
    'entertainment',
    'food',
    'shopping',
    'experience',
    'digital',
    'other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const newReward: Reward = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      cost: formData.pointsCost,
      icon: selectedIcon,
      rarity: 'common'
    };

    addReward(newReward);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      pointsCost: 100,
      category: 'entertainment',
      isAvailable: true
    });
    setSelectedIcon('Gift');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Reward">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reward Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reward Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
            placeholder="e.g., Watch a movie, Buy a coffee"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 resize-none"
            rows={3}
            placeholder="Optional description of the reward..."
          />
        </div>

        {/* Points Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Points Cost
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={formData.pointsCost}
            onChange={(e) => setFormData(prev => ({ ...prev, pointsCost: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          >
            {rewardCategories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose Icon
          </label>
          <div className="grid grid-cols-7 gap-2">
            {rewardIcons.map((iconName) => (
              <motion.button
                key={iconName}
                type="button"
                onClick={() => setSelectedIcon(iconName)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedIcon === iconName
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon 
                  name={iconName as any} 
                  className={`w-6 h-6 ${
                    selectedIcon === iconName 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`} 
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Available Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded 
                     focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Make reward available immediately
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!formData.name.trim()}
          >
            <Icon name="Plus" className="w-5 h-5 mr-2" />
            Add Reward
          </Button>
        </div>
      </form>
    </Modal>
  );
}
