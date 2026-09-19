export interface Video {
  $id?: string;
  title: string;
  embedUrl: string;
  category: 'portfolio' | 'content_creator';
  thumbnailUrl?: string;
}

export interface Project {
  $id?: string;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  tags: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export type ContentType =
  | 'software_project'
  | 'video_edit'
  | 'personal_video'
  | 'client_work'
  | 'other';

export type SourceType = 'github' | 'youtube' | 'mega' | 'manual' | 'upload';
export type PlaybackMode = 'embed' | 'external' | 'download';

export interface PortfolioContent {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  contentType: ContentType;
  sourceType: SourceType;
  sourceId?: string;
  sourceUrl?: string;
  embedUrl?: string;
  playbackMode?: PlaybackMode;
  thumbnailUrl?: string;
  thumbnailFileId?: string;
  repositoryUrl?: string;
  liveDemoUrl?: string;
  clientName?: string;
  categories: string[];
  tags: string[];
  technologies: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isVisible: boolean;
  displayOrder: number;
  publishedAt?: string;
  archivedAt?: string;
  durationSeconds?: number;
  showDownloadLink?: boolean;
  manualFields?: string[];
  sourceSnapshot?: string;
}

export type ContentInput = Omit<PortfolioContent, '$id' | '$createdAt' | '$updatedAt'>;

export interface YouTubeChannel {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  channelId: string;
  channelUrl?: string;
  ownerName?: string;
  channelType?: string;
  isActive: boolean;
}

export interface SocialLink {
  $id?: string;
  label: string;
  platform: string;
  url: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface NavigationLink {
  $id?: string;
  label: string;
  href: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface SiteSettings {
  $id?: string;
  brandName: string;
  contactTitle: string;
  contactDescription: string;
  contactEmail: string;
  footerText: string;
}
