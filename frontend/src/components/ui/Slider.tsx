import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (val: [number, number]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ min, max, step = 1, value, onValueChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newVal = [...value] as [number, number];
    newVal[idx] = Number(e.target.value);
    // Đảm bảo min <= max
    if (newVal[0] > newVal[1]) newVal[idx === 0 ? 1 : 0] = newVal[idx];
    onValueChange(newVal);
  };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input type="range" min={min} max={max} step={step} value={value[0]}
        onChange={e => handleChange(e, 0)} className="w-1/2 accent-blue-500" />
      <input type="range" min={min} max={max} step={step} value={value[1]}
        onChange={e => handleChange(e, 1)} className="w-1/2 accent-blue-500" />
    </div>
  );
};
