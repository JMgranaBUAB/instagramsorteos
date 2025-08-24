import React, { useState } from 'react';
import { Search, Hash, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (hashtag: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [hashtag, setHashtag] = useState('sorteo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashtag.trim()) {
      onSearch(hashtag.trim().replace('#', ''));
    }
  };

  const popularHashtags = ['sorteo', 'giveaway', 'concurso', 'regalo', 'sorteos', 'ganador'];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
            placeholder="Buscar hashtag (ej: sorteo)"
            className="w-full pl-12 pr-16 py-4 text-lg rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Buscando...' : 'Buscar'}</span>
          </button>
        </div>
      </form>

      {/* Popular hashtags */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-500 mr-2">Popular:</span>
        {popularHashtags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setHashtag(tag);
              onSearch(tag);
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 text-sm rounded-full transition-all"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};