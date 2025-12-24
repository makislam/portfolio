import React, { useState, useEffect } from 'react';
import { Moon, Sun, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// X (Twitter) icon component
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <header className="fixed top-0 right-0 z-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <a
          href="mailto:makis.lam@uwaterloo.ca"
          className="p-3 rounded-full bg-ivory-light dark:bg-slate-800 shadow-lg border border-ivory-dark dark:border-slate-700 text-slate-800 dark:text-ivory-light hover:text-accent transition-colors"
          aria-label="Email"
        >
          <Mail className="w-5 h-5" />
        </a>

        <a
          href="https://github.com/makislam"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-ivory-light dark:bg-slate-800 shadow-lg border border-ivory-dark dark:border-slate-700 text-slate-800 dark:text-ivory-light hover:text-accent transition-colors"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        
        <a
          href="https://linkedin.com/in/makislam"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-ivory-light dark:bg-slate-800 shadow-lg border border-ivory-dark dark:border-slate-700 text-slate-800 dark:text-ivory-light hover:text-accent transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>

        <a
          href="https://x.com/makis_lam"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-ivory-light dark:bg-slate-800 shadow-lg border border-ivory-dark dark:border-slate-700 text-slate-800 dark:text-ivory-light hover:text-accent transition-colors"
          aria-label="X (Twitter)"
        >
          <XIcon className="w-5 h-5" />
        </a>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className="p-3 rounded-full bg-ivory-light dark:bg-slate-800 shadow-lg border border-ivory-dark dark:border-slate-700 text-slate-800 dark:text-ivory-light hover:text-accent transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </motion.div>
    </header>
  );
}
