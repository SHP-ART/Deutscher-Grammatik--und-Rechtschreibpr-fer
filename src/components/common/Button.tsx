import React, { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white focus:ring-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:transform-none',
    secondary: 'bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 focus:ring-blue-300',
    danger: 'bg-gradient-to-r from-red-500 to-slate-600 hover:from-red-600 hover:to-slate-700 text-white focus:ring-red-500'
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-8 py-3',
    large: 'px-10 py-4 text-lg'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
