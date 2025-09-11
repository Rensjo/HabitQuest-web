import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useAppStore } from '../../store/appStore';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const addCategory = useAppStore(state => state.addCategory);
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  });

  const [selectedIcon, setSelectedIcon] = useState('Folder');

  const categoryIcons = [
    'Folder', 'Tag', 'BookOpen', 'Dumbbell', 'Heart', 'Brain',
    'Target', 'Zap', 'Leaf', 'Sun', 'Moon', 'Star',
    'Coffee', 'Home', 'Briefcase', 'Music', 'Camera', 'Palette'
  ];

  const presetColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#14B8A6', // Teal
    '#F43F5E'  // Rose
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    addCategory(formData.name.trim(), 1000); // Default target XP
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      color: '#3B82F6',
      description: ''
    });
    setSelectedIcon('Folder');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Category">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
            placeholder="e.g., Work, Health, Learning"
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
            placeholder="Optional description of this category..."
          />
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {categoryIcons.map((iconName) => (
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

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose Color
          </label>
          <div className="flex flex-wrap gap-3">
            {presetColors.map((color) => (
              <motion.button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  formData.color === color
                    ? 'border-gray-800 dark:border-white scale-110'
                    : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
          
          {/* Custom Color Input */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Or choose a custom color:
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-20 h-10 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preview
          </label>
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: formData.color + '20', borderColor: formData.color }}
            >
              <Icon 
                name={selectedIcon as any} 
                className="w-6 h-6"
                color={formData.color}
              />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formData.name || 'Category Name'}
              </div>
              {formData.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.description}
                </div>
              )}
            </div>
          </div>
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
            Add Category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
