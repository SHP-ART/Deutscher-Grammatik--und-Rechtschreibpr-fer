import React, { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  color?: 'indigo' | 'purple' | 'pink' | 'blue' | 'green';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  color = 'indigo',
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer group ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all"
        {...props}
      />
      <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
