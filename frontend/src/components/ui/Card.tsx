import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Card: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`} {...props} />
);

export const CardContent: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);
