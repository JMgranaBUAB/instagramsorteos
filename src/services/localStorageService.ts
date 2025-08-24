export interface StoredPost {
  id: string;
  hashtag: string;
  timestamp: string;
  data: any;
}

export class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly POSTS_KEY = 'instagram_posts';
  private readonly SEARCH_HISTORY_KEY = 'search_history';

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Guardar publicaciones por hashtag
  savePosts(hashtag: string, posts: any[]): void {
    try {
      const existingData = this.getAllStoredPosts();
      const newData = {
        ...existingData,
        [hashtag]: {
          posts,
          timestamp: new Date().toISOString(),
          count: posts.length
        }
      };
      localStorage.setItem(this.POSTS_KEY, JSON.stringify(newData));
      this.addToSearchHistory(hashtag);
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  }

  // Obtener publicaciones por hashtag
  getPosts(hashtag: string): any[] {
    try {
      const data = this.getAllStoredPosts();
      return data[hashtag]?.posts || [];
    } catch (error) {
      console.error('Error getting posts from localStorage:', error);
      return [];
    }
  }

  // Obtener todos los datos almacenados
  getAllStoredPosts(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.POSTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      return {};
    }
  }

  // Verificar si hay datos en caché para un hashtag
  hasCachedData(hashtag: string, maxAgeMinutes: number = 30): boolean {
    try {
      const data = this.getAllStoredPosts();
      const hashtagData = data[hashtag];
      
      if (!hashtagData) return false;
      
      const timestamp = new Date(hashtagData.timestamp);
      const now = new Date();
      const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);
      
      return diffMinutes < maxAgeMinutes;
    } catch (error) {
      console.error('Error checking cached data:', error);
      return false;
    }
  }

  // Historial de búsquedas
  addToSearchHistory(hashtag: string): void {
    try {
      const history = this.getSearchHistory();
      const updatedHistory = [hashtag, ...history.filter(h => h !== hashtag)].slice(0, 10);
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  getSearchHistory(): string[] {
    try {
      const history = localStorage.getItem(this.SEARCH_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  // Limpiar datos antiguos
  clearOldData(maxAgeDays: number = 7): void {
    try {
      const data = this.getAllStoredPosts();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

      const filteredData: Record<string, any> = {};
      
      Object.entries(data).forEach(([hashtag, hashtagData]: [string, any]) => {
        const timestamp = new Date(hashtagData.timestamp);
        if (timestamp > cutoffDate) {
          filteredData[hashtag] = hashtagData;
        }
      });

      localStorage.setItem(this.POSTS_KEY, JSON.stringify(filteredData));
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }

  // Obtener estadísticas de almacenamiento
  getStorageStats(): {
    totalHashtags: number;
    totalPosts: number;
    storageUsed: string;
    lastUpdated: string | null;
  } {
    try {
      const data = this.getAllStoredPosts();
      const hashtags = Object.keys(data);
      const totalPosts = hashtags.reduce((sum, hashtag) => sum + (data[hashtag]?.count || 0), 0);
      
      const storageUsed = new Blob([JSON.stringify(data)]).size;
      const storageUsedKB = (storageUsed / 1024).toFixed(2);
      
      const lastUpdated = hashtags.length > 0 
        ? Math.max(...hashtags.map(h => new Date(data[h]?.timestamp || 0).getTime()))
        : null;

      return {
        totalHashtags: hashtags.length,
        totalPosts,
        storageUsed: `${storageUsedKB} KB`,
        lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : null
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalHashtags: 0,
        totalPosts: 0,
        storageUsed: '0 KB',
        lastUpdated: null
      };
    }
  }

  // Limpiar todo el almacenamiento
  clearAll(): void {
    try {
      localStorage.removeItem(this.POSTS_KEY);
      localStorage.removeItem(this.SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}