import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  hoverable = false, 
  className = '' 
}) => {
  const baseClasses = 'rounded-gt-xl border';
  
  const variants = {
    default: 'bg-white border-gray-100 shadow-gt-soft',
    elevated: 'bg-white border-gray-100 shadow-lg',
    outline: 'bg-transparent border-gray-200',
    filled: 'bg-gt-bg-section border-gt-soft',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hoverable ? 'hover:shadow-gt-card hover:translate-y-[-2px] transition-all duration-300' : '';

  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClass} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;