import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-neutral-200 border-t-primary ${sizeClasses[size]}`}></div>
    </div>
  );
};

const PageLoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mb-4" />
        <p className="font-body text-neutral-600">Loading...</p>
      </div>
    </div>
  );
};

export { LoadingSpinner, PageLoadingSpinner };

export default LoadingSpinner