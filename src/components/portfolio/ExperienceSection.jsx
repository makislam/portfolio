import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const experiences = [
  {
    id: 1,
    company: 'SMART-Lab',
    role: 'Robotics Undergraduate Research Assistant',
    location: 'Waterloo, ON',
    period: 'Sept. 2025 - Present',
    type: 'Research',
    logo: '🔬',
    highlights: [
      'Designed a magnetic rotating end effector with a 40:1 strain wave gear for a 6-axis robotic arm',
      'Used inverse kinematics in Python to precisely orient and position microrobots without linkage deadlocks',
    ],
    skills: ['Python', 'Inverse Kinematics', 'Mechanical Design', 'Robotics'],
  },
  {
    id: 2,
    company: 'Tesla',
    role: 'Robotics Hardware Engineer - Optimus',
    location: 'Palo Alto, CA',
    period: 'May - Aug. 2025',
    type: 'Internship',
    logo: '⚡',
    highlights: [
      'Spearheaded calibration repeatability and accuracy validation using DOE and Minitab, reducing assembly time by 15 minutes',
      'Analyzed mainline operations using PFMEA to improve ergonomics and enable mass production transition',
      'Engineered novel processes for installing robotic limbs ensuring safety compliance and optimizing DFA',
      'Designed poka-yoke jigs and fixtures in CATIA V6 for repeatable, error-proof assembly',
      'Triaged firmware/hardware issues using PCAN Explorer and CANape, developed Python validation scripts',
    ],
    skills: ['CATIA V6', 'PFMEA', 'DOE', 'Python', 'Minitab', 'DFA', 'CANape'],
  },
  {
    id: 3,
    company: 'Formlabs',
    role: 'Settings Optimization Engineer (R&D)',
    location: 'Somerville, MA',
    period: 'Sept. - Dec. 2024',
    type: 'Co-op',
    logo: '🖨️',
    highlights: [
      'Optimized 6+ resins using first-principles tuning, owning ~3% of settings by volume in Form 4L',
      'Investigated flowmark artifacts and developed Python script to manipulate print process, eliminating defects',
      'Led reliability testing on LCD panels, increasing efficiency by 57% through optimized testing methodology',
      'Employed metrology tools for dimensional comparison supporting printer R&D and cost-down efforts',
    ],
    skills: ['Python', 'SLA Printing', 'Metrology', 'First Principles', 'R&D'],
  },
  {
    id: 4,
    company: 'Airbus',
    role: 'Integration Engineer - A220 Cabin',
    location: 'Mirabel, QC',
    period: 'Jan. - Apr. 2024',
    type: 'Co-op',
    logo: '✈️',
    highlights: [
      'Delivered 15+ customer response presentations with feasibility studies and design solutions in CATIA V5',
      'Developed automation tools using Google Sheets Apps Script, reducing HoV lead time from 12 to 9 months',
      'Drafted cabin configuration and monument drawings in CATIA V5 supporting HoV engineering',
    ],
    skills: ['CATIA V5', 'ENOVIA', 'Apps Script', 'Aerospace'],
  },
  {
    id: 5,
    company: 'Delta Elevator',
    role: 'Mechanical Design Engineer',
    location: 'Kitchener, ON',
    period: 'May - Aug. 2023',
    type: 'Co-op',
    logo: '🏗️',
    highlights: [
      'Developed 3 adjustable oil buffer stands using Inventor sheet metal and Ansys FEA validation',
      'Designed mechanical joints using DFMA and Lean Manufacturing, prolonging component lifespan by 25%',
    ],
    skills: ['Inventor', 'Ansys FEA', 'Sheet Metal', 'DFMA', 'Lean Manufacturing'],
  },
];

const typeColors = {
  Research: 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
  Internship: 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
  'Co-op': 'bg-accent-light text-accent border-accent-muted dark:bg-accent/20 dark:text-accent-muted dark:border-accent/30',
};

function ExperienceCard({ experience, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative bg-ivory-light dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-ivory-dark dark:border-slate-700 hover:shadow-lg hover:border-cloud-light dark:hover:border-slate-600 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{experience.logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-ivory-light">
                {experience.company}
              </h3>
              <Badge variant="outline" className={`${typeColors[experience.type]} text-xs`}>
                {experience.type}
              </Badge>
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

        {/* Highlights */}
        <ul className="space-y-2 mb-4">
          {experience.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-cloud-dark dark:text-cloud-light">
              <span className="text-accent mt-1.5">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-ivory dark:bg-slate-700 text-cloud-dark dark:text-cloud-light text-xs"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-accent to-accent-muted rounded-2xl p-6 md:p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎓</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">University of Waterloo</h3>
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
        </motion.div>
      </div>
    </section>
  );
}
