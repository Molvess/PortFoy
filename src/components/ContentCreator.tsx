import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import SectionWrapper from './SectionWrapper';
import { databases, DATABASE_ID, VIDEOS_COLLECTION_ID, Query } from '../lib/appwrite';
import type { Video } from '../types';
import { HiPlay } from 'react-icons/hi';

// Fallback
const fallbackContent: Video[] = [
  {
    $id: 'c1',
    title: 'Nasıl Video Editör Oldum? — Hikayem',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'content_creator',
  },
  {
    $id: 'c2',
    title: 'Premiere Pro vs DaVinci Resolve — Hangisi?',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'content_creator',
  },
  {
    $id: 'c3',
    title: 'Freelance Video Editor Olarak Kazanç',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'content_creator',
  },
];

export default function ContentCreator() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, VIDEOS_COLLECTION_ID, [
          Query.equal('category', 'content_creator'),
          Query.orderDesc('$createdAt'),
          Query.limit(6),
        ]);
        const docs = res.documents.map((d) => ({
          $id: d.$id,
          title: d.title as string,
          embedUrl: d.embedUrl as string,
          category: d.category as Video['category'],
          thumbnailUrl: d.thumbnailUrl as string | undefined,
        }));
        setVideos(docs.length > 0 ? docs : fallbackContent);
      } catch {
        setVideos(fallbackContent);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getThumbnail = (url: string, thumbUrl?: string): string => {
    if (thumbUrl) return thumbUrl;
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&]+)/
    );
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
    return '';
  };

  return (
    <section id="content" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-neon-pink/20 to-transparent" />
        <div className="absolute -left-32 bottom-0 h-[300px] w-[300px] rounded-full bg-neon-pink/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block font-mono text-sm text-neon-pink">
              {'<ContentCreator />'}
            </span>
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              İçerik{' '}
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                Üretici
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              YouTube kanalımdan öne çıkan videolar. Editörlük hikayeleri,
              ipuçları ve sahne arkası.
            </p>
          </div>
        </SectionWrapper>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-video animate-pulse rounded-2xl bg-dark-card" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, i) => (
              <motion.div
                key={video.$id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-dark-card transition-all duration-500 hover:border-neon-pink/30"
              >
                {/* Video / Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {activeVideo === video.$id ? (
                    <ReactPlayer
                      {...{ url: video.embedUrl } as any}
                      width="100%"
                      height="100%"
                      playing
                      controls
                    />
                  ) : (
                    <>
                      {getThumbnail(video.embedUrl, video.thumbnailUrl) ? (
                        <img
                          src={getThumbnail(video.embedUrl, video.thumbnailUrl)}
                          alt={video.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-dark-secondary">
                          <HiPlay className="h-10 w-10 text-text-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                      <button
                        onClick={() => setActiveVideo(video.$id!)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-pink/80 shadow-lg shadow-neon-pink/30 transition-transform group-hover:scale-110">
                          <HiPlay className="ml-0.5 h-6 w-6 text-white" />
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-heading text-base font-semibold text-white line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="mt-2 text-xs text-text-muted">
                    Molvess • YouTube
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
