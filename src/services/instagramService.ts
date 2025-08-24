import { supabase } from '../lib/supabase';
import { InstagramPost } from '../components/PostCard';
import { LocalStorageService } from './localStorageService';
import { generateMockPosts } from '../data/mockData';

export class InstagramService {
  private static instance: InstagramService;
  private localStorageService: LocalStorageService;
  
  constructor() {
    this.localStorageService = LocalStorageService.getInstance();
  }

  static getInstance(): InstagramService {
    if (!InstagramService.instance) {
      InstagramService.instance = new InstagramService();
    }
    return InstagramService.instance;
  }

  async searchByHashtag(hashtag: string): Promise<InstagramPost[]> {
    // Verificar si hay datos en caché primero
    if (this.localStorageService.hasCachedData(hashtag, 30)) {
      console.log('Loading from localStorage cache...');
      return this.localStorageService.getPosts(hashtag);
    }

    try {
      // Simular llamada a Instagram API con datos mock
      console.log('Fetching new data for hashtag:', hashtag);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar datos mock (en producción esto sería la llamada real a Instagram)
      const posts = generateMockPosts(hashtag);
      
      // Guardar en localStorage
      this.localStorageService.savePosts(hashtag, posts);
      
      return posts;
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      
      // Si hay error, intentar cargar desde caché aunque sea antiguo
      const cachedPosts = this.localStorageService.getPosts(hashtag);
      if (cachedPosts.length > 0) {
        console.log('Loading from localStorage cache (fallback)...');
        return cachedPosts;
      }
      
      throw error;
    }
  }

  // Método para obtener datos desde caché
  getCachedPosts(hashtag: string): InstagramPost[] {
    return this.localStorageService.getPosts(hashtag);
  }

  // Método para verificar si hay caché
  hasCachedData(hashtag: string): boolean {
    return this.localStorageService.hasCachedData(hashtag);
  }

  // Obtener historial de búsquedas
  getSearchHistory(): string[] {
    return this.localStorageService.getSearchHistory();
  }

  // Obtener estadísticas de almacenamiento
  getStorageStats() {
    return this.localStorageService.getStorageStats();
  }

  // Limpiar caché antiguo
  clearOldCache(): void {
    this.localStorageService.clearOldData();
  }

  async searchWithAPI(hashtag: string, accessToken: string): Promise<InstagramPost[]> {
    try {
      // Método 2: Instagram API oficial (más confiable pero requiere autenticación)
      const { data, error } = await supabase.functions.invoke('instagram-api', {
        body: { hashtag, accessToken }
      });

      if (error) {
        console.error('Error with API:', error);
        throw new Error('Error al obtener publicaciones de la API');
      }

      return data.posts || [];
    } catch (error) {
      console.error('Instagram API service error:', error);
      throw error;
    }
  }

  async searchPublicHashtag(hashtag: string): Promise<InstagramPost[]> {
    try {
      // Método 3: Usar un servicio proxy o API alternativa
      const response = await fetch(`https://www.instagram.com/web/search/topsearch/?query=%23${hashtag}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error('Error al buscar hashtag');
      }

      const data = await response.json();
      
      // Procesar los resultados y convertir al formato esperado
      const posts: InstagramPost[] = [];
      
      if (data.hashtags && data.hashtags.length > 0) {
        const hashtagData = data.hashtags[0];
        // Aquí necesitarías hacer otra llamada para obtener las publicaciones del hashtag
        // Este es un ejemplo simplificado
      }

      return posts;
    } catch (error) {
      console.error('Public hashtag search error:', error);
      throw error;
    }
  }
}