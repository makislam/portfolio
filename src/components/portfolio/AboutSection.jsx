import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: 'CAD & Analysis',
    skills: ['SOLIDWORKS', 'CATIA V5/V6', 'Inventor', 'AutoCAD', 'Ansys', 'Abaqus', '3DX', 'ENOVIA'],
  },
  {
    title: 'Manufacturing',
    skills: ['3D Printing', 'Sheet Metal', 'CNC Machining', 'GD&T', 'Tolerance Stackup', 'Validation & Reliability'],
  },
  {
    title: 'Design & Software',
    skills: ['Python', 'C++', 'MATLAB', 'Simulink', 'Arduino', 'DFMA', 'DFMEA', 'V&V'],
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 px-6 bg-white dark:bg-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4">
              About
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 dark:text-white mb-6 leading-tight">
              Engineering with{' '}
              <span className="font-medium">precision</span> and purpose
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                I'm a Mechanical Engineering student at the University of Waterloo with a passion for 
                robotics, manufacturing, and bringing hardware to life. I've had the privilege of working 
                on cutting-edge projects at Tesla, Formlabs, and Airbus.
              </p>
              <p>
                From designing calibration systems for humanoid robots to optimizing 3D printing processes, 
                I thrive at the intersection of mechanical design, manufacturing, and software—where 
                first-principles thinking meets hands-on problem solving.
              </p>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                Available May - Aug. 2026 • Incoming MDE @ Formlabs
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {skillCategories.map((category, catIndex) => (
              <div key={category.title}>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3">
                  {category.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + (catIndex * 0.1) + (index * 0.03) }}
                      className="px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-100 dark:border-slate-600"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
