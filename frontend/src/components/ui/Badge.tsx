import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', ...props }) => {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors';
  const variants = variant === 'secondary'
    ? 'bg-gray-100 text-gray-800'
    : 'bg-blue-600 text-white';
  return (
    <span className={`${base} ${variants} ${className}`} {...props} />
  );
};
