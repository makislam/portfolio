import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const experiences = [
  {
    id: 1,
    company: 'Formlabs',
    role: 'SLS Mechanical Design Engineer',
    location: 'Somerville, MA',
    period: 'Jan. 2026 - Present',
    type: 'Internship',
    logo: '/logos/Formlabs.png',
    website: 'https://formlabs.com/',
  },
  {
    id: 2,
    company: 'SMART-Lab',
    role: 'Robotics Undergraduate Research Assistant',
    location: 'Waterloo, ON',
    period: 'Sept. 2025 - Present',
    type: 'Research',
    logo: '/logos/Smart.png',
    website: 'https://uwaterloo.ca/smart-materials-advanced-robotic-technologies/',
  },
  {
    id: 3,
    company: 'Tesla',
    role: 'Robotics Hardware Engineer - Optimus',
    location: 'Palo Alto, CA',
    period: 'May - Aug. 2025',
    type: 'Internship',
    logo: '/logos/Telsa.png',
    website: 'https://www.tesla.com/en_ca/AI',
  },
  {
    id: 4,
    company: 'printbnb',
    role: 'CEO & Co-Founder',
    location: 'Waterloo, ON',
    period: 'May 2022 - Dec. 2025',
    type: 'Startup',
    logo: '/logos/printbnb.jpg',
    website: 'https://printbnb.ca/',
  },
  {
    id: 5,
    company: 'Formlabs',
    role: 'SLA Settings Optimization Engineer (R&D)',
    location: 'Somerville, MA',
    period: 'Sept. - Dec. 2024',
    type: 'Internship',
    logo: '/logos/Formlabs.png',
    website: 'https://formlabs.com/',
  },
  {
    id: 6,
    company: 'Composites Research Group',
    role: 'Undergraduate Research Assistant',
    location: 'Waterloo, ON',
    period: 'May - Aug. 2024',
    type: 'Research',
    logo: '/logos/Waterloo.png',
    website: 'https://uwaterloo.ca/composites-research-group/',
  },
  {
    id: 7,
    company: 'Airbus',
    role: 'Integration Engineer - A220 Cabin',
    location: 'Mirabel, QC',
    period: 'Jan. - Apr. 2024',
    type: 'Internship',
    logo: '/logos/Airbus.png',
    website: 'https://www.airbus.com/en',
  },
  {
    id: 8,
    company: 'Delta Elevator',
    role: 'Mechanical Design Engineer',
    location: 'Kitchener, ON',
    period: 'May - Aug. 2023',
    type: 'Internship',
    logo: '/logos/Delta.png',
    website: 'https://delta-elevator.com/',
  },
];

const typeColors = {
  Research: 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
  Internship: 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
  'Co-op': 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
  Startup: 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
};

function ExperienceCard({ experience, index }) {
  return (
    <motion.a
      href={experience.website}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block cursor-pointer"
    >
      <div className="relative bg-ivory-light dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-ivory-dark dark:border-slate-700 hover:shadow-lg hover:border-accent dark:hover:border-accent transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {experience.logo.startsWith('/') ? (
              <img src={experience.logo} alt={experience.company} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-4xl">{experience.logo}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-ivory-light group-hover:text-accent transition-colors">
                {experience.company}
              </h3>
              <Badge variant="outline" className={`${typeColors[experience.type]} text-xs`}>
                {experience.type}
              </Badge>
              <ExternalLink className="w-4 h-4 text-cloud-light group-hover:text-accent transition-colors" />
            </div>
            <p className="text-accent dark:text-accent-muted font-medium">
              {experience.role}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-cloud-dark dark:text-cloud-light">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {experience.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {experience.period}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 md:py-32 px-6 bg-ivory dark:bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-accent dark:text-accent-muted mb-4">
            Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-ivory-light">
            Where I've <span className="font-medium">Worked</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}
        </div>

        {/* Education */}
        <motion.a
          href="https://uwaterloo.ca/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 block group cursor-pointer"
        >
          <div className="bg-gradient-to-r from-accent to-accent-muted rounded-2xl p-6 md:p-8 text-white hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/logos/Waterloo.png" alt="University of Waterloo" className="w-14 h-14 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold">University of Waterloo</h3>
                  <ExternalLink className="w-4 h-4 text-ivory/70 group-hover:text-white transition-colors" />
                </div>
                <p className="text-ivory/90 font-medium">
                  Bachelor of Applied Science, Honours Mechanical Engineering, Co-op
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-ivory-dark">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Waterloo, ON
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Sept. 2022 - Apr. 2027
                  </span>
                  <span className="font-semibold text-white">3.8/4.0 GPA</span>
                </div>
              </div>
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
