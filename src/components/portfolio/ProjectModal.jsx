import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectModal({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!project) return null;

  // Get images array, fallback to single image_url
  const images = project.images?.length > 0 
    ? project.images 
    : project.image_url 
      ? [project.image_url] 
      : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header Image Gallery */}
          <div className="relative h-64 md:h-80 bg-slate-100 dark:bg-slate-700">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                  <span className="text-8xl font-light text-indigo-200 dark:text-indigo-700">
                    {project.title?.charAt(0)}
                  </span>
                </div>
                
                {/* Navigation arrows - only show if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                <span className="text-8xl font-light text-indigo-200 dark:text-indigo-700">
                  {project.title?.charAt(0)}
                </span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 overflow-y-auto max-h-[calc(90vh-20rem)]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium text-slate-900 dark:text-white mb-2">
                  {project.title}
                </h2>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm capitalize dark:border-slate-600 dark:text-slate-300">
                    {project.category}
                  </Badge>
                  {project.year && (
                    <span className="text-sm text-slate-400 dark:text-slate-500">{project.year}</span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
              {project.long_description || project.description}
            </p>

            {/* Technologies */}
            {project.technologies?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              {project.live_url && (
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button asChild variant="outline">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
