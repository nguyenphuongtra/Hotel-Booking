import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}
export const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onCheckedChange, className = '', ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={e => onCheckedChange && onCheckedChange(e.target.checked)}
    className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
    {...props}
  />
);
