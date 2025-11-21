import React, { createContext, useContext } from 'react'

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined)

export interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function RadioGroup({ value, onValueChange, children, className = '' }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps {
  value: string
  id: string
  className?: string
}

export function RadioGroupItem({ value, id, className = '' }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup')
  }

  const { value: selectedValue, onValueChange } = context
  const isChecked = selectedValue === value

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={() => onValueChange(value)}
      className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${className}`}
    />
  )
}

