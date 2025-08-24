import React from 'react';
import { ExternalLink, Heart, MessageCircle, Share, User } from 'lucide-react';

export interface InstagramPost {
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

interface PostCardProps {
  post: InstagramPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 7) return date.toLocaleDateString();
    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group">
      {/* Header */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            {post.userAvatar ? (
              <img src={post.userAvatar} alt={post.username} className="w-8 h-8 rounded-full" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">@{post.username}</p>
          <p className="text-sm text-gray-500">{formatDate(post.timestamp)}</p>
        </div>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Ver en Instagram"
        >
          <ExternalLink className="w-5 h-5 text-gray-600" />
        </a>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={post.imageUrl}
          alt="Instagram post"
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
          </div>
          <Share className="w-5 h-5 text-gray-600 ml-auto cursor-pointer hover:text-purple-600 transition-colors" />
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
            {post.caption.length > 100 ? `${post.caption.substring(0, 100)}...` : post.caption}
          </p>
          
          {/* Hashtags */}
          <div className="flex flex-wrap gap-1">
            {post.hashtags.slice(0, 3).map((hashtag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium"
              >
                #{hashtag}
              </span>
            ))}
            {post.hashtags.length > 3 && (
              <span className="text-xs text-gray-500 py-1">
                +{post.hashtags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};