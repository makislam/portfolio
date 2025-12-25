import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import Hero from '@/components/portfolio/Hero';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectFilter from '@/components/portfolio/ProjectFilter';
import ProjectModal from '@/components/portfolio/ProjectModal';
import ExperienceSection from '@/components/portfolio/ExperienceSection';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.category === activeFilter);
  }, [projects, activeFilter]);

  return (
    <div className="min-h-screen bg-ivory-light dark:bg-slate-900">
      <Hero />

      <ExperienceSection />

      {/* Projects Section */}
      <section id="projects" className="py-24 md:py-32 px-6 bg-ivory dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">
              Selected Work
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-ivory-light">
              Featured <span className="font-medium">Projects</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <ProjectFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-cloud-dark dark:text-cloud-light text-lg">
                No projects found in this category yet.
              </p>
              <p className="text-cloud dark:text-cloud text-sm mt-2">
                Add projects from the dashboard to showcase your work.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Footer
      <footer className="py-8 px-6 bg-slate-900 dark:bg-slate-900 text-center border-t border-slate-700">
        <p className="text-cloud text-sm">
          © {new Date().getFullYear()} Makis Lam. All rights reserved.
        </p>
      </footer> */}

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
