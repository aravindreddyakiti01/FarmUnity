import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-green-800 hover:bg-green-900 text-white focus:ring-green-700 shadow-xs',
    secondary:
      'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 focus:ring-stone-400 shadow-xs',
    outline:
      'border border-green-800 text-green-800 hover:bg-green-50 focus:ring-green-700',
    danger:
      'bg-red-700 hover:bg-red-800 text-white focus:ring-red-600 shadow-xs',
    ghost:
      'text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:ring-stone-300',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
};
