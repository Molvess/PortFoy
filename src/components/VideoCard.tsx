import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlay, HiX } from 'react-icons/hi';
import type { Video } from '../types';
import { getYouTubeEmbedUrl } from '../lib/youtube';

interface Props {
  video: Video;
  index: number;
}

export default function VideoCard({ video, index }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Extract thumbnail from YouTube URL
  const getThumbnail = (url: string): string => {
    if (video.thumbnailUrl) return video.thumbnailUrl;
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&]+)/
    );
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    return '';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsPlaying(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-dark-card transition-all duration-500 hover:border-neon-purple/30 hover:shadow-xl hover:shadow-neon-purple/10"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {getThumbnail(video.embedUrl) ? (
            <img
              src={getThumbnail(video.embedUrl)}
              alt={video.title}
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-dark-secondary">
              <HiPlay className="h-12 w-12 text-text-muted" />
            </div>
          )}

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-80' : 'opacity-60'
            }`}
          />

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neon-purple/90 shadow-lg shadow-neon-purple/30 transition-transform group-hover:scale-110">
              <HiPlay className="ml-1 h-7 w-7 text-white" />
            </div>
          </motion.div>

          {/* Category badge */}
          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                video.category === 'portfolio'
                  ? 'bg-neon-purple/20 text-neon-purple'
                  : 'bg-neon-blue/20 text-neon-blue'
              }`}
            >
              {video.category === 'portfolio' ? 'Portfolio' : 'İçerik'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="p-4">
          <h3 className="font-heading text-sm font-semibold text-white line-clamp-2 sm:text-base">
            {video.title}
          </h3>
        </div>
      </motion.div>

      {/* Lightbox Player */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsPlaying(false)}
        >
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <HiX className="h-5 w-5" />
          </button>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getYouTubeEmbedUrl(video.embedUrl)}
              width="100%"
              height="100%"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
