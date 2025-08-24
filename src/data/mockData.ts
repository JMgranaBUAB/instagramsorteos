import { InstagramPost } from '../components/PostCard';

export const generateMockPosts = (hashtag: string): InstagramPost[] => {
  const baseUrl = 'https://images.pexels.com/photos';
  
  const mockPosts: InstagramPost[] = [
    {
      id: '1',
      url: 'https://instagram.com/p/mock1',
      caption: `🎉 ¡MEGA SORTEO! Participa y gana increíbles premios. Solo tienes que seguirnos y etiquetar a 3 amigos. #${hashtag} #giveaway #premio`,
      imageUrl: `${baseUrl}/1721939/pexels-photo-1721939.jpeg?auto=compress&cs=tinysrgb&w=400`,
      username: 'sorteos_increibles',
      userAvatar: `${baseUrl}/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100`,
      likes: 2547,
      comments: 1234,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      hashtags: [hashtag, 'giveaway', 'premio', 'ganador']
    },
    {
      id: '2',
      url: 'https://instagram.com/p/mock2',
      caption: `✨ No te pierdas este ${hashtag} espectacular! Regalamos productos valorados en más de $500. Las bases están en nuestras historias destacadas.`,
      imageUrl: `${baseUrl}/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400`,
      username: 'premios_diarios',
      userAvatar: `${baseUrl}/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
      likes: 1892,
      comments: 567,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      hashtags: [hashtag, 'premios', 'regalo', 'participar']
    },
    {
      id: '3',
      url: 'https://instagram.com/p/mock3',
      caption: `🏆 ¡Último día para participar en nuestro ${hashtag}! No dejes pasar esta oportunidad única de ganar. Muchas gracias por el apoyo de siempre.`,
      imageUrl: `${baseUrl}/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=400`,
      username: 'concursos_mx',
      userAvatar: `${baseUrl}/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100`,
      likes: 3421,
      comments: 789,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      hashtags: [hashtag, 'ultimo_dia', 'oportunidad', 'gracias']
    },
    {
      id: '4',
      url: 'https://instagram.com/p/mock4',
      caption: `🎯 ${hashtag} express! Solo 24 horas para participar. El premio es increíble y la participación súper fácil. ¡Dale like y comenta!`,
      imageUrl: `${baseUrl}/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400`,
      username: 'express_sorteos',
      userAvatar: `${baseUrl}/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100`,
      likes: 1567,
      comments: 432,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      hashtags: [hashtag, 'express', '24horas', 'facil']
    },
    {
      id: '5',
      url: 'https://instagram.com/p/mock5',
      caption: `💝 Celebrando nuestros 10K seguidores con este mega ${hashtag}. Gracias por ser parte de nuestra comunidad. Los premios están increíbles.`,
      imageUrl: `${baseUrl}/1478685/pexels-photo-1478685.jpeg?auto=compress&cs=tinysrgb&w=400`,
      username: 'comunidad_premios',
      userAvatar: `${baseUrl}/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100`,
      likes: 4123,
      comments: 1876,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      hashtags: [hashtag, '10k', 'celebracion', 'comunidad']
    },
    {
      id: '6',
      url: 'https://instagram.com/p/mock6',
      caption: `🌟 ¡Atención! Este ${hashtag} es diferente a todos. Tenemos colaboraciones especiales y los premios son de marcas reconocidas mundialmente.`,
      imageUrl: `${baseUrl}/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400`,
      username: 'marcas_premium',
      userAvatar: `${baseUrl}/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100`,
      likes: 2987,
      comments: 654,
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      hashtags: [hashtag, 'colaboracion', 'marcas', 'mundial']
    }
  ];

  return mockPosts;
};