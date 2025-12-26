import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectModal({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [expandedImage, setExpandedImage] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  // Reset image index and video state when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setShowVideo(false);
    setExpandedImage(false);
    setVideoMuted(false);
  }, [project?.id]);
  
  if (!project) return null;

  // Get images array, fallback to single image_url
  const images = project.images?.length > 0 
    ? project.images 
    : project.image_url 
      ? [project.image_url] 
      : [];

  // Helper function to check if file is a video
  const isVideo = (filename) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(filename);
  };

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
          className="bg-ivory-light dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header Image Gallery */}
          <div className="relative h-48 sm:h-64 md:h-80 bg-white dark:bg-slate-900">
            {images.length > 0 ? (
              <>
                {isVideo(images[currentImageIndex]) ? (
                  <video
                    key={images[currentImageIndex]}
                    src={images[currentImageIndex]}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-ivory-dark to-ivory dark:from-slate-700 dark:to-slate-800">
                      <span className="text-8xl font-light text-cloud-light dark:text-slate-600">
                        {project.title?.charAt(0)}
                      </span>
                    </div>
                  </>
                )}
                
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ivory-dark to-ivory dark:from-slate-700 dark:to-slate-800">
                <span className="text-8xl font-light text-cloud-light dark:text-slate-600">
                  {project.title?.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Expand button - only show for images, not videos */}
            {images.length > 0 && !isVideo(images[currentImageIndex]) && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedImage(true); }}
                className="absolute top-4 right-14 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-10 overflow-y-auto max-h-[calc(90vh-14rem)] sm:max-h-[calc(90vh-18rem)] md:max-h-[calc(90vh-20rem)]">
            <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-slate-900 dark:text-ivory-light mb-2">
                  {project.title}
                </h2>
                <Badge variant="outline" className="text-xs sm:text-sm capitalize dark:border-slate-600 dark:text-cloud-light">
                  {project.category}
                </Badge>
              </div>
            </div>

            <p className="text-cloud-dark dark:text-cloud-light text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
              {project.long_description || project.description}
            </p>

            {/* Technologies */}
            {project.technologies?.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm uppercase tracking-wider text-cloud dark:text-cloud mb-2 sm:mb-3">
                  Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-ivory dark:bg-slate-700 text-cloud-dark dark:text-cloud-light hover:bg-ivory-dark dark:hover:bg-slate-600 text-xs sm:text-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-ivory-dark dark:border-slate-700">
              {project.video_url && (
                <Button onClick={() => setShowVideo(true)} className="bg-accent hover:bg-accent/90">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                </Button>
              )}
              {project.live_url && (
                <Button asChild className="bg-accent hover:bg-accent/90">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View More
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

        {/* Video Modal */}
        <AnimatePresence>
          {showVideo && project.video_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideo(false)}
              className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl aspect-video"
              >
                <video
                  key={project.video_url}
                  className="w-full h-full rounded-2xl"
                  controls
                  playsInline
                  onLoadedData={(e) => {
                    e.target.play().catch(err => console.error('Play error:', err));
                  }}
                  onError={(e) => console.error('Video error:', e)}
                  onStalled={(e) => console.log('Video stalled')}
                  onWaiting={(e) => console.log('Video waiting')}
                  onSuspend={(e) => console.log('Video suspended')}
                >
                  <source src={project.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Image Modal */}
        <AnimatePresence>
          {expandedImage && images.length > 0 && !isVideo(images[currentImageIndex]) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedImage(false)}
              className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
            >
              {/* Close button */}
              <button
                onClick={() => setExpandedImage(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation arrows - positioned at screen edges */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="px-16 md:px-24 py-8 flex items-center justify-center"
              >
                <img
                  src={images[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                />
              </motion.div>
              
              {/* Image indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((img, idx) => (
                    !isVideo(img) && (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          idx === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    )
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
