import { motion } from 'framer-motion';
import { HiExternalLink, HiCode } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import type { Project } from '../types';

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-dark-card/60 backdrop-blur-sm transition-all duration-500 hover:border-neon-blue/30 hover:shadow-xl hover:shadow-neon-blue/10"
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-blue/10 text-neon-blue transition-colors group-hover:bg-neon-blue/20">
            <HiCode className="h-6 w-6" />
          </div>
          <div className="flex gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-text-muted transition-all hover:bg-white/10 hover:text-white"
              title="GitHub"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-text-muted transition-all hover:bg-neon-blue/20 hover:text-neon-blue"
                title="Live Demo"
              >
                <HiExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-heading text-lg font-bold text-white transition-colors group-hover:text-gradient-blue">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-text-muted transition-colors group-hover:bg-neon-blue/10 group-hover:text-neon-blue/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-[2px] w-0 bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
