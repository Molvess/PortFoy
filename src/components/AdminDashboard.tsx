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
  getLocalVideos,
  addLocalVideo,
  updateLocalVideo,
  deleteLocalVideo,
  getLocalProjects,
  addLocalProject,
  updateLocalProject,
  deleteLocalProject,
  getHiddenIds,
  addHiddenId,
  resetHiddenIds,
  isFallbackId,
  isLocalId,
  isAppwriteId,
} from '../lib/localStore';
import {
  HiPlus,
  HiTrash,
  HiPencil,
  HiVideoCamera,
  HiCode,
  HiLogout,
  HiRefresh,
  HiUpload,
  HiExclamation,
  HiX,
} from 'react-icons/hi';

type Tab = 'videos' | 'projects';

// ── Fallback / Örnek veriler ──
const fallbackVideos: Video[] = [
  { $id: 'fb-v1', title: 'Cinematic Color Grading Breakdown', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'portfolio' },
  { $id: 'fb-v2', title: 'After Effects Motion Graphics Reel', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'portfolio' },
  { $id: 'fb-v3', title: 'Corporate Video Edit — Brand Film', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'portfolio' },
  { $id: 'fb-v4', title: 'Music Video Edit — Neon Vibes', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'portfolio' },
  { $id: 'fb-c1', title: 'Nasıl Video Editör Oldum? — Hikayem', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'content_creator' },
  { $id: 'fb-c2', title: 'Premiere Pro vs DaVinci Resolve — Hangisi?', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'content_creator' },
  { $id: 'fb-c3', title: 'Freelance Video Editor Olarak Kazanç', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'content_creator' },
];

