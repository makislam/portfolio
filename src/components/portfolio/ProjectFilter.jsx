import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'mechanical', label: 'Mechanical Design' },
  { value: 'automation', label: 'Automation' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' }
];

export default function ProjectFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onFilterChange(category.value)}
          className={cn(
            "relative px-5 py-2.5 text-sm font-medium rounded-full transition-colors",
            activeFilter === category.value
              ? "text-ivory-light"
              : "text-cloud-dark dark:text-cloud-light hover:text-slate-900 dark:hover:text-ivory-light"
          )}
        >
          {activeFilter === category.value && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-slate-900 dark:bg-slate-700 rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{category.label}</span>
        </button>
      ))}
    </div>
  );
}
