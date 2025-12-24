import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Updated category styles with minimalist palette
const categoryStyles = {
  robotics: "bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30",
  mechanical: "bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30",
  automation: "bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30",
  software: "bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30",
  other: "bg-ivory-dark text-cloud-dark border-cloud-light dark:bg-slate-700 dark:text-cloud-light dark:border-slate-600"
};

export default function ProjectCard({ project, index, onSelect }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(project)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-ivory-dark dark:bg-slate-700 aspect-[4/3] mb-5">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ivory-dark to-ivory dark:from-slate-700 dark:to-slate-800">
            <span className="text-6xl font-light text-cloud-light dark:text-slate-600">
              {project.title?.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-accent text-white border-0 text-xs">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium text-slate-900 dark:text-ivory-light group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-cloud-light dark:text-slate-600 group-hover:text-accent transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 flex-shrink-0 mt-1" />
        </div>
        
        <p className="text-cloud-dark dark:text-cloud-light text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-1">
          <Badge variant="outline" className={`${categoryStyles[project.category] || categoryStyles.other} text-xs font-normal capitalize`}>
            {project.category}
          </Badge>
          {project.year && (
            <span className="text-xs text-cloud dark:text-cloud">{project.year}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
