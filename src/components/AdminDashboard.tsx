import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  databases,
  DATABASE_ID,
  VIDEOS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  ID,
  Query,
  account,
} from '../lib/appwrite';
import type { Video, Project } from '../types';
import {
  getHiddenIds,
  addHiddenId,
  resetHiddenIds,
} from '../lib/hiddenFallbacks';
import {
  HiPlus,
  HiTrash,
  HiVideoCamera,
  HiCode,
  HiLogout,
  HiRefresh,
  HiUpload,
  HiExclamation,
} from 'react-icons/hi';

type Tab = 'videos' | 'projects';

// ── Fallback / Örnek veriler ──
const fallbackVideos: Video[] = [
  {
    $id: 'fb-v1',
    title: 'Cinematic Color Grading Breakdown',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: 'fb-v2',
    title: 'After Effects Motion Graphics Reel',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: 'fb-v3',
    title: 'Corporate Video Edit — Brand Film',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: 'fb-v4',
    title: 'Music Video Edit — Neon Vibes',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'portfolio',
  },
  {
    $id: 'fb-c1',
    title: 'Nasıl Video Editör Oldum? — Hikayem',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'content_creator',
  },
  {
    $id: 'fb-c2',
    title: 'Premiere Pro vs DaVinci Resolve — Hangisi?',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'content_creator',
  },
  {
    $id: 'fb-c3',
    title: 'Freelance Video Editor Olarak Kazanç',
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'content_creator',
  },
];

const fallbackProjects: Project[] = [
  {
    $id: 'fb-p1',
    name: 'Molvess Portfolio',
    description: 'React + TypeScript + Tailwind CSS ile oluşturulmuş kişisel portföy sitesi.',
    githubUrl: 'https://github.com/Bekirx00/molvess-portfolio',
    demoUrl: 'https://molvess.me',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Appwrite'],
  },
  {
    $id: 'fb-p2',
    name: 'Video Dashboard',
    description: 'Video içerik yönetim paneli. İçerik üreticileri için analitik ve yönetim araçları.',
    githubUrl: 'https://github.com/Bekirx00/video-dashboard',
    tags: ['Next.js', 'PostgreSQL', 'Prisma'],
  },
  {
    $id: 'fb-p3',
    name: 'AI Color Grader',
    description: 'Yapay zeka destekli otomatik renk düzeltme aracı.',
    githubUrl: 'https://github.com/Bekirx00/ai-color-grader',
    tags: ['Python', 'OpenCV', 'TensorFlow'],
  },
  {
    $id: 'fb-p4',
    name: 'Discord Bot',
    description: 'Çok amaçlı Discord botu — müzik çalma, moderasyon, komut yönetimi.',
    githubUrl: 'https://github.com/Bekirx00/discord-bot',
    tags: ['Node.js', 'Discord.js', 'MongoDB'],
  },
  {
    $id: 'fb-p5',
    name: 'Motion Template Engine',
    description: 'After Effects şablonları için otomatik render pipeline.',
    githubUrl: 'https://github.com/Bekirx00/motion-template',
    demoUrl: 'https://demo.molvess.me',
    tags: ['Node.js', 'FFmpeg', 'Docker'],
  },
  {
    $id: 'fb-p6',
    name: 'Chat Application',
    description: 'Gerçek zamanlı sohbet uygulaması. WebSocket ile anlık mesajlaşma.',
    githubUrl: 'https://github.com/Bekirx00/chat-app',
    tags: ['React', 'Socket.io', 'Express'],
  },
];

