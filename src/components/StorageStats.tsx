import React from 'react';
import { Database, Clock, Hash, FileText, Trash2 } from 'lucide-react';
import { InstagramService } from '../services/instagramService';

interface StorageStatsProps {
  onClearCache?: () => void;
}

export const StorageStats: React.FC<StorageStatsProps> = ({ onClearCache }) => {
  const instagramService = InstagramService.getInstance();
  const stats = instagramService.getStorageStats();
  const searchHistory = instagramService.getSearchHistory();

  const handleClearCache = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todos los datos almacenados?')) {
      instagramService.clearOldCache();
      onClearCache?.();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Almacenamiento Local</h3>
        </div>
        <button
          onClick={handleClearCache}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Limpiar</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <Hash className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{stats.totalHashtags}</div>
          <div className="text-sm text-blue-700">Hashtags</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-xl">
          <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{stats.totalPosts}</div>
          <div className="text-sm text-green-700">Publicaciones</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <Database className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{stats.storageUsed}</div>
          <div className="text-sm text-purple-700">Almacenado</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-xl">
          <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-xs font-medium text-orange-900">
            {formatDate(stats.lastUpdated)}
          </div>
          <div className="text-sm text-orange-700">Última actualización</div>
        </div>
      </div>

      {searchHistory.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Búsquedas recientes:</h4>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 8).map((hashtag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};