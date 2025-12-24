import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, X } from 'lucide-react';

const skillCategories = [
  {
    title: 'CAD & Analysis',
    skills: ['SOLIDWORKS', 'CATIA V5/V6', 'OnShape', 'Inventor', 'AutoCAD', 'Ansys', 'Abaqus', '3DX', 'ENOVIA'],
  },
  {
    title: 'Manufacturing',
    skills: ['3D Printing', 'Sheet Metal', 'CNC Machining', 'GD&T', 'Tolerance Stackup', 'Validation & Reliability'],
  },
  {
    title: 'Design & Software',
    skills: ['Python', 'C++', 'MATLAB', 'Simulink', 'Arduino', 'DFMA', 'DFMEA', 'Verification & Validation'],
  },
];

const heroImages = [
  { src: '/hero/me-1.jpg', alt: 'Makis Lam', rotation: -15, stackX: -20, stackY: 0 },
  { src: '/hero/me-3.png', alt: 'Makis Lam', rotation: 5, stackX: 10, stackY: 8 },
  { src: '/hero/me-2.jpg', alt: 'Makis Lam', rotation: 18, stackX: 40, stackY: 4 },
];

export default function Hero() {
  const [showAbout, setShowAbout] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToExperience = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 bg-ivory-light dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-4xl"
      >        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-slate-900 dark:text-ivory-light tracking-tight leading-[1.1]">
          Makis Lam
          <br />
          <span className="font-medium text-accent">
            Mechanical Engineer
          </span>
        </h1>
        {/* Stacked Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={() => setShowAbout(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative h-64 md:h-72 w-full max-w-4xl cursor-pointer"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {heroImages.map((image, index) => {
                const spreadX = (index - 1) * 280; // Spread horizontally when hovered
                return (
                  <motion.div
                    key={index}
                    className="absolute flex flex-col items-center"
                    animate={{
                      x: isHovered ? spreadX : image.stackX,
                      y: isHovered ? 0 : image.stackY,
                      rotate: isHovered ? 0 : image.rotation,
                      zIndex: isHovered ? 1 : heroImages.length - index,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: isHovered ? index * 0.05 : (heroImages.length - 1 - index) * 0.05,
                    }}
                  >
                    <motion.div
                      className="w-52 md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-slate-800"
                      animate={{
                        scale: isHovered ? 1 : 1 - index * 0.02,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      style={{
                        boxShadow: isHovered 
                          ? '0 10px 40px -10px rgba(0,0,0,0.2)' 
                          : '0 20px 50px -15px rgba(0,0,0,0.3)',
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <motion.span
                      className="mt-3 text-sm text-cloud-dark dark:text-cloud-light font-medium"
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? 0 : -10,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: isHovered ? 0.15 + index * 0.05 : 0,
                      }}
                    >
                      {image.label}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        onClick={scrollToExperience}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-cloud-dark dark:text-cloud-light hover:text-accent transition-colors cursor-pointer group"
      >
        <span className="text-xs uppercase tracking-[0.2em]">View More</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-light dark:bg-accent/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-muted/30 dark:bg-accent-muted/10 rounded-full blur-3xl opacity-30" />

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory-light dark:bg-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Header with profile picture */}
              <div className="relative bg-gradient-to-r from-accent to-accent-muted p-8 text-white">
                <button
                  onClick={() => setShowAbout(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0">
                    <img
                      src="public/hero/me-4.jpg"
                      alt="Makis Lam"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-medium mb-1">Makis Lam</h2>
                    <p className="text-ivory/90">Mechanical Engineering @ University of Waterloo</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-12rem)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-accent mb-3">About</h3>
                    <div className="space-y-4 text-cloud-dark dark:text-cloud-light leading-relaxed">
                      <p>
                        I'm a Mechanical Engineering student at the University of Waterloo. I like to work on cool things.
                        I also am a devout Christian, pilot, former Air Cadet, Varsity Frisbee Athlete, and F1 enthusiast. Check out some of my work!
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {skillCategories.map((category) => (
                    <div key={category.title}>
                      <h3 className="text-sm uppercase tracking-[0.2em] text-cloud dark:text-cloud mb-3">
                        {category.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-2 bg-ivory dark:bg-slate-700 rounded-full text-slate-800 dark:text-ivory-light text-sm font-medium border border-ivory-dark dark:border-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
