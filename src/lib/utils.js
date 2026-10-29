import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// A project can have one category or several (category: ["research", "robotics"]).
export const categoriesOf = (project) =>
  Array.isArray(project.category) ? project.category : [project.category].filter(Boolean);
