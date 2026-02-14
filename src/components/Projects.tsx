import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import SectionWrapper from './SectionWrapper';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID, Query } from '../lib/appwrite';
import { getLocalProjects, getHiddenIds } from '../lib/localStore';
import type { Project } from '../types';

// Fallback demo data
const fallbackProjects: Project[] = [
  {
    $id: '1',
    name: 'Molvess Portfolio',
    description:
      'React + TypeScript + Tailwind CSS ile oluşturulmuş kişisel portföy sitesi. Framer Motion animasyonları ve Appwrite backend.',
    githubUrl: 'https://github.com/Bekirx00/molvess-portfolio',
    demoUrl: 'https://molvess.me',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Appwrite'],
  },
  {
    $id: '2',
    name: 'Video Dashboard',
    description:
      'Video içerik yönetim paneli. İçerik üreticileri için analitik ve yönetim araçları.',
    githubUrl: 'https://github.com/Bekirx00/video-dashboard',
    tags: ['Next.js', 'PostgreSQL', 'Prisma'],
  },
  {
    $id: '3',
    name: 'AI Color Grader',
    description:
      'Yapay zeka destekli otomatik renk düzeltme aracı. Video kareleri analiz edip profesyonel renk profilleri uygular.',
    githubUrl: 'https://github.com/Bekirx00/ai-color-grader',
    tags: ['Python', 'OpenCV', 'TensorFlow'],
  },
  {
    $id: '4',
    name: 'Discord Bot',
    description:
      'Çok amaçlı Discord botu — müzik çalma, moderasyon, komut yönetimi ve özel komutlar.',
    githubUrl: 'https://github.com/Bekirx00/discord-bot',
    tags: ['Node.js', 'Discord.js', 'MongoDB'],
  },
  {
    $id: '5',
    name: 'Motion Template Engine',
    description:
      'After Effects şablonları için otomatik render pipeline. JSON ile dinamik içerik üretimi.',
    githubUrl: 'https://github.com/Bekirx00/motion-template',
    demoUrl: 'https://demo.molvess.me',
    tags: ['Node.js', 'FFmpeg', 'Docker'],
  },
  {
    $id: '6',
    name: 'Chat Application',
    description: 'Gerçek zamanlı sohbet uygulaması. WebSocket ile anlık mesajlaşma ve dosya paylaşımı.',
    githubUrl: 'https://github.com/Bekirx00/chat-app',
    tags: ['React', 'Socket.io', 'Express'],
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const hidden = getHiddenIds();
      const localProjs = getLocalProjects();
      const visibleFallbacks = fallbackProjects.filter((p) => !hidden.includes('fb-p' + p.$id!));

      try {
        const res = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(12),
        ]);
        const docs = res.documents.map((d) => ({
          $id: d.$id,
          name: d.name as string,
          description: d.description as string,
          githubUrl: d.githubUrl as string,
          demoUrl: d.demoUrl as string | undefined,
          tags: (d.tags as string[]) || [],
        }));
        setProjects([...docs, ...localProjs, ...(docs.length === 0 ? visibleFallbacks : [])]);
      } catch {
        setProjects([...localProjs, ...visibleFallbacks]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
        <div className="absolute -right-64 top-1/3 h-[400px] w-[400px] rounded-full bg-neon-blue/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block font-mono text-sm text-neon-blue">
              {'<Projects />'}
            </span>
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Yazılım{' '}
              <span className="text-gradient-blue">Projeleri</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Full stack geliştirme, otomasyon araçları ve açık kaynak projelerim.
            </p>
          </div>
        </SectionWrapper>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-dark-card" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.$id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
