import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstagramPost {
  id: string;
  url: string;
  caption: string;
  imageUrl: string;
  username: string;
  userAvatar: string;
  likes: number;
  comments: number;
  timestamp: string;
  hashtags: string[];
}

async function scrapeInstagramHashtag(hashtag: string): Promise<InstagramPost[]> {
  try {
    // Método 1: Usar Instagram Basic Display API (requiere token de acceso)
    // const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${accessToken}`);
    
    // Método 2: Web scraping usando la URL pública de Instagram
    const instagramUrl = `https://www.instagram.com/explore/tags/${hashtag}/`;
    
    const response = await fetch(instagramUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Extraer datos JSON de la página
    const scriptMatch = html.match(/window\._sharedData\s*=\s*({.+?});/);
    if (!scriptMatch) {
      throw new Error('No se pudo encontrar datos de Instagram');
    }

    const sharedData = JSON.parse(scriptMatch[1]);
    const posts = sharedData?.entry_data?.TagPage?.[0]?.graphql?.hashtag?.edge_hashtag_to_media?.edges || [];

    const extractedPosts: InstagramPost[] = posts.slice(0, 12).map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        url: `https://www.instagram.com/p/${node.shortcode}/`,
        caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
        imageUrl: node.display_url || node.thumbnail_src,
        username: node.owner?.username || 'unknown',
        userAvatar: node.owner?.profile_pic_url || '',
        likes: node.edge_liked_by?.count || 0,
        comments: node.edge_media_to_comment?.count || 0,
        timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
        hashtags: extractHashtags(node.edge_media_to_caption?.edges?.[0]?.node?.text || '')
      };
    });

    return extractedPosts;
  } catch (error) {
    console.error('Error scraping Instagram:', error);
    throw error;
  }
}

function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w\u00c0-\u024f\u1e00-\u1eff]+/gi;
  const matches = text.match(hashtagRegex) || [];
  return matches.map(tag => tag.substring(1).toLowerCase());
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { hashtag } = await req.json();
    
    if (!hashtag) {
      return new Response(
        JSON.stringify({ error: 'Hashtag is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const posts = await scrapeInstagramHashtag(hashtag);
    
    return new Response(
      JSON.stringify({ posts }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al extraer publicaciones de Instagram',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})