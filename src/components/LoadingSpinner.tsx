import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Extrayendo publicaciones...</h3>
        <p className="text-sm text-gray-500">Esto puede tomar unos segundos</p>
      </div>
    </div>
  );
};