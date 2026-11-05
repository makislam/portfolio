import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const titles = ['Mechanical Engineer', 'Roboticist', 'Researcher', 'Tinkerer', 'Pilot'];

function useTypewriter(words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

const heroImages = [
  { src: '/hero/me-1.jpg', webpSrc: '/hero/me-1.webp', alt: 'Makis Lam', rotation: -15, stackX: -20, stackY: 0 },
  { src: '/hero/me-3.png', webpSrc: '/hero/me-3.webp', alt: 'Makis Lam', rotation: 5, stackX: 10, stackY: 8 },
  { src: '/hero/me-2.jpg', webpSrc: '/hero/me-2.webp', alt: 'Makis Lam', rotation: 18, stackX: 40, stackY: 4 },
];

export default function Hero() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const typedTitle = useTypewriter(titles, 100, 50, 2000);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Count a visit on mount (shown on the About page)
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/mlam-portfolio/visits/up').catch(() => {});
  }, []);

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
            {typedTitle}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "steps(1)" }}
              className="inline-block w-[3px] h-[0.9em] bg-accent ml-1 align-middle"
            />
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
            onClick={() => navigate('/about')}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            className="relative h-64 md:h-72 w-full max-w-4xl cursor-pointer group"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {heroImages.map((image, index) => {
                const spreadX = (index - 1) * 280; // Spread horizontally when hovered (desktop only)
                const shouldSpread = isHovered && !isMobile;
                return (
                  <motion.div
                    key={index}
                    className="absolute flex flex-col items-center"
                    animate={{
                      x: shouldSpread ? spreadX : image.stackX,
                      y: shouldSpread ? 0 : image.stackY,
                      rotate: shouldSpread ? 0 : image.rotation,
                      zIndex: shouldSpread ? 1 : heroImages.length - index,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: shouldSpread ? index * 0.05 : (heroImages.length - 1 - index) * 0.05,
                    }}
                  >
                    <motion.div
                      className="w-52 md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-slate-800"
                      animate={{
                        scale: shouldSpread ? 1.02 : 1 - index * 0.02,
                        filter: shouldSpread ? 'brightness(1.05)' : 'brightness(1)',
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      style={{
                        boxShadow: shouldSpread
                          ? '0 10px 40px -10px rgba(0,0,0,0.2)'
                          : '0 20px 50px -15px rgba(0,0,0,0.3)',
                      }}
                    >
                      <picture>
                        <source srcSet={image.webpSrc} type="image/webp" />
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchpriority={index === 0 ? 'high' : 'auto'}
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </motion.div>
                    <motion.span
                      className="mt-3 text-sm text-cloud-dark dark:text-cloud-light font-medium"
                      animate={{
                        opacity: shouldSpread ? 1 : 0,
                        y: shouldSpread ? 0 : -10,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: shouldSpread ? 0.15 + index * 0.05 : 0,
                      }}
                    >
                      {image.label}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
            {/* Subtle hint - desktop */}
            {!isMobile && (
              <motion.span
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-cloud dark:text-cloud-light tracking-wide"
                animate={{
                  opacity: isHovered ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {isHovered ? 'Click to view about' : ''}
              </motion.span>
            )}
            {/* Subtle hint - mobile */}
            {isMobile && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-cloud dark:text-cloud-light tracking-wide"
              >
                Tap to learn more
              </motion.span>
            )}
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

    </section>
  );
}
