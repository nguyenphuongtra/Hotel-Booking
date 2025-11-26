import React from 'react'

export interface SeparatorProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({ className = '', orientation = 'horizontal' }: SeparatorProps) {
  if (orientation === 'vertical') {
    return <div className={`w-px bg-gray-200 ${className}`} />
  }
  return <hr className={`border-0 border-t border-gray-200 ${className}`} />
}


