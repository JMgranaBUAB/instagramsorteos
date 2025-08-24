import React from 'react';
import { TrendingUp, Users, Hash } from 'lucide-react';

interface StatsBarProps {
  totalPosts: number;
  hashtag: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({ totalPosts, hashtag }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <Hash className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Hashtag</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">#{hashtag}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Publicaciones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalPosts.toLocaleString()}</p>
        </div>
        
        <div className="text-center md:text-right">
          <div className="flex items-center justify-center md:justify-end space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Estado</span>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Actualizado
          </span>
        </div>
      </div>
    </div>
  );
};