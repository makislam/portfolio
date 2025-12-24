import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 bg-ivory-light dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-4xl"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-cloud-dark dark:text-cloud-light mb-6"
        >
          Mechanical Engineering @ University of Waterloo
        </motion.p>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-slate-900 dark:text-ivory-light tracking-tight leading-[1.1]">
          Makis Lam
          <br />
          <span className="font-medium text-accent">
            Robotics & Manufacturing
          </span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 text-lg md:text-xl text-cloud-dark dark:text-cloud-light max-w-2xl mx-auto font-light leading-relaxed"
        >
          Building the future of robotics and manufacturing. Experience at Tesla Optimus, Formlabs, and Airbus.
        </motion.p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        onClick={scrollToProjects}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-cloud-dark dark:text-cloud-light hover:text-accent transition-colors cursor-pointer group"
      >
        <span className="text-xs uppercase tracking-[0.2em]">View Projects</span>
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
