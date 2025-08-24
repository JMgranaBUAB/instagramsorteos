// src/services/thirdPartyAPIs.ts
import { InstagramPost } from '../components/PostCard';

export class ThirdPartyInstagramAPI {
  private rapidApiKey: string;

  constructor(rapidApiKey: string) {
    this.rapidApiKey = rapidApiKey;
  }

  // Opción 1: RapidAPI Instagram API
  async searchWithRapidAPI(hashtag: string): Promise<InstagramPost[]> {
    try {
      const response = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1/hashtag?hashtag=${encodeURIComponent(hashtag)}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`RapidAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.transformRapidAPIData(data);
    } catch (error) {
      console.error('RapidAPI error:', error);
      throw error;
    }
  }

  // Opción 2: Instagram Public API (no oficial)
  async searchPublicAPI(hashtag: string): Promise<InstagramPost[]> {
    try {
      // Nota: Estas URLs pueden cambiar y no son oficiales
      const response = await fetch(
        `https://www.instagram.com/explore/tags/${hashtag}/?__a=1`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Instagram public API error');
      }

      const data = await response.json();
      
      return this.transformPublicAPIData(data);
    } catch (error) {
      console.error('Public API error:', error);
      throw error;
    }
  }

  // Opción 3: Apify Instagram Scraper
  async searchWithApify(hashtag: string): Promise<InstagramPost[]> {
    try {
      const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-scraper/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_APIFY_TOKEN}`,
        },
        body: JSON.stringify({
          hashtags: [hashtag],
          resultsLimit: 50,
        }),
      });

      if (!response.ok) {
        throw new Error('Apify API error');
      }

      const runData = await response.json();
      
      // Esperar a que termine el scraping
      await this.waitForApifyCompletion(runData.data.id);
      
      // Obtener resultados
      const resultsResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/${runData.data.id}/dataset/items`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_APIFY_TOKEN}`,
          },
        }
      );

      const results = await resultsResponse.json();
      return this.transformApifyData(results);
    } catch (error) {
      console.error('Apify error:', error);
      throw error;
    }
  }

  private transformRapidAPIData(data: any): InstagramPost[] {
    if (!data.data || !Array.isArray(data.data.recent)) {
      return [];
    }

    return data.data.recent.map((item: any) => ({
      id: item.id || Math.random().toString(),
      url: `https://instagram.com/p/${item.code}`,
      caption: item.caption?.text || '',
      imageUrl: item.display_url || item.thumbnail_src,
      username: item.owner?.username || 'unknown',
      userAvatar: item.owner?.profile_pic_url || '',
      likes: item.edge_liked_by?.count || 0,
      comments: item.edge_media_to_comment?.count || 0,
      timestamp: new Date(item.taken_at_timestamp * 1000).toISOString(),
      hashtags: this.extractHashtags(item.caption?.text || ''),
    }));
  }

  private transformPublicAPIData(data: any): InstagramPost[] {
    if (!data.graphql?.hashtag?.edge_hashtag_to_media?.edges) {
      return [];
    }

    return data.graphql.hashtag.edge_hashtag_to_media.edges.map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        url: `https://instagram.com/p/${node.shortcode}`,
        caption: node.edge_media_to_caption?.edges[0]?.node?.text || '',
        imageUrl: node.display_url,
        username: node.owner?.username || 'unknown',
        userAvatar: '', // No disponible en esta API
        likes: node.edge_liked_by?.count || 0,
        comments: node.edge_media_to_comment?.count || 0,
        timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
        hashtags: this.extractHashtags(node.edge_media_to_caption?.edges[0]?.node?.text || ''),
      };
    });
  }

  private transformApifyData(data: any[]): InstagramPost[] {
    return data.map((item: any) => ({
      id: item.id || Math.random().toString(),
      url: item.url,
      caption: item.caption || '',
      imageUrl: item.displayUrl,
      username: item.ownerUsername || 'unknown',
      userAvatar: '', // Dependiendo de la respuesta de Apify
      likes: item.likesCount || 0,
      comments: item.commentsCount || 0,
      timestamp: item.timestamp,
      hashtags: this.extractHashtags(item.caption || ''),
    }));
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#\w+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }

  private async waitForApifyCompletion(runId: string): Promise<void> {
    const maxWaitTime = 60000; // 1 minuto
    const interval = 2000; // 2 segundos
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_APIFY_TOKEN}`,
          },
        }
      );

      const status = await statusResponse.json();
      
      if (status.data.status === 'SUCCEEDED') {
        return;
      }
      
      if (status.data.status === 'FAILED') {
        throw new Error('Apify scraping failed');
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      elapsed += interval;
    }

    throw new Error('Apify scraping timeout');
  }
}