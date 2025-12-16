import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', ...props }) => {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors';
  
  const variants: Record<string, string> = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-white',
    destructive: 'bg-red-600 text-white',
  };

  const variantClass = variants[variant] || variants.default;
  
  return (
    <span className={`${base} ${variantClass} ${className}`} {...props} />
  );
};
