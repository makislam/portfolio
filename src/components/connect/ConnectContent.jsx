import React from 'react';
import { motion } from 'framer-motion';
import { FileText, GraduationCap, Briefcase, Mail } from 'lucide-react';

const links = [
  {
    icon: Briefcase,
    label: 'Resume',
    description: 'One-page summary of my experience',
    href: '/resume.pdf',
  },
  {
    icon: FileText,
    label: 'Curriculum Vitae',
    description: 'Full detail on my projects and work',
    href: '/Makis_Lam_Curriculum_Vitae.pdf',
  },
  {
    icon: GraduationCap,
    label: 'Official Transcript',
    description: 'Academic record',
    href: '/Official_Transcript.pdf',
  },
];

export default function ConnectContent({ firstName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-accent mb-4">Great to meet you{firstName ? `, ${firstName}` : ''}</p>
        <h1 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-ivory-light mb-3">
          Makis <span className="font-medium">Lam</span>
        </h1>
        <p className="text-cloud-dark dark:text-cloud">
          Here's everything you need. I'll be in touch soon.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {links.map(({ icon: Icon, label, description, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-ivory-dark dark:border-slate-700 bg-ivory-light dark:bg-slate-800 px-5 py-4 hover:border-accent transition-colors group"
          >
            <div className="p-2 rounded-full bg-ivory dark:bg-slate-700 text-accent">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-ivory-light group-hover:text-accent transition-colors">
                {label}
              </p>
              <p className="text-sm text-cloud-dark dark:text-cloud">{description}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center border-t border-ivory-dark dark:border-slate-700 pt-6">
        <p className="text-sm text-cloud-dark dark:text-cloud mb-3">Or reach me directly</p>
        <a
          href="mailto:makis.lam@uwaterloo.ca"
          className="inline-flex items-center gap-2 text-slate-900 dark:text-ivory-light hover:text-accent transition-colors font-medium"
        >
          <Mail className="w-4 h-4" />
          makis.lam@uwaterloo.ca
        </a>
      </div>
    </motion.div>
  );
}
