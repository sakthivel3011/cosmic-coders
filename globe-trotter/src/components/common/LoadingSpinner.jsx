import React from 'react';
import { FiLoader } from 'react-icons/fi';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  text = '',
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'text-gt-primary',
    secondary: 'text-gt-secondary',
    white: 'text-white',
    gray: 'text-gray-400',
    success: 'text-green-500',
    danger: 'text-red-500'
  };

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <FiLoader className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
      </div>
      {text && (
        <span className={`ml-3 font-medium ${colorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {spinner}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Variant with dots
export const LoadingDots = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4'
  };

  const colorClasses = {
    primary: 'bg-gt-primary',
    secondary: 'bg-gt-secondary',
    white: 'bg-white',
    gray: 'bg-gray-400'
  };

  return (
    <div className="flex items-center space-x-1">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      ></div>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      ></div>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      ></div>
    </div>
  );
};

// Variant with progress bar
export const LoadingProgress = ({ progress = 0, showPercentage = true }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Loading...</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gt-primary">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-gt-primary to-gt-secondary h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ 
  type = 'text',
  count = 1,
  className = ''
}) => {
  const skeletons = [];

  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'card':
        skeletons.push(
          <div key={i} className="bg-gray-200 animate-pulse rounded-xl p-6">
            <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        );
        break;
      
      case 'line':
        skeletons.push(
          <div key={i} className={`h-4 bg-gray-200 animate-pulse rounded ${className}`}></div>
        );
        break;
      
      case 'circle':
        skeletons.push(
          <div key={i} className={`h-12 w-12 bg-gray-200 animate-pulse rounded-full ${className}`}></div>
        );
        break;
      
      case 'avatar':
        skeletons.push(
          <div key={i} className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-24"></div>
              <div className="h-2 bg-gray-200 animate-pulse rounded w-16"></div>
            </div>
          </div>
        );
        break;
      
      default: // text
        skeletons.push(
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-4/6"></div>
          </div>
        );
    }
  }

  return <>{skeletons}</>;
};

export default LoadingSpinner;