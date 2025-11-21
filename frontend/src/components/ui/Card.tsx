import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Card: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`} {...props} />
);

export const CardHeader: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div className={`p-4 pb-2 ${className}`} {...props} />
);

export const CardTitle: React.FC<CardProps> = ({ className = '', ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props} />
);

export const CardContent: React.FC<CardProps> = ({ className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);
