import React from 'react';
import { X } from 'lucide-react';

const Badge = ({
  children,
  color = 'slate',
  variant = 'solid',
  size = 'md',
  onRemove,
  onClick
}) => {
  const colors = {
    slate: {
      solid: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      outline: 'border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300'
    },
    blue: {
      solid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      outline: 'border border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-300'
    },
    green: {
      solid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      outline: 'border border-green-300 text-green-700 dark:border-green-800 dark:text-green-300'
    },
    red: {
      solid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      outline: 'border border-red-300 text-red-700 dark:border-red-800 dark:text-red-300'
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      outline: 'border border-yellow-300 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300'
    },
    purple: {
      solid: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      outline: 'border border-purple-300 text-purple-700 dark:border-purple-800 dark:text-purple-300'
    },
    orange: {
      solid: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      outline: 'border border-orange-300 text-orange-700 dark:border-orange-800 dark:text-orange-300'
    }
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5'
  };

  const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors';
  const interactiveStyles = onClick ? 'cursor-pointer hover:opacity-80' : '';
  const colorStyles = colors[color]?.[variant] || colors.slate[variant];
  
  const classes = `${baseStyles} ${sizes[size]} ${colorStyles} ${interactiveStyles}`;

  return (
    <span 
      className={classes}
      onClick={onClick}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Badge;
