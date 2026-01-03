import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        
        <input
          type={type}
          className={`
            w-full px-4 py-3 rounded-gt-lg border 
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-gt-primary focus:ring-2 focus:ring-gt-soft'}
            focus:outline-none transition-all duration-300 
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          {...props}
        />
        
        {error && (
          <FiAlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;