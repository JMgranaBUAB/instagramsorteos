// src/services/instagramService.ts - ACTUALIZADO
import { InstagramPost } from '../components/PostCard';
import { LocalStorageService } from './localStorageService';
import { generateMockPosts } from '../data/mockData';
import { InstagramGraphAPI } from './instagramGraphAPI';
import { ThirdPartyInstagramAPI } from './thirdPartyAPIs';
import { BackendProxyService } from './backendProxyService';

export class InstagramService {
  private static instance: InstagramService;
  private localStorageService: LocalStorageService;
  private graphAPI?: InstagramGraphAPI;
  private thirdPartyAPI?: ThirdPartyInstagramAPI;
  private backendProxy?: BackendProxyService;
  
  constructor() {
    this.localStorageService = LocalStorageService.getInstance();
    
    // Inicializar APIs según las variables de entorno disponibles
    this.initializeAPIs();
  }

  static getInstance(): InstagramService {
    if (!InstagramService.instance) {
      InstagramService.instance = new InstagramService();
    }
    return InstagramService.instance;
  }

  private initializeAPIs(): void {
    // Instagram Graph API
    const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
    const businessAccountId = import.meta.env.VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID;
    
    if (accessToken && businessAccountId) {
      this.graphAPI = new InstagramGraphAPI(accessToken, businessAccountId);
    }

    // RapidAPI
    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    if (rapidApiKey) {
      this.thirdPartyAPI = new ThirdPartyInstagramAPI(rapidApiKey);
    }

    // Backend Proxy
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (backendUrl) {
      this.backendProxy = new BackendProxyService(backendUrl);
    }
  }

  async searchByHashtag(hashtag: string): Promise<InstagramPost[]> {
    // Verificar si hay datos en caché primero
    if (this.localStorageService.hasCachedData(hashtag, 30)) {
      console.log('Loading from localStorage cache...');
      return this.localStorageService.getPosts(hashtag);
    }

    // Intentar diferentes métodos en orden de preferencia
    const methods = [
      { name: 'Instagram Graph API', method: () => this.searchWithGraphAPI(hashtag) },
      { name: 'Backend Proxy', method: () => this.searchWithBackend(hashtag) },
      { name: 'Third Party API', method: () => this.searchWithThirdParty(hashtag) },
      { name: 'Mock Data', method: () => this.searchWithMockData(hashtag) }
    ];

    for (const { name, method } of methods) {
      try {
        console.log(`Trying ${name}...`);
        const posts = await method();
        
        if (posts && posts.length > 0) {
          console.log(`Success with ${name}: ${posts.length} posts found`);
          // Guardar en localStorage
          this.localStorageService.savePosts(hashtag, posts);
          return posts;
        }
      } catch (error) {
        console.warn(`${name} failed:`, error);
        continue;
      }
    }

    // Si todos fallan, intentar cargar desde caché aunque sea antiguo
    const cachedPosts = this.localStorageService.getPosts(hashtag);
    if (cachedPosts.length > 0) {
      console.log('Loading from localStorage cache (fallback)...');
      return cachedPosts;
    }

    throw new Error('No se pudieron obtener publicaciones de Instagram');
  }

  private async searchWithGraphAPI(hashtag: string): Promise<InstagramPost[]> {
    if (!this.graphAPI) {
      throw new Error('Instagram Graph API not configured');
    }
    return await this.graphAPI.searchByHashtag(hashtag);
  }

  private async searchWithBackend(hashtag: string): Promise<InstagramPost[]> {
    if (!this.backendProxy) {
      throw new Error('Backend proxy not configured');
    }
    return await this.backendProxy.searchByHashtag(hashtag);
  }

  private async searchWithThirdParty(hashtag: string): Promise<InstagramPost[]> {
    if (!this.thirdPartyAPI) {
      throw new Error('Third party API not configured');
    }
    return await this.thirdPartyAPI.searchWithRapidAPI(hashtag);
  }

  private async searchWithMockData(hashtag: string): Promise<InstagramPost[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockPosts(hashtag);
  }

  // Método específico para obtener datos reales (sin fallback a mock)
  async searchRealDataOnly(hashtag: string): Promise<InstagramPost[]> {
    const realMethods = [
      { name: 'Instagram Graph API', method: () => this.searchWithGraphAPI(hashtag) },
      { name: 'Backend Proxy', method: () => this.searchWithBackend(hashtag) },
      { name: 'Third Party API', method: () => this.searchWithThirdParty(hashtag) }
    ];

    let lastError: Error | null = null;

    for (const { name, method } of realMethods) {
      try {
        console.log(`Trying real data with ${name}...`);
        const posts = await method();
        
        if (posts && posts.length > 0) {
          console.log(`Success with ${name}: ${posts.length} real posts found`);
          this.localStorageService.savePosts(hashtag, posts);
          return posts;
        }
      } catch (error) {
        console.warn(`${name} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw lastError || new Error('No real data sources available');
  }

  // ... resto de métodos existentes
  getCachedPosts(hashtag: string): InstagramPost[] {
    return this.localStorageService.getPosts(hashtag);
  }

  hasCachedData(hashtag: string): boolean {
    return this.localStorageService.hasCachedData(hashtag);
  }

  getSearchHistory(): string[] {
    return this.localStorageService.getSearchHistory();
  }

  getStorageStats() {
    return this.localStorageService.getStorageStats();
  }

  clearOldCache(): void {
    this.localStorageService.clearOldData();
  }
}