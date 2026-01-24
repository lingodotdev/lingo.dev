import React from 'react';

export interface Category {
  value: string;
  label: string;
  color: string;
  icon: string;
}

export const categories: Category[] = [
  { value: 'Food & Dining', label: 'Food & Dining', icon: 'bi-fork-knife', color: '#FF6B6B' },
  { value: 'Transportation', label: 'Transportation', icon: 'bi-car-front', color: '#4ECDC4' },
  { value: 'Shopping', label: 'Shopping', icon: 'bi-bag', color: '#45B7D1' },
  { value: 'Entertainment', label: 'Entertainment', icon: 'bi-film', color: '#96CEB4' },
  { value: 'Bills & Utilities', label: 'Bills & Utilities', icon: 'bi-lightbulb', color: '#FFEAA7' },
  { value: 'Healthcare', label: 'Healthcare', icon: 'bi-hospital', color: '#DDA0DD' },
  { value: 'Education', label: 'Education', icon: 'bi-book', color: '#98D8C8' },
  { value: 'Travel', label: 'Travel', icon: 'bi-airplane', color: '#F7DC6F' },
  { value: 'Fitness', label: 'Fitness', icon: 'bi-heart-pulse', color: '#BB8FCE' },
  { value: 'Other', label: 'Other', icon: 'bi-box', color: '#AED6F1' }
];

/**
 * Retrieves a category object by its value identifier.
 * @param value - The category value to search for
 * @returns The matching Category object or undefined if not found
 */
export const getCategoryByValue = (value: string): Category | undefined => {
  return categories.find(cat => cat.value === value);
};

/**
 * Gets the color associated with a category.
 * @param value - The category value to look up
 * @returns The hex color code for the category, or a default light blue if not found
 */
export const getCategoryColor = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.color || '#AED6F1';
};

/**
 * Creates a React element for the category's Bootstrap icon.
 * @param value - The category value to get the icon for
 * @returns A React element representing the category icon
 */
export const getCategoryIcon = (value: string): React.ReactElement => {
  const category = getCategoryByValue(value);
  const iconClass = category?.icon || 'bi-box';
  return React.createElement('i', { className: `bi ${iconClass}` });
};
