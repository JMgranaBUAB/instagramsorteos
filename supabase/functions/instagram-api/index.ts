import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstagramApiPost {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  media_type: string;
}

async function getInstagramPosts(accessToken: string): Promise<any[]> {
  try {
    // Instagram Basic Display API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching from Instagram API:', error);
    throw error;
  }
}

function filterPostsByHashtag(posts: InstagramApiPost[], hashtag: string) {
  return posts.filter(post => {
    const caption = post.caption?.toLowerCase() || '';
    return caption.includes(`#${hashtag.toLowerCase()}`);
  });
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
    const { hashtag, accessToken } = await req.json();
    
    if (!hashtag || !accessToken) {
      return new Response(
        JSON.stringify({ error: 'Hashtag and access token are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const allPosts = await getInstagramPosts(accessToken);
    const filteredPosts = filterPostsByHashtag(allPosts, hashtag);
    
    const formattedPosts = filteredPosts.map(post => ({
      id: post.id,
      url: post.permalink,
      caption: post.caption || '',
      imageUrl: post.media_url,
      username: 'tu_usuario', // Necesitarías otra llamada para obtener info del usuario
      userAvatar: '',
      likes: 0, // Requiere permisos adicionales
      comments: 0, // Requiere permisos adicionales
      timestamp: post.timestamp,
      hashtags: extractHashtags(post.caption || '')
    }));
    
    return new Response(
      JSON.stringify({ posts: formattedPosts }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al obtener publicaciones de Instagram',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})