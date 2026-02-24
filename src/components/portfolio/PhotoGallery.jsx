import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Gallery photos from /public/gallery/
const galleryPhotos = [
  { src: '/gallery/DSC02866 from MEGA.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04088-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04190-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04221.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04287-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04336-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04402-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04715-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC04756-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05220-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05264-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05630.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05667.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05691.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05744.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05792.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05846.jpg', alt: 'Photo' },
  { src: '/gallery/DSC05983.jpg', alt: 'Photo' },
  { src: '/gallery/DSC06115-Enhanced-NR.jpg', alt: 'Photo' },
  { src: '/gallery/DSC06251.jpg', alt: 'Photo' },
  { src: '/gallery/DSC06534.jpg', alt: 'Photo' },
  { src: '/gallery/DSC08241.jpg', alt: 'Photo' },
  { src: '/gallery/DSC08295.jpg', alt: 'Photo' },
  { src: '/gallery/DSCF5052.jpg', alt: 'Photo' },
  { src: '/gallery/IMG_20240220_142427.jpg', alt: 'Photo' },
  { src: '/gallery/IMG_2079.JPG', alt: 'Photo' },
  { src: '/gallery/img_4557.jpg', alt: 'Photo' },
  { src: '/gallery/Lam2.png', alt: 'Photo' },
  { src: '/gallery/pilot-1.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20220606_214158594.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20220731_140018728.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20230701_202625058~2.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20230729_180615293.MP.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20230830_132932630.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20230903_193421739.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20240107_052016544.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20250928_000929729.RAW-01.COVER.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20251014_143312997.RAW-01.COVER.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20251014_162942558.RAW-01.COVER.jpg', alt: 'Photo' },
  { src: '/gallery/PXL_20251015_002911593.RAW-01.COVER.jpg', alt: 'Photo' },
  { src: '/gallery/received_1100739887698529.jpeg', alt: 'Photo' },
  { src: '/gallery/received_2030490920804957.jpeg', alt: 'Photo' },
];

// Derive the thumbnail WebP path from an original gallery image path
function getThumbSrc(src) {
  const dir = src.substring(0, src.lastIndexOf('/') + 1);
  const file = src.substring(src.lastIndexOf('/') + 1);
  const lastDot = file.lastIndexOf('.');
  const name = lastDot !== -1 ? file.substring(0, lastDot) : file;
  return `${dir}thumb-${name}.webp`;
}

export default function PhotoGallery({ isOpen, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setDirection(-1);
    setSelectedIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    setSelectedIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (selectedIndex !== null) {
      if (e.key === 'ArrowLeft') goToPrevious(e);
      if (e.key === 'ArrowRight') goToNext(e);
      if (e.key === 'Escape') setSelectedIndex(null);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ivory-light dark:bg-slate-900 z-[60] overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-ivory-light/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-ivory-dark/20 dark:border-slate-700/50">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div>
            <h2 className="text-lg md:text-xl font-medium text-slate-900 dark:text-ivory-light">Gallery</h2>
            <p className="text-xs text-cloud-dark dark:text-cloud-light">A collection of moments</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ivory-dark/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-900 dark:text-ivory-light" />
          </button>
        </div>
      </div>

      {/* VSCO-style Grid */}
      <div className="h-full overflow-y-auto pt-20 pb-8 px-1 md:px-4">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-1 md:gap-2 max-w-7xl mx-auto">
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="mb-1 md:mb-2 break-inside-avoid"
            >
              <button
                onClick={() => setSelectedIndex(index)}
                className="relative w-full group cursor-pointer block"
              >
                <picture>
                  <source srcSet={getThumbSrc(photo.src)} type="image/webp" />
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto object-cover rounded-sm"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                {/* Hover overlay - VSCO style minimal */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-sm" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox for selected image */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Photo counter */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-light">
              {selectedIndex + 1} / {galleryPhotos.length}
            </div>

            {/* Main image container */}
            <div
              className="relative w-full h-full flex items-center justify-center px-4 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous button */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-8 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>

              {/* Image */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={selectedIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center max-w-5xl w-full"
                  onClick={() => setSelectedIndex(null)}
                >
                  <img
                    src={galleryPhotos[selectedIndex].src}
                    alt={galleryPhotos[selectedIndex].alt}
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next button */}
              <button
                onClick={goToNext}
                className="absolute right-2 md:right-8 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
