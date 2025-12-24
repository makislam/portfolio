// Base44 API Client Stub
// Portfolio projects for Makis Lam

// To add images:
// 1. Create folder: public/projects/
// 2. Add images like: public/projects/printbnb-1.jpg, public/projects/printbnb-2.jpg
// 3. Reference as: /projects/printbnb-1.jpg (no 'public' in path)

const sampleProjects = [
  {
    id: '1',
    title: 'printbnb',
    description: 'Co-founded a 3D printing marketplace connecting users with local printer operators.',
    long_description: 'Co-founded and led a company of 7 engineers to create a website/network tackling the problem of 3D printing accessibility. Developed ordering, chat, and dashboard features in ReactJS, Tailwind, and Firebase, streamlining the process for users to order and receive 3D-printed parts. Directed team scope, schedule, and priorities to maximize resource efficiency and meet stakeholder objectives.',
    category: 'software',
    image_url: '/projects/printbnb-1.png',
    images: [
      '/projects/printbnb-1.png',
      '/projects/printbnb-2.png',
      '/projects/printbnb-3.png',
      '/projects/printbnb-4.png',
      '/projects/printbnb-5.png',
      '/projects/printbnb-6.png',
    ],
    technologies: ['ReactJS', 'Tailwind CSS', 'Firebase', 'Web Development', 'Product Management'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2024',
    created_date: '2024-01-01',
  },
  {
    id: '2',
    title: '"28:19" - 3D Printed Fixed Wing Drone',
    description: 'Autonomous FDM printed drone with aerodynamic analysis and structural optimization.',
    long_description: 'Researched and developed an autonomous FDM printed drone using SolidWorks. Performed low-fidelity analysis with Xfoil, OpenVSP, and Fluent on different airfoils to calculate lift and drag coefficients, achieving the maximum gross weight. Engineered the internal structure for an optimized strength-to-weight ratio and verified the design under realistic sample loads through structural analysis in Ansys. Next steps: Make the drone autonomous.',
    category: 'robotics',
    image_url: '/projects/drone-1.png',
    images: [
      '/projects/drone-1.png',
      '/projects/drone-2.png',
    ],
    technologies: ['SolidWorks', 'Xfoil', 'OpenVSP', 'Ansys Fluent', 'FDM 3D Printing', 'CFD'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2024',
    created_date: '2024-02-15',
  },
  {
    id: '3',
    title: 'Waterloo Rocketry - Modular Curing Oven',
    description: 'Redesigned ducting system with pitot-static safety integration for CSA certification.',
    long_description: 'Redesigned the ducting system of the curing oven to reduce air bleed and increase heat retention. Designed and integrated a pitot-static safety system that monitored airflow within the ducting system and controlled the heater. Spearheaded the Canadian Standards Association (CSA) upgrades to meet certification standards.',
    category: 'mechanical',
    image_url: '/projects/rocketry-1.png',
    images: [
      '/projects/rocketry-1.png',
      '/projects/rocketry-2.png',
      '/projects/rocketry-3.png',
      '/projects/rocketry-4.png',
      '/projects/rocketry-5.png',
      '/projects/rocketry-6.png',
    ],
    technologies: ['SolidWorks', 'Thermal Analysis', 'Sheet Metal Design', 'Safety Systems', 'CSA Standards'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2024',
    created_date: '2024-03-20',
  },
  {
    id: '4',
    title: 'All-Terrain Racing Drone',
    description: '1st Place McMaster CAD Hackathon - Amphibious drone designed in 24 hours.',
    long_description: 'Placed First Place at McMaster CAD Hackathon. Performed a needs analysis and broke the complex design problem into its first principles. Modeled the drone in SolidWorks with proper tolerances taking DFM with various manufacturing methods into account. Improved propeller thrust in multiple fluids using SolidWorks CFD leading to a 50% maximum fluid velocity increase.',
    category: 'robotics',
    image_url: '/projects/hackathon-1.png',
    images: [
      '/projects/hackathon-1.png',
      '/projects/hackathon-2.png',
      '/projects/hackathon-3.png',
      '/projects/hackathon-4.png',
    ],
    technologies: ['SolidWorks', 'CFD Simulation', 'DFM', 'Rapid Prototyping', 'First Principles Design'],
    github_url: '',
    live_url: '',
    featured: true,
    year: '2024',
    created_date: '2024-04-10',
  },
];

export const base44 = {
  entities: {
    Project: {
      list: async (sortBy = '-created_date') => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Sort projects
        const sorted = [...sampleProjects].sort((a, b) => {
          const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
          const direction = sortBy.startsWith('-') ? -1 : 1;
          
          if (a[field] < b[field]) return -1 * direction;
          if (a[field] > b[field]) return 1 * direction;
          return 0;
        });
        
        return sorted;
      },
      
      get: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return sampleProjects.find(p => p.id === id);
      },
    },
  },
};
