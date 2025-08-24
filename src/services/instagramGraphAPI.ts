// src/services/instagramGraphAPI.ts
import { InstagramPost } from '../components/PostCard';

export class InstagramGraphAPI {
  private accessToken: string;
  private businessAccountId: string;

  constructor(accessToken: string, businessAccountId: string) {
    this.accessToken = accessToken;
    this.businessAccountId = businessAccountId;
  }

  async searchByHashtag(hashtag: string): Promise<InstagramPost[]> {
    try {
      // 1. Buscar el hashtag ID
      const hashtagSearchUrl = `https://graph.facebook.com/v18.0/ig_hashtag_search?user_id=${this.businessAccountId}&q=${hashtag}&access_token=${this.accessToken}`;
      
      const hashtagResponse = await fetch(hashtagSearchUrl);
      const hashtagData = await hashtagResponse.json();
      
      if (!hashtagData.data || hashtagData.data.length === 0) {
        throw new Error('Hashtag no encontrado');
      }

      const hashtagId = hashtagData.data[0].id;

      // 2. Obtener publicaciones recientes del hashtag
      const postsUrl = `https://graph.facebook.com/v18.0/${hashtagId}/recent_media?user_id=${this.businessAccountId}&fields=id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count,owner&access_token=${this.accessToken}`;
      
      const postsResponse = await fetch(postsUrl);
      const postsData = await postsResponse.json();

      if (postsData.error) {
        throw new Error(postsData.error.message);
      }

      // 3. Transformar datos al formato de la aplicación
      const transformedPosts: InstagramPost[] = await Promise.all(
        postsData.data.map(async (post: any) => {
          // Obtener información del usuario
          let username = 'unknown_user';
          let userAvatar = '';
          
          try {
            if (post.owner) {
              const userResponse = await fetch(
                `https://graph.facebook.com/v18.0/${post.owner.id}?fields=username,profile_picture_url&access_token=${this.accessToken}`
              );
              const userData = await userResponse.json();
              username = userData.username || 'unknown_user';
              userAvatar = userData.profile_picture_url || '';
            }
          } catch (error) {
            console.warn('Error fetching user data:', error);
          }

          // Extraer hashtags del caption
          const hashtags = post.caption 
            ? post.caption.match(/#\w+/g)?.map((tag: string) => tag.substring(1)) || []
            : [];

          return {
            id: post.id,
            url: post.permalink,
            caption: post.caption || '',
            imageUrl: post.media_url,
            username,
            userAvatar,
            likes: post.like_count || 0,
            comments: post.comments_count || 0,
            timestamp: post.timestamp,
            hashtags
          };
        })
      );

      return transformedPosts;
    } catch (error) {
      console.error('Error fetching from Instagram Graph API:', error);
      throw error;
    }
  }

  // Método para obtener publicaciones de tu propia cuenta
  async getOwnPosts(): Promise<InstagramPost[]> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.businessAccountId}/media?fields=id,media_type,media_url,permalink,caption,timestamp,like_count,comments_count&access_token=${this.accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const transformedPosts: InstagramPost[] = data.data.map((post: any) => {
        const hashtags = post.caption 
          ? post.caption.match(/#\w+/g)?.map((tag: string) => tag.substring(1)) || []
          : [];

        return {
          id: post.id,
          url: post.permalink,
          caption: post.caption || '',
          imageUrl: post.media_url,
          username: 'tu_cuenta', // Aquí podrías obtener el username real
          userAvatar: '',
          likes: post.like_count || 0,
          comments: post.comments_count || 0,
          timestamp: post.timestamp,
          hashtags
        };
      });

      return transformedPosts;
    } catch (error) {
      console.error('Error fetching own posts:', error);
      throw error;
    }
  }
}