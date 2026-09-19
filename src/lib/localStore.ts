// ─── localStorage tabanlı yerel veritabanı ───
// Appwrite çalışmasa bile admin'den eklenen/düzenlenen veriler burada saklanır.
// Public bileşenler de buradan okur.

import type { Video, Project } from '../types';

const VIDEOS_KEY = 'molvess_local_videos';
const PROJECTS_KEY = 'molvess_local_projects';
const HIDDEN_KEY = 'molvess_hidden_fallbacks';

// ─── Helpers ───
const read = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};
const write = <T>(key: string, data: T[]) =>
  localStorage.setItem(key, JSON.stringify(data));

const uid = () => 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

// ─── Videos ───
export const getLocalVideos = (): Video[] => read<Video>(VIDEOS_KEY);

export const addLocalVideo = (v: Omit<Video, '$id'>): Video => {
  const list = getLocalVideos();
  const newItem: Video = { ...v, $id: uid() };
  list.unshift(newItem);
  write(VIDEOS_KEY, list);
  return newItem;
};

export const updateLocalVideo = (id: string, data: Partial<Video>): void => {
  const list = getLocalVideos().map((v) =>
    v.$id === id ? { ...v, ...data } : v
  );
  write(VIDEOS_KEY, list);
};

export const deleteLocalVideo = (id: string): void => {
  write(VIDEOS_KEY, getLocalVideos().filter((v) => v.$id !== id));
};

// ─── Projects ───
export const getLocalProjects = (): Project[] => read<Project>(PROJECTS_KEY);

export const addLocalProject = (p: Omit<Project, '$id'>): Project => {
  const list = getLocalProjects();
  const newItem: Project = { ...p, $id: uid() };
  list.unshift(newItem);
  write(PROJECTS_KEY, list);
  return newItem;
};

export const updateLocalProject = (id: string, data: Partial<Project>): void => {
  const list = getLocalProjects().map((p) =>
    p.$id === id ? { ...p, ...data } : p
  );
  write(PROJECTS_KEY, list);
};

export const deleteLocalProject = (id: string): void => {
  write(PROJECTS_KEY, getLocalProjects().filter((p) => p.$id !== id));
};

// ─── Hidden fallbacks ───
export const getHiddenIds = (): string[] => read<string>(HIDDEN_KEY);

export const addHiddenId = (id: string) => {
  const ids = getHiddenIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(ids));
  }
};

export const resetHiddenIds = () => localStorage.removeItem(HIDDEN_KEY);

// ─── ID helpers ───
export const isFallbackId = (id?: string): boolean => !!id?.startsWith('fb-');
export const isLocalId = (id?: string): boolean => !!id?.startsWith('local-');
export const isAppwriteId = (id?: string): boolean => !isFallbackId(id) && !isLocalId(id);
