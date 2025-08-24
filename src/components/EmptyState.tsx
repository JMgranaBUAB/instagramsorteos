import React from 'react';
import { Search, Instagram } from 'lucide-react';

interface EmptyStateProps {
  hashtag?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hashtag }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
          <Instagram className="w-10 h-10 text-purple-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {hashtag ? `No se encontraron publicaciones para #${hashtag}` : 'Busca publicaciones de Instagram'}
        </h3>
        <p className="text-gray-500 max-w-md">
          {hashtag
            ? 'Intenta con otro hashtag o verifica que esté escrito correctamente'
            : 'Ingresa un hashtag para encontrar publicaciones relacionadas con sorteos y concursos'}
        </p>
      </div>
    </div>
  );
};