const fallbackProjects: Project[] = [
  { $id: 'fb-p1', name: 'Molvess Portfolio', description: 'React + TypeScript + Tailwind CSS ile oluşturulmuş kişisel portföy sitesi.', githubUrl: 'https://github.com/Bekirx00/molvess-portfolio', demoUrl: 'https://molvess.me', tags: ['React', 'TypeScript', 'Tailwind CSS', 'Appwrite'] },
  { $id: 'fb-p2', name: 'Video Dashboard', description: 'Video içerik yönetim paneli. İçerik üreticileri için analitik ve yönetim araçları.', githubUrl: 'https://github.com/Bekirx00/video-dashboard', tags: ['Next.js', 'PostgreSQL', 'Prisma'] },
  { $id: 'fb-p3', name: 'AI Color Grader', description: 'Yapay zeka destekli otomatik renk düzeltme aracı.', githubUrl: 'https://github.com/Bekirx00/ai-color-grader', tags: ['Python', 'OpenCV', 'TensorFlow'] },
  { $id: 'fb-p4', name: 'Discord Bot', description: 'Çok amaçlı Discord botu — müzik çalma, moderasyon, komut yönetimi.', githubUrl: 'https://github.com/Bekirx00/discord-bot', tags: ['Node.js', 'Discord.js', 'MongoDB'] },
  { $id: 'fb-p5', name: 'Motion Template Engine', description: 'After Effects şablonları için otomatik render pipeline.', githubUrl: 'https://github.com/Bekirx00/motion-template', demoUrl: 'https://demo.molvess.me', tags: ['Node.js', 'FFmpeg', 'Docker'] },
  { $id: 'fb-p6', name: 'Chat Application', description: 'Gerçek zamanlı sohbet uygulaması. WebSocket ile anlık mesajlaşma.', githubUrl: 'https://github.com/Bekirx00/chat-app', tags: ['React', 'Socket.io', 'Express'] },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [appwriteOk, setAppwriteOk] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>(getHiddenIds());

  // ── Form state ──
  const [vTitle, setVTitle] = useState('');
  const [vUrl, setVUrl] = useState('');
  const [vCategory, setVCategory] = useState<Video['category']>('portfolio');
  const [vThumb, setVThumb] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pGithub, setPGithub] = useState('');
  const [pDemo, setPDemo] = useState('');
  const [pTags, setPTags] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // ── Fetch: Appwrite + localStorage + fallback ──
  const fetchData = async () => {
    setLoading(true);
    const hidden = getHiddenIds();
    setHiddenIds(hidden);

    const localVids = getLocalVideos();
    const localProjs = getLocalProjects();
    const visibleFallbackV = fallbackVideos.filter((v) => !hidden.includes(v.$id!));
    const visibleFallbackP = fallbackProjects.filter((p) => !hidden.includes(p.$id!));

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

      const dbVideos: Video[] = vRes.documents.map((d) => ({
        $id: d.$id,
        title: d.title as string,
        embedUrl: d.embedUrl as string,
        category: d.category as Video['category'],
        thumbnailUrl: d.thumbnailUrl as string | undefined,
      }));
      const dbProjects: Project[] = pRes.documents.map((d) => ({
        $id: d.$id,
        name: d.name as string,
        description: d.description as string,
        githubUrl: d.githubUrl as string,
        demoUrl: d.demoUrl as string | undefined,
        tags: (d.tags as string[]) || [],
      }));

      setVideos([...dbVideos, ...localVids, ...visibleFallbackV]);
      setProjects([...dbProjects, ...localProjs, ...visibleFallbackP]);
      setAppwriteOk(true);
    } catch {
      // Appwrite yok — localStorage + fallback
      setVideos([...localVids, ...visibleFallbackV]);
      setProjects([...localProjs, ...visibleFallbackP]);
      setAppwriteOk(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Flash message ──
  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  // ── Video CRUD ──
  const clearVideoForm = () => {
    setVTitle('');
    setVUrl('');
    setVCategory('portfolio');
    setVThumb('');
    setEditingVideoId(null);
  };

  const handleVideoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = {
      title: vTitle,
      embedUrl: vUrl,
      category: vCategory,
      ...(vThumb ? { thumbnailUrl: vThumb } : {}),
    };

    try {
      if (editingVideoId) {
        // ── EDIT ──
        if (isLocalId(editingVideoId)) {
          updateLocalVideo(editingVideoId, data);
          flash('Video güncellendi!');
        } else if (isAppwriteId(editingVideoId)) {
          await databases.updateDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, editingVideoId, data);
          flash('Video güncellendi (Appwrite)!');
        }
      } else {
        // ── ADD ──
        if (appwriteOk) {
          try {
            await databases.createDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, ID.unique(), data);
            flash('Video eklendi (Appwrite)!');
          } catch {
            addLocalVideo(data);
            flash('Appwrite\'a yazılamadı — video yerel olarak kaydedildi!');
          }
        } else {
          addLocalVideo(data);
          flash('Video yerel olarak kaydedildi!');
        }
      }
      clearVideoForm();
      fetchData();
    } catch (err: unknown) {
      flash('Hata: ' + ((err as Error)?.message || 'İşlem başarısız'));
    } finally {
      setSubmitting(false);
    }
  };

  const startEditVideo = (v: Video) => {
    if (isFallbackId(v.$id)) return;
    setTab('videos');
    setEditingVideoId(v.$id!);
    setVTitle(v.title);
    setVUrl(v.embedUrl);
    setVCategory(v.category);
    setVThumb(v.thumbnailUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Project CRUD ──
  const clearProjectForm = () => {
    setPName('');
    setPDesc('');
    setPGithub('');
    setPDemo('');
    setPTags('');
    setEditingProjectId(null);
  };

  const handleProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const tags = pTags.split(',').map((t) => t.trim()).filter(Boolean);
    const data = {
      name: pName,
      description: pDesc,
      githubUrl: pGithub,
      ...(pDemo ? { demoUrl: pDemo } : {}),
      tags,
    };

    try {
      if (editingProjectId) {
        if (isLocalId(editingProjectId)) {
          updateLocalProject(editingProjectId, data);
          flash('Proje güncellendi!');
        } else if (isAppwriteId(editingProjectId)) {
          await databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, editingProjectId, data);
          flash('Proje güncellendi (Appwrite)!');
        }
      } else {
        if (appwriteOk) {
          try {
            await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(), data);
            flash('Proje eklendi (Appwrite)!');
          } catch {
            addLocalProject(data);
            flash('Appwrite\'a yazılamadı — proje yerel olarak kaydedildi!');
          }
        } else {
          addLocalProject(data);
          flash('Proje yerel olarak kaydedildi!');
        }
      }
      clearProjectForm();
      fetchData();
    } catch (err: unknown) {
      flash('Hata: ' + ((err as Error)?.message || 'İşlem başarısız'));
    } finally {
      setSubmitting(false);
    }
  };

  const startEditProject = (p: Project) => {
    if (isFallbackId(p.$id)) return;
    setTab('projects');
    setEditingProjectId(p.$id!);
    setPName(p.name);
    setPDesc(p.description);
    setPGithub(p.githubUrl);
    setPDemo(p.demoUrl || '');
    setPTags(p.tags.join(', '));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Delete ──
  const handleDeleteVideo = async (id: string) => {
    if (isFallbackId(id)) {
      if (!confirm('Bu örnek videoyu gizlemek istediğinize emin misiniz?')) return;
      addHiddenId(id);
      setHiddenIds(getHiddenIds());
      setVideos((prev) => prev.filter((v) => v.$id !== id));
      flash('Örnek video gizlendi.');
      return;
    }
    if (!confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;
    try {
      if (isLocalId(id)) {
        deleteLocalVideo(id);
        flash('Video silindi.');
      } else {
        await databases.deleteDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, id);
        flash('Video silindi (Appwrite).');
      }
      if (editingVideoId === id) clearVideoForm();
      fetchData();
    } catch (err: unknown) {
      flash('Hata: ' + ((err as Error)?.message || 'Silinemedi'));
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (isFallbackId(id)) {
      if (!confirm('Bu örnek projeyi gizlemek istediğinize emin misiniz?')) return;
      addHiddenId(id);
      setHiddenIds(getHiddenIds());
      setProjects((prev) => prev.filter((p) => p.$id !== id));
      flash('Örnek proje gizlendi.');
      return;
    }
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    try {
      if (isLocalId(id)) {
        deleteLocalProject(id);
        flash('Proje silindi.');
      } else {
        await databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id);
        flash('Proje silindi (Appwrite).');
      }
      if (editingProjectId === id) clearProjectForm();
      fetchData();
    } catch (err: unknown) {
      flash('Hata: ' + ((err as Error)?.message || 'Silinemedi'));
    }
  };

  // ── Push to Appwrite ──
  const handlePushVideo = async (video: Video) => {
    setSubmitting(true);
    try {
      await databases.createDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, ID.unique(), {
        title: video.title,
        embedUrl: video.embedUrl,
        category: video.category,
        ...(video.thumbnailUrl ? { thumbnailUrl: video.thumbnailUrl } : {}),
      });
      // Yerel kaydı sil (artık Appwrite'ta)
      if (isLocalId(video.$id)) deleteLocalVideo(video.$id!);
      flash(`"${video.title}" Appwrite'a aktarıldı!`);
      fetchData();
    } catch (err: unknown) {
      flash('Hata: ' + ((err as Error)?.message || 'Aktarılamadı'));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePushProject = async (project: Project) => {
    setSubmitting(true);
    try {
      await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(), {
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        ...(project.demoUrl ? { demoUrl: project.demoUrl } : {}),
        tags: project.tags,
      });
      if (isLocalId(project.$id)) deleteLocalProject(project.$id!);
      flash(`"${project.name}" Appwrite'a aktarıldı!`);
      fetchData();
    } catch (err: unknown) {
      flash('Hata: ' + ((err as Error)?.message || 'Aktarılamadı'));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Restore hidden ──
  const handleRestoreAll = () => {
    resetHiddenIds();
    flash('Tüm gizlenen örnekler geri getirildi!');
    fetchData();
  };

  // ── Logout ──
  const handleLogout = async () => {
    try { await account.deleteSession('current'); } catch { /* */ }
    window.location.reload();
  };

  // ── Helpers ──
  const countBy = (arr: { $id?: string }[], fn: (id?: string) => boolean) =>
    arr.filter((x) => fn(x.$id)).length;

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-dark-secondary px-4 py-3 text-sm text-white placeholder-text-muted outline-none transition-colors focus:border-neon-purple/50';

  const Badge = ({ id }: { id?: string }) => {
    if (isFallbackId(id))
      return <span className="shrink-0 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-400">Örnek</span>;
    if (isLocalId(id))
      return <span className="shrink-0 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-400">Yerel</span>;
    return <span className="shrink-0 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-400">Appwrite</span>;
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* ── Header ── */}
      <header className="border-b border-white/5 bg-dark-secondary">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden">
              <img src="/MlogoSiyah.png" alt="Molvess" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-text-muted">Molvess İçerik Yönetimi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-text-muted transition-colors hover:text-white">← Siteye Dön</a>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-all hover:bg-red-500/20">
              <HiLogout className="h-4 w-4" /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Status */}
        {!appwriteOk && !loading && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
            <HiExclamation className="h-5 w-5 shrink-0" />
            <span>Appwrite bağlantısı yok — içerikler <strong>yerel olarak</strong> kaydediliyor ve sitede görünüyor.</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button onClick={() => { setTab('videos'); clearVideoForm(); }} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all ${tab === 'videos' ? 'bg-neon-purple/20 text-neon-purple neon-border-purple' : 'bg-dark-card text-text-muted hover:text-white'}`}>
            <HiVideoCamera className="h-4 w-4" /> Videolar ({videos.length})
          </button>
          <button onClick={() => { setTab('projects'); clearProjectForm(); }} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all ${tab === 'projects' ? 'bg-neon-blue/20 text-neon-blue neon-border-blue' : 'bg-dark-card text-text-muted hover:text-white'}`}>
            <HiCode className="h-4 w-4" /> Projeler ({projects.length})
          </button>
          {hiddenIds.length > 0 && (
            <button onClick={handleRestoreAll} className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-medium text-yellow-400 transition-all hover:bg-yellow-500/20">
              Gizlenenleri Geri Getir ({hiddenIds.length})
            </button>
          )}
          <button onClick={fetchData} className="ml-auto flex items-center gap-2 rounded-xl bg-dark-card px-4 py-3 text-sm text-text-muted transition-all hover:text-white">
            <HiRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Yenile
          </button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-6 rounded-xl border px-4 py-3 text-sm ${message.startsWith('Hata') ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-green-500/20 bg-green-500/10 text-green-400'}`}>
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ═══ FORM ═══ */}
          <div className="lg:col-span-1">
            {tab === 'videos' ? (
              <form onSubmit={handleVideoSubmit} className="rounded-2xl border border-white/10 bg-dark-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
                    {editingVideoId ? (<><HiPencil className="h-5 w-5 text-cyan-400" /> Video Düzenle</>) : (<><HiPlus className="h-5 w-5 text-neon-purple" /> Video Ekle</>)}
                  </h2>
                  {editingVideoId && (
                    <button type="button" onClick={clearVideoForm} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-text-muted transition-all hover:text-white" title="İptal">
                      <HiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Başlık *</label>
                    <input type="text" value={vTitle} onChange={(e) => setVTitle(e.target.value)} placeholder="Video başlığı" required className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">YouTube/Vimeo URL *</label>
                    <input type="url" value={vUrl} onChange={(e) => setVUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." required className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Kategori *</label>
                    <select value={vCategory} onChange={(e) => setVCategory(e.target.value as Video['category'])} className={inputClass}>
                      <option value="portfolio">Portfolio (Showreel)</option>
                      <option value="content_creator">İçerik Üretici</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Thumbnail URL (opsiyonel)</label>
                    <input type="url" value={vThumb} onChange={(e) => setVThumb(e.target.value)} placeholder="https://..." className={inputClass} />
                  </div>
                  <button type="submit" disabled={submitting} className={`w-full rounded-xl py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 ${editingVideoId ? 'bg-gradient-to-r from-cyan-500 to-neon-blue' : 'bg-gradient-to-r from-neon-purple to-neon-blue'}`}>
                    {submitting ? 'Kaydediliyor...' : editingVideoId ? 'Güncelle' : 'Video Ekle'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleProjectSubmit} className="rounded-2xl border border-white/10 bg-dark-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
                    {editingProjectId ? (<><HiPencil className="h-5 w-5 text-cyan-400" /> Proje Düzenle</>) : (<><HiPlus className="h-5 w-5 text-neon-blue" /> Proje Ekle</>)}
                  </h2>
                  {editingProjectId && (
                    <button type="button" onClick={clearProjectForm} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-text-muted transition-all hover:text-white" title="İptal">
                      <HiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Proje Adı *</label>
                    <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Proje adı" required className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Açıklama *</label>
                    <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Proje açıklaması..." required rows={3} className={inputClass + ' resize-none'} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">GitHub URL *</label>
                    <input type="url" value={pGithub} onChange={(e) => setPGithub(e.target.value)} placeholder="https://github.com/..." required className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Demo URL (opsiyonel)</label>
                    <input type="url" value={pDemo} onChange={(e) => setPDemo(e.target.value)} placeholder="https://..." className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">Teknolojiler (virgülle ayır) *</label>
                    <input type="text" value={pTags} onChange={(e) => setPTags(e.target.value)} placeholder="React, TypeScript, Node.js" required className={inputClass} />
                  </div>
                  <button type="submit" disabled={submitting} className={`w-full rounded-xl py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 ${editingProjectId ? 'bg-gradient-to-r from-cyan-500 to-neon-blue' : 'bg-gradient-to-r from-neon-blue to-neon-purple'}`}>
                    {submitting ? 'Kaydediliyor...' : editingProjectId ? 'Güncelle' : 'Proje Ekle'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ═══ LIST ═══ */}
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
                  <span className="ml-2 text-text-muted font-normal normal-case">
                    ({countBy(videos, isAppwriteId)} DB · {countBy(videos, isLocalId)} Yerel · {countBy(videos, isFallbackId)} Örnek)
                  </span>
                </h3>
                {videos.length === 0 ? (
                  <p className="py-12 text-center text-text-muted">Henüz video yok. Yukarıdaki formdan ekle!</p>
                ) : (
                  videos.map((v) => (
                    <motion.div
                      key={v.$id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-white/10 ${
                        editingVideoId === v.$id
                          ? 'border-cyan-500/30 bg-cyan-500/5 ring-1 ring-cyan-500/20'
                          : isFallbackId(v.$id)
                            ? 'border-yellow-500/10 bg-dark-card/40'
                            : isLocalId(v.$id)
                              ? 'border-cyan-500/10 bg-dark-card/60'
                              : 'border-white/5 bg-dark-card'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-semibold text-white">{v.title}</h4>
                          <Badge id={v.$id} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-text-muted">{v.embedUrl}</p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${v.category === 'portfolio' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-blue/20 text-neon-blue'}`}>
                          {v.category === 'portfolio' ? 'Portfolio' : 'İçerik'}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {(isFallbackId(v.$id) || isLocalId(v.$id)) && appwriteOk && (
                          <button onClick={() => handlePushVideo(v)} disabled={submitting} className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple transition-all hover:bg-neon-purple/20 disabled:opacity-50" title="Appwrite'a Aktar">
                            <HiUpload className="h-4 w-4" />
                          </button>
                        )}
                        {!isFallbackId(v.$id) && (
                          <button onClick={() => startEditVideo(v)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-all hover:bg-cyan-500/20" title="Düzenle">
                            <HiPencil className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteVideo(v.$id!)} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${isFallbackId(v.$id) ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`} title={isFallbackId(v.$id) ? 'Gizle' : 'Sil'}>
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
                  <span className="ml-2 text-text-muted font-normal normal-case">
                    ({countBy(projects, isAppwriteId)} DB · {countBy(projects, isLocalId)} Yerel · {countBy(projects, isFallbackId)} Örnek)
                  </span>
                </h3>
                {projects.length === 0 ? (
                  <p className="py-12 text-center text-text-muted">Henüz proje yok. Yukarıdaki formdan ekle!</p>
                ) : (
                  projects.map((p) => (
                    <motion.div
                      key={p.$id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:border-white/10 ${
                        editingProjectId === p.$id
                          ? 'border-cyan-500/30 bg-cyan-500/5 ring-1 ring-cyan-500/20'
                          : isFallbackId(p.$id)
                            ? 'border-yellow-500/10 bg-dark-card/40'
                            : isLocalId(p.$id)
                              ? 'border-cyan-500/10 bg-dark-card/60'
                              : 'border-white/5 bg-dark-card'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-semibold text-white">{p.name}</h4>
                          <Badge id={p.$id} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-text-muted">{p.description}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {p.tags.map((t) => (
                            <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-text-muted">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {(isFallbackId(p.$id) || isLocalId(p.$id)) && appwriteOk && (
                          <button onClick={() => handlePushProject(p)} disabled={submitting} className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-blue/10 text-neon-blue transition-all hover:bg-neon-blue/20 disabled:opacity-50" title="Appwrite'a Aktar">
                            <HiUpload className="h-4 w-4" />
                          </button>
                        )}
                        {!isFallbackId(p.$id) && (
                          <button onClick={() => startEditProject(p)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition-all hover:bg-cyan-500/20" title="Düzenle">
                            <HiPencil className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleDeleteProject(p.$id!)} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${isFallbackId(p.$id) ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`} title={isFallbackId(p.$id) ? 'Gizle' : 'Sil'}>
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
