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
