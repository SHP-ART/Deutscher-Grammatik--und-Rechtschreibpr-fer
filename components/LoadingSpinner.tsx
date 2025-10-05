
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="w-12 h-12 border-4 border-t-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-indigo-600 font-medium">Analysiere...</p>
    </div>
  );
};

export default LoadingSpinner;