const isFallbackId = (id?: string) => id?.startsWith('fb-');

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [appwriteOk, setAppwriteOk] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>(getHiddenIds());

  // Video form
  const [vTitle, setVTitle] = useState('');
  const [vUrl, setVUrl] = useState('');
  const [vCategory, setVCategory] = useState<Video['category']>('portfolio');
  const [vThumb, setVThumb] = useState('');

  // Project form
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pGithub, setPGithub] = useState('');
  const [pDemo, setPDemo] = useState('');
  const [pTags, setPTags] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, pRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, VIDEOS_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ]),
        databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ]),
      ]);

      const dbVideos = vRes.documents.map((d) => ({
        $id: d.$id,
        title: d.title as string,
        embedUrl: d.embedUrl as string,
        category: d.category as Video['category'],
        thumbnailUrl: d.thumbnailUrl as string | undefined,
      }));

      const dbProjects = pRes.documents.map((d) => ({
        $id: d.$id,
        name: d.name as string,
        description: d.description as string,
        githubUrl: d.githubUrl as string,
        demoUrl: d.demoUrl as string | undefined,
        tags: (d.tags as string[]) || [],
      }));

      // Appwrite verileri + gizlenmemiş fallback örnekleri birleştir
      const hidden = getHiddenIds();
      setHiddenIds(hidden);
      setVideos([...dbVideos, ...fallbackVideos.filter((v) => !hidden.includes(v.$id!))]);
      setProjects([...dbProjects, ...fallbackProjects.filter((p) => !hidden.includes(p.$id!))]);
      setAppwriteOk(true);
    } catch (err) {
      console.error('Appwrite bağlantısı başarısız:', err);
      // Sadece gizlenmemiş fallback verileri göster
      const hidden = getHiddenIds();
      setHiddenIds(hidden);
      setVideos(fallbackVideos.filter((v) => !hidden.includes(v.$id!)));
      setProjects(fallbackProjects.filter((p) => !hidden.includes(p.$id!)));
      setAppwriteOk(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Add video ──
  const handleAddVideo = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await databases.createDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, ID.unique(), {
        title: vTitle,
        embedUrl: vUrl,
        category: vCategory,
        ...(vThumb ? { thumbnailUrl: vThumb } : {}),
      });
      setMessage('Video başarıyla eklendi!');
      setVTitle('');
      setVUrl('');
      setVThumb('');
      fetchData();
    } catch (err: any) {
      setMessage('Hata: ' + (err?.message || 'Video eklenemedi'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Add project ──
  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(), {
        name: pName,
        description: pDesc,
        githubUrl: pGithub,
        ...(pDemo ? { demoUrl: pDemo } : {}),
        tags: pTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setMessage('Proje başarıyla eklendi!');
      setPName('');
      setPDesc('');
      setPGithub('');
      setPDemo('');
      setPTags('');
      fetchData();
    } catch (err: any) {
      setMessage('Hata: ' + (err?.message || 'Proje eklenemedi'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Örnek videoyu Appwrite'a aktar ──
  const handlePushVideo = async (video: Video) => {
    setSubmitting(true);
    setMessage('');
    try {
      await databases.createDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, ID.unique(), {
        title: video.title,
        embedUrl: video.embedUrl,
        category: video.category,
        ...(video.thumbnailUrl ? { thumbnailUrl: video.thumbnailUrl } : {}),
      });
      setMessage(`"${video.title}" Appwrite'a aktarıldı!`);
      fetchData();
    } catch (err: any) {
      setMessage('Hata: ' + (err?.message || 'Aktarılamadı'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Örnek projeyi Appwrite'a aktar ──
  const handlePushProject = async (project: Project) => {
    setSubmitting(true);
    setMessage('');
    try {
      await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(), {
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        ...(project.demoUrl ? { demoUrl: project.demoUrl } : {}),
        tags: project.tags,
      });
      setMessage(`"${project.name}" Appwrite'a aktarıldı!`);
      fetchData();
    } catch (err: any) {
      setMessage('Hata: ' + (err?.message || 'Aktarılamadı'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Tüm örnekleri toplu aktar ──
  const handlePushAllVideos = async () => {
    if (!confirm('Tüm örnek videolar Appwrite\'a aktarılsın mı?')) return;
    setSubmitting(true);
    setMessage('');
    let count = 0;
    for (const v of fallbackVideos) {
      try {
        await databases.createDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, ID.unique(), {
          title: v.title,
          embedUrl: v.embedUrl,
          category: v.category,
        });
        count++;
      } catch { /* skip duplicates */ }
    }
    setMessage(`${count} video Appwrite'a aktarıldı!`);
    setSubmitting(false);
    fetchData();
  };

  const handlePushAllProjects = async () => {
    if (!confirm('Tüm örnek projeler Appwrite\'a aktarılsın mı?')) return;
    setSubmitting(true);
    setMessage('');
    let count = 0;
    for (const p of fallbackProjects) {
      try {
        await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(), {
          name: p.name,
          description: p.description,
          githubUrl: p.githubUrl,
          ...(p.demoUrl ? { demoUrl: p.demoUrl } : {}),
          tags: p.tags,
        });
        count++;
      } catch { /* skip */ }
    }
    setMessage(`${count} proje Appwrite'a aktarıldı!`);
    setSubmitting(false);
    fetchData();
  };

  // ── Silinen örnekleri geri getir ──
  const handleRestoreAll = () => {
    resetHiddenIds();
    setMessage('Tüm silinen örnekler geri getirildi!');
    fetchData();
  };

  // ── Delete ──
  const handleDeleteVideo = async (id: string) => {
    if (isFallbackId(id)) {
      if (!confirm('Bu örnek videoyu gizlemek istediğinize emin misiniz?')) return;
      addHiddenId(id);
      setHiddenIds(getHiddenIds());
      setVideos((prev) => prev.filter((v) => v.$id !== id));
      setMessage('Örnek video gizlendi. (Geri getirmek için "Silinenleri Geri Getir" butonunu kullan)');
      return;
    }
    if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;
    try {
      await databases.deleteDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, id);
      setMessage('Video silindi.');
      fetchData();
    } catch (err: any) {
      setMessage('Hata: ' + (err?.message || 'Silinemedi'));
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (isFallbackId(id)) {
      if (!confirm('Bu örnek projeyi gizlemek istediğinize emin misiniz?')) return;
      addHiddenId(id);
      setHiddenIds(getHiddenIds());
      setProjects((prev) => prev.filter((p) => p.$id !== id));
      setMessage('Örnek proje gizlendi. (Geri getirmek için "Silinenleri Geri Getir" butonunu kullan)');
      return;
    }
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    try {
      await databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
      setMessage('Proje silindi.');
      fetchData();
    } catch (err: any) {
      setMessage('Hata: ' + (err?.message || 'Silinemedi'));
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-dark-secondary px-4 py-3 text-sm text-white placeholder-text-muted outline-none transition-colors focus:border-neon-purple/50';

  const appwriteCount = (arr: { $id?: string }[]) => arr.filter((x) => !isFallbackId(x.$id)).length;
  const fallbackCount = (arr: { $id?: string }[]) => arr.filter((x) => isFallbackId(x.$id)).length;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/5 bg-dark-secondary">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue overflow-hidden">
              <img src="/MlogoSiyah.png" alt="Molvess" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-text-muted">Molvess İçerik Yönetimi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-text-muted transition-colors hover:text-white"
            >
              ← Siteye Dön
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-all hover:bg-red-500/20"
            >
              <HiLogout className="h-4 w-4" />
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Appwrite durum uyarısı */}
        {!appwriteOk && !loading && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
            <HiExclamation className="h-5 w-5 shrink-0" />
            <span>
              Appwrite bağlantısı kurulamadı. Aşağıda sadece örnek (fallback) veriler gösteriliyor.
              Platform ayarlarını kontrol et.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setTab('videos')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all ${
              tab === 'videos'
                ? 'bg-neon-purple/20 text-neon-purple neon-border-purple'
                : 'bg-dark-card text-text-muted hover:text-white'
            }`}
          >
            <HiVideoCamera className="h-4 w-4" />
            Videolar ({appwriteCount(videos)} DB + {fallbackCount(videos)} Örnek)
          </button>
          <button
            onClick={() => setTab('projects')}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all ${
              tab === 'projects'
                ? 'bg-neon-blue/20 text-neon-blue neon-border-blue'
                : 'bg-dark-card text-text-muted hover:text-white'
            }`}
          >
            <HiCode className="h-4 w-4" />
            Projeler ({appwriteCount(projects)} DB + {fallbackCount(projects)} Örnek)
          </button>
          {hiddenIds.length > 0 && (
            <button
              onClick={handleRestoreAll}
              className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-400 transition-all hover:bg-yellow-500/20"
            >
              Silinenleri Geri Getir ({hiddenIds.length})
            </button>
          )}
          <button
            onClick={fetchData}
            className="ml-auto flex items-center gap-2 rounded-xl bg-dark-card px-4 py-3 text-sm text-text-muted transition-all hover:text-white"
          >
            <HiRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                message.startsWith('Hata')
                  ? 'border-red-500/20 bg-red-500/10 text-red-400'
                  : 'border-green-500/20 bg-green-500/10 text-green-400'
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            {tab === 'videos' ? (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddVideo}
                  className="rounded-2xl border border-white/10 bg-dark-card p-6"
                >
                  <h2 className="mb-6 flex items-center gap-2 font-heading text-lg font-bold text-white">
                    <HiPlus className="h-5 w-5 text-neon-purple" />
                    Video Ekle
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Başlık *
                      </label>
                      <input
                        type="text"
                        value={vTitle}
                        onChange={(e) => setVTitle(e.target.value)}
                        placeholder="Video başlığı"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        YouTube/Vimeo URL *
                      </label>
                      <input
                        type="url"
                        value={vUrl}
                        onChange={(e) => setVUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Kategori *
                      </label>
                      <select
                        value={vCategory}
                        onChange={(e) => setVCategory(e.target.value as Video['category'])}
                        className={inputClass}
                      >
                        <option value="portfolio">Portfolio (Showreel)</option>
                        <option value="content_creator">İçerik Üretici</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Thumbnail URL (opsiyonel)
                      </label>
                      <input
                        type="url"
                        value={vThumb}
                        onChange={(e) => setVThumb(e.target.value)}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? 'Ekleniyor...' : 'Video Ekle'}
                    </button>
                  </div>
                </form>

                {/* Toplu Aktar butonu */}
                {appwriteOk && fallbackCount(videos) > 0 && (
                  <button
                    onClick={handlePushAllVideos}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 py-3 text-sm font-medium text-neon-purple transition-all hover:bg-neon-purple/20 disabled:opacity-50"
                  >
                    <HiUpload className="h-4 w-4" />
                    Tüm Örnek Videoları Appwrite'a Aktar
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddProject}
                  className="rounded-2xl border border-white/10 bg-dark-card p-6"
                >
                  <h2 className="mb-6 flex items-center gap-2 font-heading text-lg font-bold text-white">
                    <HiPlus className="h-5 w-5 text-neon-blue" />
                    Proje Ekle
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Proje Adı *
                      </label>
                      <input
                        type="text"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        placeholder="Proje adı"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Açıklama *
                      </label>
                      <textarea
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        placeholder="Proje açıklaması..."
                        required
                        rows={3}
                        className={inputClass + ' resize-none'}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        GitHub URL *
                      </label>
                      <input
                        type="url"
                        value={pGithub}
                        onChange={(e) => setPGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Demo URL (opsiyonel)
                      </label>
                      <input
                        type="url"
                        value={pDemo}
                        onChange={(e) => setPDemo(e.target.value)}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-secondary">
                        Teknolojiler (virgülle ayır) *
                      </label>
                      <input
                        type="text"
                        value={pTags}
                        onChange={(e) => setPTags(e.target.value)}
                        placeholder="React, TypeScript, Node.js"
                        required
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? 'Ekleniyor...' : 'Proje Ekle'}
                    </button>
                  </div>
                </form>

                {/* Toplu Aktar butonu */}
                {appwriteOk && fallbackCount(projects) > 0 && (
                  <button
                    onClick={handlePushAllProjects}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-neon-blue/30 bg-neon-blue/10 py-3 text-sm font-medium text-neon-blue transition-all hover:bg-neon-blue/20 disabled:opacity-50"
                  >
                    <HiUpload className="h-4 w-4" />
                    Tüm Örnek Projeleri Appwrite'a Aktar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="h-8 w-8 animate-spin text-neon-purple" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : tab === 'videos' ? (
              <div className="space-y-3">
                <h3 className="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  Tüm Videolar
                </h3>
                {videos.length === 0 ? (
                  <p className="py-12 text-center text-text-muted">Henüz video yok.</p>
                ) : (
                  videos.map((v) => (
                    <motion.div
                      key={v.$id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-white/10 ${
                        isFallbackId(v.$id)
                          ? 'border-yellow-500/10 bg-dark-card/40'
                          : 'border-white/5 bg-dark-card'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-semibold text-white">
                            {v.title}
                          </h4>
                          {isFallbackId(v.$id) ? (
                            <span className="shrink-0 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                              Örnek
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-400">
                              Appwrite
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-text-muted">{v.embedUrl}</p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            v.category === 'portfolio'
                              ? 'bg-neon-purple/20 text-neon-purple'
                              : 'bg-neon-blue/20 text-neon-blue'
                          }`}
                        >
                          {v.category === 'portfolio' ? 'Portfolio' : 'İçerik'}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {isFallbackId(v.$id) && appwriteOk && (
                          <button
                            onClick={() => handlePushVideo(v)}
                            disabled={submitting}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple transition-all hover:bg-neon-purple/20 disabled:opacity-50"
                            title="Appwrite'a Aktar"
                          >
                            <HiUpload className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVideo(v.$id!)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                            isFallbackId(v.$id)
                              ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                          title={isFallbackId(v.$id) ? 'Örnek videoyu gizle' : 'Sil'}
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  Tüm Projeler
                </h3>
                {projects.length === 0 ? (
                  <p className="py-12 text-center text-text-muted">Henüz proje yok.</p>
                ) : (
                  projects.map((p) => (
                    <motion.div
                      key={p.$id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-white/10 ${
                        isFallbackId(p.$id)
                          ? 'border-yellow-500/10 bg-dark-card/40'
                          : 'border-white/5 bg-dark-card'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-semibold text-white">
                            {p.name}
                          </h4>
                          {isFallbackId(p.$id) ? (
                            <span className="shrink-0 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                              Örnek
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-400">
                              Appwrite
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-text-muted">
                          {p.description}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-text-muted"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {isFallbackId(p.$id) && appwriteOk && (
                          <button
                            onClick={() => handlePushProject(p)}
                            disabled={submitting}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-blue/10 text-neon-blue transition-all hover:bg-neon-blue/20 disabled:opacity-50"
                            title="Appwrite'a Aktar"
                          >
                            <HiUpload className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProject(p.$id!)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                            isFallbackId(p.$id)
                              ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                          title={isFallbackId(p.$id) ? 'Örnek projeyi gizle' : 'Sil'}
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
