import { useEffect, useState } from 'react';

import VideoCard from './VideoCard';
import SectionWrapper from './SectionWrapper';
import { databases, DATABASE_ID, VIDEOS_COLLECTION_ID, Query } from '../lib/appwrite';
import { isVideoHidden } from '../lib/hiddenFallbacks';
import type { Video } from '../types';

// Fallback demo data — Appwrite bağlantısı yoksa
const fallbackVideos: Video[] = [
  {
    $id: '1',
    title: 'Cinematic Color Grading Breakdown',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: '2',
    title: 'After Effects Motion Graphics Reel',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: '3',
    title: 'Corporate Video Edit — Brand Film',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: '4',
    title: 'Music Video Edit — Neon Vibes',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
];

export default function Showreel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await databases.listDocuments(DATABASE_ID, VIDEOS_COLLECTION_ID, [
          Query.equal('category', 'portfolio'),
          Query.orderDesc('$createdAt'),
          Query.limit(8),
        ]);
        const docs = res.documents.map((d) => ({
          $id: d.$id,
          title: d.title as string,
          embedUrl: d.embedUrl as string,
          category: d.category as Video['category'],
          thumbnailUrl: d.thumbnailUrl as string | undefined,
        }));
        const visibleFallbacks = fallbackVideos.filter((v) => !isVideoHidden(v.$id!));
        setVideos(docs.length > 0 ? docs : visibleFallbacks);
      } catch {
        setVideos(fallbackVideos.filter((v) => !isVideoHidden(v.$id!)));
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <section id="showreel" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block font-mono text-sm text-neon-purple">
              {'<Showreel />'}
            </span>
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Video{' '}
              <span className="text-gradient-purple">Portfolio</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Kurgu, renk grading ve motion graphics alanındaki en iyi çalışmalarım.
            </p>
          </div>
        </SectionWrapper>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-video animate-pulse rounded-2xl bg-dark-card"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video, index) => (
              <VideoCard key={video.$id} video={video} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
