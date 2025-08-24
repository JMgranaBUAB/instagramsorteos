import React, { useState, useEffect } from 'react';
import { Instagram, AlertCircle } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PostCard, InstagramPost } from './components/PostCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';
import { StatsBar } from './components/StatsBar';
import { generateMockPosts } from './data/mockData';

function App() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentHashtag, setCurrentHashtag] = useState<string>('');

  const handleSearch = async (hashtag: string) => {
    setIsLoading(true);
    setCurrentHashtag(hashtag);
    
    // Simular llamada a API
    setTimeout(() => {
      const mockPosts = generateMockPosts(hashtag);
      setPosts(mockPosts);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    // Cargar datos iniciales
    handleSearch('sorteo');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  InstaSorteos
                </h1>
                <p className="text-sm text-gray-500">Extractor de publicaciones con hashtags</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700 font-medium">Demo con datos de ejemplo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Encuentra publicaciones de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Instagram</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Extrae automáticamente todas las publicaciones que contengan el hashtag que necesitas y accede directamente a ellas.
          </p>
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : posts.length > 0 ? (
            <>
              <StatsBar totalPosts={posts.length} hashtag={currentHashtag} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center pt-8">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-medium">
                  Cargar más publicaciones
                </button>
              </div>
            </>
          ) : (
            <EmptyState hashtag={currentHashtag} />
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-16 p-6 bg-white rounded-2xl border border-gray-100">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Implementación completa</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Esta es una demostración con datos de ejemplo. Para la implementación real, se necesitaría integrar con la API de Instagram o usar edge functions para hacer web scraping de manera segura, respetando los términos de servicio de la plataforma.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">API de Instagram</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Edge Functions</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Supabase Backend</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;